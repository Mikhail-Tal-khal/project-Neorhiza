import { expect, test } from "@playwright/test";
import Stripe from "stripe";
import * as checkoutRoute from "@/app/api/donations/checkout/route";
import * as webhookRoute from "@/app/api/stripe/webhook/route";
import { POST as contactPOST } from "@/app/api/contact/route";
import { normalizeTypedAmount, parseAmountToCents } from "@/lib/donations/amount";
import { donationSettings, resetDonationConfigWarnings } from "@/lib/donations/config";
import { verifyCheckoutSession } from "@/lib/donations/checkout";
import { createStripeClient } from "@/lib/donations/stripe";
import { resetEventStore } from "@/lib/donations/event-store";
import { logRecorder, setDonationRecorder, type DonationEventRecord } from "@/lib/donations/records";

/**
 * In-process tests for the donation flow. Stripe is mocked completely:
 * the SDK's fetch-based HTTP client goes through a stubbed globalThis.fetch,
 * so no request ever leaves the process and no real Checkout Session or
 * payment is created.
 */

// Built by concatenation so secret scanners do not mistake this fake for a real key.
const SECRET_KEY = ["sk", "test", "51FAKEfakeFAKEfakeKeyNotReal000000"].join("_");
const WEBHOOK_SECRET = "whsec_fakeFAKEfakeSigningSecret0000";
const SESSION_URL = "https://checkout.stripe.com/c/pay/cs_test_a1FAKEsessionURLsecretFragment#fidkdWxOYHwnPyd1blpxYHZxWjA0";
const DONOR_EMAIL = "donor.private@example.org";

const ENV_KEYS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "DONATION_CURRENCY",
  "DONATION_MIN_AMOUNT",
  "DONATION_MAX_AMOUNT",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "NEORHIZA_KV_REST_API_URL",
  "NEORHIZA_KV_REST_API_TOKEN",
  "CONTACT_WEBHOOK_URL",
  "RESEND_API_KEY",
  "VERCEL_ENV",
] as const;

type Call = { url: string; method: string; body: string; headers: Headers };

let calls: Call[] = [];
let stripeResponder: (call: Call) => Response | Promise<Response>;
let upstashResponder: (call: Call) => Response | Promise<Response>;
let logs: string[] = [];
let ipCounter = 0;
const savedEnv: Partial<Record<string, string>> = {};
const realFetch = globalThis.fetch;
const realConsole = { log: console.log, info: console.info, warn: console.warn, error: console.error };

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "request-id": "req_test" } });

function fakeSession(overrides: Record<string, unknown> = {}) {
  return {
    id: "cs_test_a1B2c3D4e5F6g7H8",
    object: "checkout.session",
    mode: "payment",
    status: "complete",
    payment_status: "paid",
    amount_total: 10000,
    currency: "usd",
    payment_intent: "pi_3FAKEpaymentIntent01",
    metadata: { project: "neorhiza", purpose: "research-support" },
    customer_details: { email: DONOR_EMAIL, name: "Private Donor" },
    url: null,
    ...overrides,
  };
}

const stripeCalls = () => calls.filter((c) => c.url.includes("api.stripe.com"));

function nextIp() {
  ipCounter += 1;
  return `203.0.113.${ipCounter % 250}-${process.pid}-${ipCounter}`;
}

function checkout(body: unknown, init: { ip?: string; headers?: Record<string, string>; method?: string } = {}) {
  return checkoutRoute.POST(
    new Request("http://localhost/api/donations/checkout", {
      method: init.method ?? "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": init.ip ?? nextIp(),
        ...init.headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

test.beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
  process.env.STRIPE_SECRET_KEY = SECRET_KEY;
  process.env.STRIPE_WEBHOOK_SECRET = WEBHOOK_SECRET;
  resetDonationConfigWarnings();
  resetEventStore();
  setDonationRecorder(logRecorder);

  calls = [];
  stripeResponder = () => json(200, { ...fakeSession({ status: "open", payment_status: "unpaid" }), url: SESSION_URL });
  upstashResponder = () => json(200, [{ result: 1 }, { result: 1 }, { result: 600000 }]);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const call: Call = {
      url: String(input instanceof Request ? input.url : input),
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
      headers: new Headers(init?.headers),
    };
    calls.push(call);
    if (call.url.includes("api.stripe.com")) return stripeResponder(call);
    if (call.url.includes("upstash")) return upstashResponder(call);
    throw new Error(`Unexpected outbound request in test: ${call.url}`);
  }) as typeof fetch;

  logs = [];
  for (const level of ["log", "info", "warn", "error"] as const) {
    console[level] = (...args: unknown[]) => logs.push(args.map(String).join(" "));
  }
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
  Object.assign(console, realConsole);
  setDonationRecorder(logRecorder);
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

/** Secrets, personal data and Checkout URLs never reach the logs. */
function expectCleanLogs() {
  const joined = logs.join("\n");
  for (const value of [SECRET_KEY, WEBHOOK_SECRET, SESSION_URL, "checkout.stripe.com", DONOR_EMAIL, "Private Donor", "sk_test_"]) {
    expect(joined).not.toContain(value);
  }
}

/* ------------------------------------------------------------------ */

test.describe("amount validation", () => {
  const limits = { minAmount: 5, maxAmount: 50_000, currency: "usd" } as const;

  test("accepts every preset and converts to integer cents", () => {
    for (const [input, cents] of [
      ["25", 2500],
      ["50", 5000],
      ["100", 10000],
      ["250", 25000],
      ["500", 50000],
      [250, 25000],
    ] as const) {
      expect(parseAmountToCents(input, limits)).toEqual({ ok: true, cents });
    }
  });

  test("accepts custom amounts with up to two decimals without floating-point error", () => {
    expect(parseAmountToCents("75.5", limits)).toEqual({ ok: true, cents: 7550 });
    expect(parseAmountToCents("19.99", limits)).toEqual({ ok: true, cents: 1999 });
    expect(parseAmountToCents(19.99, limits)).toEqual({ ok: true, cents: 1999 });
    expect(parseAmountToCents("1234.56", limits)).toEqual({ ok: true, cents: 123456 });
  });

  test("enforces the minimum and maximum exactly", () => {
    expect(parseAmountToCents("5", limits)).toEqual({ ok: true, cents: 500 });
    expect(parseAmountToCents("50000", limits)).toEqual({ ok: true, cents: 5_000_000 });
    expect(parseAmountToCents("4.99", limits)).toMatchObject({ ok: false, reason: "below-minimum" });
    expect(parseAmountToCents("0", limits)).toMatchObject({ ok: false, reason: "below-minimum" });
    expect(parseAmountToCents("50000.01", limits)).toMatchObject({ ok: false, reason: "above-maximum" });
    expect(parseAmountToCents("999999999", limits)).toMatchObject({ ok: false, reason: "above-maximum" });
  });

  test("rejects malformed, negative and decimal-abuse values", () => {
    for (const input of [
      "-5", "-0.01", "+5", "5.001", "5.", ".5", "05", "1e3", "1e+21", "0x10", "Infinity", "NaN",
      " 5", "5 ", "1,000", "$5", "5,00", "10.5.5", "", "five", "１００",
      -5, 1e21, 0.1 + 0.2, Number.NaN, Number.POSITIVE_INFINITY, null, undefined, true, {}, [], ["100"],
    ]) {
      expect(parseAmountToCents(input, limits), JSON.stringify(input)).toMatchObject({ ok: false, reason: "invalid" });
    }
  });

  test("normalizes what visitors type before validation", () => {
    expect(normalizeTypedAmount(" $1,000.50 ")).toBe("1000.50");
    expect(normalizeTypedAmount("€ 75")).toBe("75");
  });

  test("settings default to USD 5–50,000 with all presets", () => {
    expect(donationSettings()).toEqual({ currency: "usd", minAmount: 5, maxAmount: 50000, presets: [25, 50, 100, 250, 500] });
  });

  test("settings honor valid overrides and fall back on invalid ones without printing values", () => {
    Object.assign(process.env, { DONATION_CURRENCY: "EUR", DONATION_MIN_AMOUNT: "30", DONATION_MAX_AMOUNT: "300" });
    expect(donationSettings()).toEqual({ currency: "eur", minAmount: 30, maxAmount: 300, presets: [50, 100, 250] });

    resetDonationConfigWarnings();
    Object.assign(process.env, { DONATION_CURRENCY: "jpy", DONATION_MIN_AMOUNT: "100", DONATION_MAX_AMOUNT: "10" });
    expect(donationSettings()).toMatchObject({ currency: "usd", minAmount: 5, maxAmount: 50000 });
    expect(logs.join("\n")).toMatch(/DONATION_CURRENCY.*DONATION_MIN_AMOUNT must be lower/);
    expect(logs.join("\n")).not.toContain("jpy");
  });
});

/* ------------------------------------------------------------------ */

test.describe("POST /api/donations/checkout", () => {
  test("creates a server-built Checkout Session and returns only its URL", async () => {
    const res = await checkout({ amount: "100", currency: "usd" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, url: SESSION_URL });

    const [call] = stripeCalls();
    expect(stripeCalls()).toHaveLength(1);
    expect(call.method).toBe("POST");
    expect(call.url).toMatch(/\/v1\/checkout\/sessions$/);
    expect(call.headers.get("authorization")).toBe(`Bearer ${SECRET_KEY}`);

    const params = new URLSearchParams(call.body);
    expect(params.get("mode")).toBe("payment");
    expect(params.get("submit_type")).toBe("donate");
    expect(params.get("line_items[0][quantity]")).toBe("1");
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("10000");
    expect(params.get("line_items[0][price_data][currency]")).toBe("usd");
    expect(params.get("line_items[0][price_data][product_data][name]")).toBe("Contribution to Project Neorhiza");
    expect(params.get("metadata[project]")).toBe("neorhiza");
    expect(params.get("metadata[purpose]")).toBe("research-support");
    expect(params.get("payment_intent_data[metadata][project]")).toBe("neorhiza");
    expect(params.get("success_url")).toBe("https://www.neorhiza.space/funding/success?session_id={CHECKOUT_SESSION_ID}");
    expect(params.get("cancel_url")).toBe("https://www.neorhiza.space/funding/cancelled");
    // Stripe collects the email itself; nothing personal is sent from here.
    expect(params.has("customer_email")).toBe(false);
    expect([...params.keys()].filter((k) => k.startsWith("metadata["))).toEqual(["metadata[project]", "metadata[purpose]"]);
    expectCleanLogs();
  });

  test("converts a custom amount server-side and ignores browser-supplied Stripe fields", async () => {
    const res = await checkout({
      amount: "12.34",
      currency: "USD",
      unit_amount: 1,
      cents: 1,
      metadata: { project: "other", email: DONOR_EMAIL },
      success_url: "https://evil.example/",
    });
    expect(res.status).toBe(200);
    const params = new URLSearchParams(stripeCalls()[0].body);
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("1234");
    expect(params.get("metadata[project]")).toBe("neorhiza");
    expect(params.get("success_url")).toContain("https://www.neorhiza.space/");
    expect(call0Body()).not.toContain("evil.example");
    expect(call0Body()).not.toContain(encodeURIComponent(DONOR_EMAIL));
  });

  test("defaults the currency when omitted and rejects any other currency", async () => {
    expect((await checkout({ amount: 50 })).status).toBe(200);
    const res = await checkout({ amount: 50, currency: "eur" });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toBe("Contributions are accepted in USD only.");
    expect((await checkout({ amount: 50, currency: 840 })).status).toBe(400);
    expect(stripeCalls()).toHaveLength(1);
  });

  for (const [label, amount, message] of [
    ["below the minimum", "4.99", "The minimum contribution is $5."],
    ["above the maximum", "50000.01", "The maximum online contribution is $50,000. For larger support, please start a funding conversation."],
    ["negative", "-25", "Please enter a valid amount, for example 50 or 75.50."],
    ["three decimals", "25.001", "Please enter a valid amount, for example 50 or 75.50."],
    ["an exponent", "5e3", "Please enter a valid amount, for example 50 or 75.50."],
    ["missing", undefined, "Please enter a valid amount, for example 50 or 75.50."],
  ] as const) {
    test(`rejects an amount ${label} without calling Stripe`, async () => {
      const res = await checkout({ amount, currency: "usd" });
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, message });
      expect(stripeCalls()).toHaveLength(0);
    });
  }

  test("rejects invalid JSON, non-object bodies, wrong content types and oversized bodies", async () => {
    for (const body of ["{not json", "[]", "null", '"100"', ""]) {
      const res = await checkout(body);
      expect(res.status, body).toBe(400);
      expect(await res.json()).toEqual({ ok: false, message: "Invalid request format." });
    }
    expect((await checkout({ amount: "100" }, { headers: { "content-type": "text/plain" } })).status).toBe(415);
    expect((await checkout({ amount: "100", pad: "x".repeat(2000) })).status).toBe(413);
    expect((await checkout("{}", { headers: { "content-length": "999999" } })).status).toBe(413);
    expect(stripeCalls()).toHaveLength(0);
  });

  test("answers unsupported methods with 405 and Allow: POST", async () => {
    for (const method of ["GET", "PUT", "PATCH", "DELETE"] as const) {
      const res = await checkoutRoute[method]();
      expect(res.status, method).toBe(405);
      expect(res.headers.get("allow")).toBe("POST");
    }
  });

  test("returns 503 without calling Stripe when the secret key is missing or malformed", async () => {
    for (const key of [undefined, "", "pk_test_publishableKeyIsNotEnough", "whsec_wrongKind"]) {
      if (key === undefined) delete process.env.STRIPE_SECRET_KEY;
      else process.env.STRIPE_SECRET_KEY = key;
      const res = await checkout({ amount: "100" });
      expect(res.status, String(key)).toBe(503);
      expect(await res.json()).toEqual({
        ok: false,
        message: "Secure online contributions are being prepared and are not available yet.",
      });
    }
    expect(stripeCalls()).toHaveLength(0);
  });

  test("hides Stripe API errors behind a safe message and logs no secrets", async () => {
    stripeResponder = () =>
      json(401, { error: { type: "invalid_request_error", message: `Invalid API Key provided: ${SECRET_KEY}` } });
    const res = await checkout({ amount: "100" });
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toEqual({
      ok: false,
      message: "Secure checkout could not be started. No payment was taken. Please try again shortly.",
    });
    expect(JSON.stringify(body)).not.toMatch(/stripe|api key|invalid_request/i);
    expect(logs.join("\n")).toMatch(/Checkout Session creation failed \(type=StripeAuthenticationError.*status=401\)/);
    expectCleanLogs();
  });

  test("handles network failures and sessions without a URL", async () => {
    stripeResponder = () => {
      throw new TypeError("fetch failed");
    };
    expect((await checkout({ amount: "100" })).status).toBe(502);

    stripeResponder = () => json(200, fakeSession({ status: "open", payment_status: "unpaid", url: null }));
    expect((await checkout({ amount: "100" })).status).toBe(502);
    expectCleanLogs();
  });

  test("refuses cross-site requests", async () => {
    for (const headers of [
      { "sec-fetch-site": "cross-site" } as Record<string, string>,
      { origin: "https://evil.example" },
      { origin: "null" },
    ]) {
      const res = await checkout({ amount: "100" }, { headers });
      expect(res.status, JSON.stringify(headers)).toBe(403);
    }
    expect((await checkout({ amount: "100" }, { headers: { origin: "https://www.neorhiza.space" } })).status).toBe(200);
    expect(stripeCalls()).toHaveLength(1);
  });

  test("rate-limits checkout attempts per IP, independently of the contact form", async () => {
    const ip = nextIp();
    for (let i = 0; i < 10; i++) expect((await checkout({ amount: "100" }, { ip })).status).toBe(200);
    const limited = await checkout({ amount: "100" }, { ip });
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    // Invalid attempts count too, so amounts cannot be probed without limit.
    expect((await checkout({ amount: "-1" }, { ip })).status).toBe(429);
    expect(stripeCalls()).toHaveLength(10);

    // The contact form's bucket for the same IP is untouched (no delivery → 503, not 429).
    const contact = await contactPOST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": ip },
        body: JSON.stringify({
          fullName: "Ada Example",
          professionalEmail: "ada@example.org",
          areaOfInterest: "Scientific collaboration",
          message: "A message that is comfortably long enough to pass validation.",
          consent: true,
        }),
      })
    );
    expect(contact.status).toBe(503);
  });

  test("uses the shared Redis rate limiter with its own key", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://fake-store.upstash.example";
    process.env.UPSTASH_REDIS_REST_TOKEN = "fake-upstash-token";
    const ip = nextIp();
    expect((await checkout({ amount: "100" }, { ip })).status).toBe(200);
    const store = calls.find((c) => c.url.includes("upstash"))!;
    expect(store.url).toBe("https://fake-store.upstash.example/pipeline");
    expect(JSON.parse(store.body)[0]).toEqual(["INCR", `neorhiza:rl:donation-checkout:${ip}`]);

    upstashResponder = () => json(200, [{ result: 11 }, { result: 0 }, { result: 120000 }]);
    const limited = await checkout({ amount: "100" }, { ip });
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("120");
  });
});

function call0Body() {
  return decodeURIComponent(stripeCalls()[0].body);
}

/* ------------------------------------------------------------------ */

test.describe("success-page verification", () => {
  const stripe = () => createStripeClient(SECRET_KEY);

  test("confirms only sessions Stripe reports as paid, with limited details", async () => {
    stripeResponder = () => json(200, fakeSession());
    const result = await verifyCheckoutSession(stripe(), "cs_test_a1B2c3D4e5F6g7H8");
    expect(result).toEqual({ state: "paid", amountCents: 10000, currency: "usd", reference: "pi_3FAKEpaymentIntent01" });
    expect(JSON.stringify(result)).not.toContain(DONOR_EMAIL);
    expect(stripeCalls()[0].url).toMatch(/\/v1\/checkout\/sessions\/cs_test_a1B2c3D4e5F6g7H8$/);
  });

  test("never trusts the query parameter alone", async () => {
    for (const id of [undefined, "", "cs_test_", "pi_123", "cs_test_abc/../../v1/charges", "cs_live_<script>", "x".repeat(400)]) {
      expect(await verifyCheckoutSession(stripe(), id), String(id)).toEqual({ state: "invalid" });
    }
    expect(stripeCalls()).toHaveLength(0);
  });

  test("reports unpaid, processing, foreign and unknown sessions honestly", async () => {
    stripeResponder = () => json(200, fakeSession({ status: "open", payment_status: "unpaid" }));
    expect(await verifyCheckoutSession(stripe(), "cs_test_openSession01")).toEqual({ state: "unpaid" });

    stripeResponder = () => json(200, fakeSession({ status: "expired", payment_status: "unpaid" }));
    expect(await verifyCheckoutSession(stripe(), "cs_test_expiredSess01")).toEqual({ state: "unpaid" });

    stripeResponder = () => json(200, fakeSession({ status: "complete", payment_status: "unpaid" }));
    expect(await verifyCheckoutSession(stripe(), "cs_test_asyncPending01")).toEqual({ state: "processing" });

    stripeResponder = () => json(200, fakeSession({ metadata: { project: "another-product" } }));
    expect(await verifyCheckoutSession(stripe(), "cs_test_otherProject01")).toEqual({ state: "invalid" });

    stripeResponder = () => json(404, { error: { type: "invalid_request_error", code: "resource_missing" } });
    expect(await verifyCheckoutSession(stripe(), "cs_test_doesNotExist01")).toEqual({ state: "invalid" });
  });

  test("reports unavailability when Stripe is unconfigured or failing", async () => {
    expect(await verifyCheckoutSession(null, "cs_test_a1B2c3D4e5F6g7H8")).toEqual({ state: "unavailable" });
    stripeResponder = () => json(401, { error: { type: "invalid_request_error", message: `Invalid API Key provided: ${SECRET_KEY}` } });
    expect(await verifyCheckoutSession(stripe(), "cs_test_a1B2c3D4e5F6g7H8")).toEqual({ state: "unavailable" });
    expectCleanLogs();
  });
});

/* ------------------------------------------------------------------ */

function stripeEvent(type: string, session: Record<string, unknown> = {}, id = `evt_test_${Math.random().toString(36).slice(2)}`) {
  return {
    id,
    object: "event",
    api_version: Stripe.API_VERSION,
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    type,
    data: { object: fakeSession(session) },
  };
}

function deliver(event: unknown, init: { secret?: string; signature?: string | null; tamper?: boolean } = {}) {
  const payload = JSON.stringify(event);
  const signature =
    init.signature !== undefined
      ? init.signature
      : Stripe.webhooks.generateTestHeaderString({ payload, secret: init.secret ?? WEBHOOK_SECRET });
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (signature !== null) headers["stripe-signature"] = signature;
  return webhookRoute.POST(
    new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers,
      body: init.tamper ? payload.replace('"amount_total":10000', '"amount_total":1') : payload,
    })
  );
}

test.describe("POST /api/stripe/webhook", () => {
  let recorded: DonationEventRecord[];
  test.beforeEach(() => {
    recorded = [];
    setDonationRecorder({
      async record(entry) {
        recorded.push(entry);
        await logRecorder.record(entry);
      },
    });
  });

  test("accepts a correctly signed completed session and records only safe fields", async () => {
    const event = stripeEvent("checkout.session.completed");
    const res = await deliver(event);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    expect(recorded).toEqual([
      {
        eventId: event.id,
        eventType: "checkout.session.completed",
        sessionId: "cs_test_a1B2c3D4e5F6g7H8",
        amountTotal: 10000,
        currency: "usd",
        paymentStatus: "paid",
        outcome: "confirmed",
        livemode: false,
      },
    ]);
    const line = logs.find((l) => l.includes('"msg":"stripe.donation"'))!;
    expect(JSON.parse(line)).toMatchObject({ eventId: event.id, sessionId: "cs_test_a1B2c3D4e5F6g7H8", amountTotal: 10000 });
    expectCleanLogs();
    expect(stripeCalls()).toHaveLength(0);
  });

  test("rejects invalid, missing and tampered signatures", async () => {
    const event = stripeEvent("checkout.session.completed");
    expect((await deliver(event, { secret: "whsec_someoneElsesSecret" })).status).toBe(400);
    expect((await deliver(event, { signature: null })).status).toBe(400);
    expect((await deliver(event, { signature: "t=1,v1=deadbeef" })).status).toBe(400);
    expect((await deliver(event, { tamper: true })).status).toBe(400);
    expect(recorded).toEqual([]);
    expectCleanLogs();
  });

  test("returns 503 (retryable) when the signing secret is not configured", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    expect((await deliver(stripeEvent("checkout.session.completed"))).status).toBe(503);
    expect(recorded).toEqual([]);
  });

  test("is idempotent: a redelivered event is acknowledged but recorded once", async () => {
    const event = stripeEvent("checkout.session.completed");
    expect((await deliver(event)).status).toBe(200);
    const again = await deliver(event);
    expect(again.status).toBe(200);
    expect(await again.json()).toEqual({ received: true, duplicate: true });
    expect(recorded).toHaveLength(1);
  });

  test("releases the claim when recording fails so Stripe's retry is processed", async () => {
    let fail = true;
    setDonationRecorder({
      async record(entry) {
        if (fail) throw new Error("database down");
        recorded.push(entry);
      },
    });
    const event = stripeEvent("checkout.session.completed");
    expect((await deliver(event)).status).toBe(500);
    fail = false;
    expect((await deliver(event)).status).toBe(200);
    expect(recorded).toHaveLength(1);
  });

  test("maps async payment events and pending completions to outcomes", async () => {
    await deliver(stripeEvent("checkout.session.completed", { payment_status: "unpaid" }));
    await deliver(stripeEvent("checkout.session.async_payment_succeeded"));
    await deliver(stripeEvent("checkout.session.async_payment_failed", { payment_status: "unpaid" }));
    expect(recorded.map((r) => [r.eventType, r.outcome])).toEqual([
      ["checkout.session.completed", "pending"],
      ["checkout.session.async_payment_succeeded", "confirmed"],
      ["checkout.session.async_payment_failed", "failed"],
    ]);
  });

  test("acknowledges unrelated event types and other products without recording", async () => {
    const other = await deliver(stripeEvent("customer.created"));
    expect(other.status).toBe(200);
    expect(await other.json()).toEqual({ received: true, ignored: true });
    expect((await deliver(stripeEvent("checkout.session.completed", { metadata: { project: "shop" } }))).status).toBe(200);
    expect(recorded).toEqual([]);
  });

  test("uses the shared Redis store for idempotency when configured", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://fake-store.upstash.example";
    process.env.UPSTASH_REDIS_REST_TOKEN = "fake-upstash-token";
    const event = stripeEvent("checkout.session.completed");

    upstashResponder = () => json(200, { result: "OK" });
    expect((await deliver(event)).status).toBe(200);
    const claim = calls.find((c) => c.url.includes("upstash"))!;
    expect(claim.url).toBe("https://fake-store.upstash.example");
    expect(JSON.parse(claim.body)).toEqual(["SET", `neorhiza:stripe-event:${event.id}`, "1", "NX", "EX", "604800"]);

    upstashResponder = () => json(200, { result: null }); // already claimed elsewhere
    expect(await (await deliver(event)).json()).toEqual({ received: true, duplicate: true });
    expect(recorded).toHaveLength(1);
  });

  test("rejects oversized payloads and unsupported methods", async () => {
    const big = stripeEvent("checkout.session.completed", { padding: "x".repeat(600 * 1024) });
    expect((await deliver(big)).status).toBe(413);
    for (const method of ["GET", "PUT", "PATCH", "DELETE"] as const) {
      const res = await webhookRoute[method]();
      expect(res.status).toBe(405);
      expect(res.headers.get("allow")).toBe("POST");
    }
  });
});
