"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { cx } from "@/lib/cx";
import { trackEvent } from "@/lib/analytics";
import {
  formatMoney,
  normalizeTypedAmount,
  parseAmountToCents,
  type DonationSettings,
} from "@/lib/donations/amount";
import { buttonBase, buttonVariants } from "@/components/ui/glass-button-styles";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string };

const CUSTOM = "custom";

/** Failure reasons sent to analytics: fixed labels, never amounts or IDs. */
function failureReason(status: number) {
  if (status === 429) return "rate_limited";
  if (status === 503) return "unavailable";
  if (status === 400) return "invalid_amount";
  return "checkout_error";
}

const pillClass =
  "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-[color:var(--input)] bg-surface px-3 text-base font-semibold tabular-nums text-heading transition-[background-color,border-color,color] duration-200 hover:bg-tint motion-reduce:transition-none " +
  "peer-checked:border-transparent peer-checked:bg-primary peer-checked:text-primary-foreground " +
  "peer-focus-visible:[outline:3px_solid_var(--focus-color)] peer-focus-visible:[outline-offset:2px] " +
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-60 peer-disabled:hover:bg-surface";

/**
 * One-time contribution form. Picks an amount, asks the server to create a
 * Stripe Checkout Session and redirects to Stripe's hosted page. Card
 * details are never entered on this site. The server re-validates the
 * amount; the checks here only give immediate feedback.
 */
export function DonationForm({ settings, enabled }: { settings: DonationSettings; enabled: boolean }) {
  const { currency, minAmount, maxAmount, presets } = settings;
  const defaultChoice = presets.includes(100) ? "100" : presets[0] !== undefined ? String(presets[0]) : CUSTOM;
  const [choice, setChoice] = useState<string>(defaultChoice);
  const [custom, setCustom] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const submittingRef = useRef(false);
  const customRef = useRef<HTMLInputElement>(null);
  const ids = useId();
  const customId = `${ids}-custom`;
  const hintId = `${ids}-hint`;
  const errorId = `${ids}-error`;
  const statusId = `${ids}-status`;

  // Returning from Stripe with the Back button may restore this page from
  // the back/forward cache in its "redirecting" state; reset it.
  useEffect(() => {
    function onPageShow(event: PageTransitionEvent) {
      if (!event.persisted) return;
      submittingRef.current = false;
      setStatus({ kind: "idle" });
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const amountText = choice === CUSTOM ? normalizeTypedAmount(custom) : choice;
  const parsed = parseAmountToCents(amountText, settings);
  const summary =
    parsed.ok ? `${formatMoney(parsed.cents / 100, currency)} ${currency.toUpperCase()}, one time` : null;

  function selectCustom() {
    setChoice(CUSTOM);
    requestAnimationFrame(() => customRef.current?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || submittingRef.current) return;

    if (!parsed.ok) {
      if (choice === CUSTOM) {
        setCustomError(amountText === "" ? "Please enter an amount." : parsed.message);
        customRef.current?.focus();
      } else {
        setStatus({ kind: "error", message: parsed.message });
      }
      return;
    }

    submittingRef.current = true;
    setCustomError(null);
    setStatus({ kind: "submitting" });
    trackEvent("donation_checkout_started");

    try {
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountText, currency }),
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; url?: string; message?: string };

      if (response.ok && payload.ok && typeof payload.url === "string" && payload.url.startsWith("https://")) {
        // Stay in the "redirecting" state while the browser leaves for Stripe.
        window.location.assign(payload.url);
        return;
      }
      trackEvent("donation_checkout_failed", { reason: failureReason(response.status) });
      setStatus({
        kind: "error",
        message: payload.message || "Secure checkout could not be started. No payment was taken. Please try again.",
      });
    } catch {
      trackEvent("donation_checkout_failed", { reason: "network" });
      setStatus({
        kind: "error",
        message: "A network error prevented checkout from starting. No payment was taken. Please try again.",
      });
    }
    submittingRef.current = false;
  }

  const submitting = status.kind === "submitting";
  const range = `${formatMoney(minAmount, currency)} to ${formatMoney(maxAmount, currency)}`;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} aria-describedby={statusId}>
      <fieldset disabled={!enabled || submitting} className="min-w-0">
        <legend className="text-sm font-medium text-heading">
          Choose a one-time amount <span className="font-normal text-muted">({currency.toUpperCase()})</span>
        </legend>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {presets.map((preset) => (
            <label key={preset} className="relative block">
              <input
                type="radio"
                name="donation-amount"
                value={String(preset)}
                checked={choice === String(preset)}
                onChange={() => {
                  setChoice(String(preset));
                  setStatus({ kind: "idle" });
                }}
                className="peer sr-only"
              />
              <span className={pillClass}>{formatMoney(preset, currency)}</span>
            </label>
          ))}
          <label className="relative block">
            <input
              type="radio"
              name="donation-amount"
              value={CUSTOM}
              checked={choice === CUSTOM}
              onChange={selectCustom}
              className="peer sr-only"
            />
            <span className={pillClass}>Other amount</span>
          </label>
        </div>

        <div className={cx("mt-4", choice !== CUSTOM && "hidden")}>
          <label htmlFor={customId} className="mb-1.5 block text-sm font-medium text-heading">
            Your amount ({currency.toUpperCase()})
          </label>
          <input
            ref={customRef}
            id={customId}
            name="custom-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            maxLength={12}
            placeholder={`e.g. ${formatMoney(75, currency)}`}
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setCustomError(null);
              setStatus({ kind: "idle" });
            }}
            aria-invalid={Boolean(customError)}
            aria-describedby={customError ? `${hintId} ${errorId}` : hintId}
            className="glass-input w-full rounded-xl px-4 py-3 text-[0.95rem] tabular-nums text-ink"
          />
          <p id={hintId} className="mt-2 text-sm text-muted">
            Any amount from {range}.
          </p>
          {customError && (
            <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink dark:text-coral-300">
              <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-coral-700 dark:text-coral-300" />
              <span>{customError}</span>
            </p>
          )}
        </div>
      </fieldset>

      <p className="mt-5 min-h-6 text-sm text-muted" aria-live="polite">
        {enabled && summary ? (
          <>
            Contribution: <span className="font-semibold text-heading">{summary}</span>
          </>
        ) : null}
      </p>

      <button
        type="submit"
        disabled={!enabled || submitting}
        className={cx(buttonBase, buttonVariants.primary, "mt-3 w-full px-4 py-3 text-center text-base sm:px-7")}
      >
        {submitting ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
            Redirecting to Stripe…
          </>
        ) : (
          <>
            <Lock aria-hidden="true" className="size-4" />
            Donate securely with Stripe
          </>
        )}
      </button>

      <div id={statusId} role="status" aria-live="polite" className="mt-3">
        {status.kind === "error" && (
          <p className="flex items-start gap-1.5 text-sm font-medium text-ink dark:text-coral-300">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-coral-700 dark:text-coral-300" />
            <span>{status.message}</span>
          </p>
        )}
        {submitting && <span className="sr-only">Starting secure checkout. You will be redirected to Stripe.</span>}
      </div>
    </form>
  );
}
