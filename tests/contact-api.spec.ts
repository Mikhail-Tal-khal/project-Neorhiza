import { expect, test } from "@playwright/test";
import { POST } from "@/app/api/contact/route";
import { escapeHtml } from "@/lib/contact-email";

/**
 * Route-handler tests for /api/contact with Resend delivery. They call the
 * handler in-process with a mocked fetch, so no browser, server or real
 * email provider is involved.
 */

const VALID = {
  fullName: "Ada Example",
  professionalEmail: "ada@example.org",
  organization: "Example Institute",
  professionalRole: "Research scientist",
  country: "Netherlands",
  areaOfInterest: "Scientific collaboration",
  message: "I would like to discuss a possible collaboration on vascularization & perfusion.",
  consent: true,
};

const ENV_KEYS = [
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
  "CONTACT_WEBHOOK_URL",
  "CONTACT_WEBHOOK_TOKEN",
  "CONTACT_RATE_LIMIT_MAX",
  "CONTACT_RATE_LIMIT_WINDOW_SECONDS",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
] as const;

const RESEND = {
  RESEND_API_KEY: "re_test_key",
  CONTACT_TO_EMAIL: "inquiries@neorhiza.space",
  CONTACT_FROM_EMAIL: "Project Neorhiza <website@mail.neorhiza.space>",
};

type SentEmail = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
};

let calls: { url: string; init: RequestInit }[] = [];
let responder: (n: number) => Response | Promise<Response> = () => new Response("{}", { status: 200 });
let logs: string[] = [];
let ipCounter = 0;

const savedEnv: Partial<Record<string, string>> = {};
const realFetch = globalThis.fetch;
const realConsole = { log: console.log, info: console.info, warn: console.warn, error: console.error };

function emails(): SentEmail[] {
  return calls
    .filter((c) => c.url === "https://api.resend.com/emails")
    .map((c) => JSON.parse(String(c.init.body)) as SentEmail);
}

function post(body: unknown, init: { ip?: string; headers?: Record<string, string> } = {}) {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": init.ip ?? `198.51.100.${++ipCounter}-${Date.now()}`,
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
  Object.assign(process.env, RESEND);

  calls = [];
  responder = () => new Response("{}", { status: 200 });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return responder(calls.length);
  }) as typeof fetch;

  logs = [];
  for (const level of ["log", "info", "warn", "error"] as const) {
    console[level] = (...args: unknown[]) => logs.push(args.map(String).join(" "));
  }
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
  Object.assign(console, realConsole);
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

/** Asserts that nothing the visitor typed reached the logs. */
function expectNoPersonalDataLogged() {
  const joined = logs.join("\n");
  for (const value of [
    VALID.fullName,
    VALID.professionalEmail,
    VALID.organization,
    VALID.professionalRole,
    VALID.country,
    "vascularization",
    RESEND.RESEND_API_KEY,
  ]) {
    expect(joined).not.toContain(value);
  }
}

test.describe("contact API — Resend delivery", () => {
  test("delivers the internal notification with the right recipient, sender and reply_to", async () => {
    const res = await post(VALID);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const [notification] = emails();
    expect(notification.to).toEqual(["inquiries@neorhiza.space"]);
    expect(notification.from).toBe("Project Neorhiza <website@mail.neorhiza.space>");
    expect(notification.reply_to).toBe("ada@example.org");
    expect(notification.subject).toBe("[Neorhiza Inquiry] Scientific collaboration — Ada Example");

    // Every field is present in both parts; consent and honeypot are not.
    for (const value of [
      VALID.fullName,
      VALID.professionalEmail,
      VALID.organization,
      VALID.professionalRole,
      VALID.country,
      VALID.areaOfInterest,
    ]) {
      expect(notification.text).toContain(value);
      expect(notification.html).toContain(value);
    }
    expect(notification.text).toContain(VALID.message);
    expect(notification.html).toContain("vascularization &amp; perfusion");
    for (const part of [notification.text, notification.html]) {
      expect(part).not.toMatch(/consent|companyWebsite|honeypot/i);
    }

    // The API key travels only in the Authorization header.
    const headers = new Headers(calls[0].init.headers);
    expect(headers.get("authorization")).toBe("Bearer re_test_key");
    expect(String(calls[0].init.body)).not.toContain("re_test_key");
    expect(calls[0].init.cache).toBe("no-store");
    expect(calls[0].init.signal).toBeInstanceOf(AbortSignal);
    expectNoPersonalDataLogged();
  });

  test("sends the visitor confirmation after the notification, without echoing the message", async () => {
    const res = await post(VALID);
    expect(res.status).toBe(200);

    const sent = emails();
    expect(sent).toHaveLength(2);
    const confirmation = sent[1];
    expect(confirmation.to).toEqual(["ada@example.org"]);
    expect(confirmation.from).toBe("Project Neorhiza <website@mail.neorhiza.space>");
    expect(confirmation.reply_to).toBe("inquiries@neorhiza.space");
    expect(confirmation.subject).toBe("We received your inquiry — Project Neorhiza");
    for (const part of [confirmation.text, confirmation.html]) {
      expect(part).toContain("Your inquiry has been received");
      expect(part).toContain("within ten working days");
      expect(part).toContain("does not provide medical advice, treatment, diagnosis or patient enrollment");
      expect(part).not.toContain("vascularization");
      expect(part).not.toContain(VALID.fullName);
    }
    expect(confirmation.text).toContain(
      "Project Neorhiza\nPatient-Specific Tissue Engineering Initiative\nEngineering New Beginnings from Living Cells"
    );
  });

  test("escapes visitor values in HTML and keeps the subject on one line", async () => {
    const res = await post({
      ...VALID,
      fullName: "Ada \"Q\" O'Brien\r\nBcc: x@evil.test",
      organization: "R&D <b>Lab</b>",
      message: "Hello <script>alert(1)</script> & welcome, this is long enough.",
    });
    expect(res.status).toBe(200);
    const [notification] = emails();
    expect(notification.subject).not.toMatch(/[\r\n]/);
    expect(notification.subject).toBe(
      "[Neorhiza Inquiry] Scientific collaboration — Ada \"Q\" O'Brien Bcc: x@evil.test"
    );
    expect(notification.html).toContain("Ada &quot;Q&quot; O&#39;Brien");
    expect(notification.html).toContain("R&amp;D bLab/b");
    expect(notification.html).not.toContain("<script>");
    expect(notification.html).not.toContain("<b>Lab");
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe(
      "&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;"
    );
  });

  test("internal success with a failed confirmation still succeeds and logs only a generic reason", async () => {
    responder = (n) => new Response('{"message":"ada@example.org rejected"}', { status: n === 1 ? 200 : 500 });
    const res = await post(VALID);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(emails()).toHaveLength(2);
    expect(logs).toEqual(["Inquiry confirmation email failed: email provider responded 500"]);
    expectNoPersonalDataLogged();
  });

  test("a confirmation that times out does not fail the inquiry", async () => {
    responder = (n) => {
      if (n === 1) return new Response("{}", { status: 200 });
      throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    };
    const res = await post(VALID);
    expect(res.status).toBe(200);
    expect(logs).toEqual(["Inquiry confirmation email failed: request timed out"]);
  });

  test("provider failure before internal delivery returns 502 and sends no confirmation", async () => {
    responder = () => new Response('{"message":"ada@example.org invalid"}', { status: 500 });
    const res = await post(VALID);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(JSON.stringify(body)).not.toMatch(/500|provider|resend|stack/i);
    expect(emails()).toHaveLength(1);
    expect(logs).toEqual(["Inquiry delivery failed: email provider responded 500"]);
    expectNoPersonalDataLogged();
  });

  test("network errors are reported without details", async () => {
    responder = () => {
      throw new TypeError(`fetch failed for ${VALID.professionalEmail}`);
    };
    const res = await post(VALID);
    expect(res.status).toBe(502);
    expect(logs).toEqual(["Inquiry delivery failed: network error"]);
  });

  test("missing environment variables return 503 and nothing is sent", async () => {
    for (const missing of Object.keys(RESEND)) {
      Object.assign(process.env, RESEND);
      delete process.env[missing];
      calls = [];
      const res = await post(VALID);
      expect(res.status, `without ${missing}`).toBe(503);
      expect((await res.json()).message).toMatch(/temporarily unavailable/);
      expect(calls).toHaveLength(0);
    }
    expectNoPersonalDataLogged();
  });

  test("surrounding quotes pasted into env values are ignored", async () => {
    process.env.CONTACT_FROM_EMAIL = '"Project Neorhiza <website@mail.neorhiza.space>"';
    process.env.CONTACT_TO_EMAIL = "'inquiries@neorhiza.space'";
    process.env.RESEND_API_KEY = ' "re_test_key" ';
    const res = await post(VALID);
    expect(res.status).toBe(200);
    const [notification, confirmation] = emails();
    expect(notification.from).toBe("Project Neorhiza <website@mail.neorhiza.space>");
    expect(notification.to).toEqual(["inquiries@neorhiza.space"]);
    expect(confirmation.reply_to).toBe("inquiries@neorhiza.space");
    expect(new Headers(calls[0].init.headers).get("authorization")).toBe("Bearer re_test_key");
  });

  test("webhook delivery still works alongside Resend", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.test/neorhiza";
    process.env.CONTACT_WEBHOOK_TOKEN = "hook-token";
    const res = await post(VALID);
    expect(res.status).toBe(200);
    const hook = calls.find((c) => c.url === "https://hooks.example.test/neorhiza");
    expect(hook).toBeTruthy();
    expect(JSON.parse(String(hook!.init.body)).data).not.toHaveProperty("consent");
    expect(emails()).toHaveLength(2);
  });

  test("webhook success with Resend notification failure still confirms to the visitor", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.test/neorhiza";
    responder = (n) => new Response("{}", { status: n === 2 ? 500 : 200 });
    const res = await post(VALID);
    expect(res.status).toBe(200);
    expect(emails().at(-1)?.subject).toBe("We received your inquiry — Project Neorhiza");
  });
});

test.describe("contact API — request protection", () => {
  test("invalid fields return 400 with per-field errors and nothing is sent", async () => {
    const res = await post({ ...VALID, professionalEmail: "bad@", message: "short", consent: false });
    expect(res.status).toBe(400);
    const { errors } = await res.json();
    expect(Object.keys(errors).sort()).toEqual(["consent", "message", "professionalEmail"]);
    expect(calls).toHaveLength(0);
  });

  test("over-long optional fields are rejected", async () => {
    const res = await post({ ...VALID, country: "x".repeat(81) });
    expect(res.status).toBe(400);
    expect((await res.json()).errors.country).toBeTruthy();
  });

  test("invalid content type returns 415", async () => {
    const res = await post(VALID, { headers: { "content-type": "text/plain" } });
    expect(res.status).toBe(415);
  });

  test("malformed JSON returns 400", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post("[1,2]")).status).toBe(400);
  });

  test("oversized bodies return 413, by declared length and by actual bytes", async () => {
    const big = { ...VALID, message: "é".repeat(9000) }; // 9000 chars, 18000 bytes
    expect((await post(big)).status).toBe(413);
    expect((await post(VALID, { headers: { "content-length": "999999" } })).status).toBe(413);
    expect(calls).toHaveLength(0);
  });

  test("honeypot submissions get an indistinguishable 200 and nothing is sent", async () => {
    const res = await post({ ...VALID, companyWebsite: "https://spam.example" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toHaveLength(0);
    expect(logs).toHaveLength(0);
  });

  test("rate limiting returns 429 with Retry-After", async () => {
    process.env.CONTACT_RATE_LIMIT_MAX = "2";
    process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS = "600";
    const ip = `203.0.113.${Date.now()}`;
    const statuses: number[] = [];
    let last: Response | undefined;
    for (let i = 0; i < 3; i++) {
      last = await post(VALID, { ip });
      statuses.push(last.status);
    }
    expect(statuses).toEqual([200, 200, 429]);
    expect(Number(last!.headers.get("retry-after"))).toBeGreaterThan(0);
    expect((await last!.json()).message).toMatch(/Too many inquiries/);
    expect(emails()).toHaveLength(4); // two inquiries × (notification + confirmation)
  });
});
