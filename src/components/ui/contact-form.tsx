"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { inquiryTypes } from "@/lib/inquiry-types";

type FieldErrors = Record<string, string>;

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string; errors?: FieldErrors };

const initial = {
  fullName: "",
  organization: "",
  professionalRole: "",
  country: "",
  professionalEmail: "",
  areaOfInterest: "",
  message: "",
  consent: false,
  companyWebsite: "", // honeypot — never rendered visibly
};

const inputClass =
  "glass-input w-full rounded-xl px-4 py-3 text-[0.95rem] text-ink dark:text-teal-50";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink dark:text-coral-300"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-coral-700 dark:text-coral-300" />
      <span>{message}</span>
    </p>
  );
}

/**
 * ContactForm — accessible inquiry form. Errors use text plus an icon
 * (never color alone); a honeypot field deters spam; the server performs
 * authoritative validation, rate limiting and sanitization.
 */
export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  /** Moves focus to the first field with an error so it is announced. */
  function focusFirstError(errors: FieldErrors) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(first)}`);
    el?.focus();
  }

  const set = (key: keyof typeof initial) => (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value =
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setClientErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Light client-side pass for immediate feedback; the server remains
    // authoritative.
    const errors: FieldErrors = {};
    if (values.fullName.trim().length < 2)
      errors.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.professionalEmail.trim()))
      errors.professionalEmail = "Please enter a valid professional email address.";
    if (!values.areaOfInterest)
      errors.areaOfInterest = "Please select an area of interest.";
    if (values.message.trim().length < 20)
      errors.message = "Please provide a short message (at least 20 characters).";
    if (!values.consent)
      errors.consent = "Please confirm consent to be contacted about this inquiry.";

    setClientErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus({
        kind: "error",
        message: "Please correct the highlighted fields and try again.",
        errors,
      });
      focusFirstError(errors);
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => ({ ok: false }))) as {
        ok: boolean;
        message?: string;
        errors?: FieldErrors;
      };

      if (response.ok && payload.ok) {
        setStatus({ kind: "success" });
        setValues(initial);
      } else {
        setStatus({
          kind: "error",
          message:
            payload.message ||
            "Something went wrong while sending your inquiry. Please try again.",
          errors: payload.errors,
        });
        if (payload.errors) {
          setClientErrors(payload.errors);
          focusFirstError(payload.errors);
        }
      }
    } catch {
      setStatus({
        kind: "error",
        message:
          "A network error occurred while sending your inquiry. Please try again.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        className="glass rounded-3xl p-8 text-center md:p-10"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2
          aria-hidden="true"
          className="mx-auto size-10 text-teal-400"
        />
        <h3 className="mt-4 text-xl font-semibold text-teal-700 dark:text-teal-50">
          Inquiry received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-mist-200">
          Thank you for reaching out. The project team reviews inquiries
          against the collaboration paths and responds to qualified
          professional inquiries. Please note that we cannot respond to
          treatment requests.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 inline-flex min-h-11 items-center rounded-full border border-teal-200 px-5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 dark:border-white/20 dark:text-teal-100 dark:hover:bg-white/10"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-describedby="form-required-note"
      className="glass rounded-3xl p-6 md:p-8"
    >
      <p id="form-required-note" className="mb-5 text-sm text-slate-500 dark:text-mist-200">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>
      {/* Honeypot — visually hidden, ignored by screen readers, left empty by humans */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.companyWebsite}
          onChange={set("companyWebsite")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-teal-700 dark:text-teal-50"
          >
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(clientErrors.fullName)}
            aria-describedby={clientErrors.fullName ? "fullName-error" : undefined}
            value={values.fullName}
            onChange={set("fullName")}
            className={inputClass}
          />
          <FieldError id="fullName-error" message={clientErrors.fullName} />
        </div>

        <div>
          <label
            htmlFor="professionalEmail"
            className="mb-1.5 block text-sm font-medium text-teal-700 dark:text-teal-50"
          >
            Professional email <span aria-hidden="true">*</span>
          </label>
          <input
            id="professionalEmail"
            name="professionalEmail"
            type="email"
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(clientErrors.professionalEmail)}
            aria-describedby={clientErrors.professionalEmail ? "professionalEmail-error" : undefined}
            value={values.professionalEmail}
            onChange={set("professionalEmail")}
            className={inputClass}
          />
          <FieldError
            id="professionalEmail-error"
            message={clientErrors.professionalEmail}
          />
        </div>

        <div>
          <label
            htmlFor="organization"
            className="mb-1.5 block text-sm font-medium text-teal-700 dark:text-teal-50"
          >
            Organization
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            value={values.organization}
            onChange={set("organization")}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="professionalRole"
            className="mb-1.5 block text-sm font-medium text-teal-700 dark:text-teal-50"
          >
            Professional role
          </label>
          <input
            id="professionalRole"
            name="professionalRole"
            type="text"
            autoComplete="organization-title"
            value={values.professionalRole}
            onChange={set("professionalRole")}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="mb-1.5 block text-sm font-medium text-teal-700 dark:text-teal-50"
          >
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            value={values.country}
            onChange={set("country")}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="areaOfInterest"
            className="mb-1.5 block text-sm font-medium text-teal-700 dark:text-teal-50"
          >
            Area of interest <span aria-hidden="true">*</span>
          </label>
          <select
            id="areaOfInterest"
            name="areaOfInterest"
            required
            aria-required="true"
            aria-invalid={Boolean(clientErrors.areaOfInterest)}
            aria-describedby={clientErrors.areaOfInterest ? "areaOfInterest-error" : undefined}
            value={values.areaOfInterest}
            onChange={set("areaOfInterest")}
            className={cn(inputClass, "appearance-none bg-transparent")}
          >
            <option value="" disabled>
              Select an area…
            </option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type} className="text-ink">
                {type}
              </option>
            ))}
          </select>
          <FieldError
            id="areaOfInterest-error"
            message={clientErrors.areaOfInterest}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-teal-700 dark:text-teal-50"
          >
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            aria-required="true"
            aria-invalid={Boolean(clientErrors.message)}
            aria-describedby={clientErrors.message ? "message-error" : "message-hint"}
            value={values.message}
            onChange={set("message")}
            className={cn(inputClass, "resize-y scrollbar-fine")}
          />
          {clientErrors.message ? (
            <FieldError id="message-error" message={clientErrors.message} />
          ) : (
            <p id="message-hint" className="mt-2 text-sm text-slate-500 dark:text-mist-200">
              Briefly describe your background, institutional context and the
              nature of your inquiry. Do not include confidential material at
              this stage.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <div className="flex min-h-11 items-start gap-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              aria-required="true"
              aria-invalid={Boolean(clientErrors.consent)}
              aria-describedby={clientErrors.consent ? "consent-error" : undefined}
              checked={values.consent}
              onChange={set("consent")}
              className="mt-0.5 size-6 shrink-0 rounded-md accent-teal-700 dark:accent-teal-200"
            />
            <label
              htmlFor="consent"
              className="text-sm leading-relaxed text-slate-500 dark:text-mist-200"
            >
              I consent to Project Neorhiza processing the information in
              this form to respond to my inquiry, in line with the{" "}
              <Link
                href="/privacy"
                className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200"
              >
                Privacy Policy
              </Link>
              . <span aria-hidden="true">*</span>
            </label>
          </div>
          <FieldError id="consent-error" message={clientErrors.consent} />
        </div>
      </div>

      {/* Form-level status */}
      <div aria-live="polite">
        {status.kind === "error" && (
          <p
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-2xl border border-coral-300/60 bg-coral-100/60 p-4 text-sm font-medium text-ink dark:border-coral-500/30 dark:bg-coral-500/10 dark:text-coral-300"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-coral-700 dark:text-coral-300" />
            <span>{status.message}</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="btn-sweep mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-7 text-base font-medium text-white transition-all hover:bg-teal-900 disabled:opacity-60 sm:w-auto dark:bg-white/90 dark:text-teal-950 dark:hover:bg-coral-500"
      >
        {status.kind === "submitting" ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 motion-safe:animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-teal-950/30 dark:border-t-teal-950"
            />
            Sending…
          </>
        ) : (
          <>
            <Send aria-hidden="true" className="size-4" />
            Submit inquiry
          </>
        )}
      </button>
    </form>
  );
}
