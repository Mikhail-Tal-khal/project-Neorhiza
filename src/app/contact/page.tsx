import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/ui/contact-form";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ShieldCheck, FileText, Clock, ArrowRight } from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { disclaimers } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { trackAttrs } from "@/lib/analytics-events";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Submit a professional inquiry to Project Neorhiza — scientific, institutional, clinical, engineering, ethics and regulatory collaboration, funding and foundation support, or media and general inquiries.",
  path: "/contact",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Contact", path: "/contact" }]);

/**
 * Routes by audience. Plain links (full navigation) so the form reads the
 * preselected area on mount, and the page stays statically rendered.
 */
const routes = [
  { label: "Researchers", text: "Scientific or engineering collaboration", interest: "scientific" },
  { label: "Institutions", text: "Hosting, supervision or partnership", interest: "institutional" },
  { label: "Funders", text: "Funding and foundation support", interest: "funding" },
  { label: "Media", text: "Press and interview requests", interest: "media" },
];

const notes = [
  {
    Icon: ShieldCheck,
    title: "Professional inquiries only",
    text: "Inquiries are reviewed against the collaboration paths. We do not respond to treatment requests and cannot provide medical information.",
  },
  {
    Icon: Clock,
    title: "Response time",
    text: "The project team aims to respond to qualified professional inquiries within ten working days.",
  },
  {
    Icon: FileText,
    title: "What not to include",
    text: "Please do not include confidential material, unpublished data or patient information in a first inquiry.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section
        aria-labelledby="contact-heading"
        className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 lg:py-24"
      >
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Start a Professional Conversation"
          lead="Whether you are a scientist, an institution, a clinician, an engineer, an ethicist or a journalist — this form routes your inquiry to the right conversation."
        />
        <ResearchDisclaimer className="mx-auto mt-8 max-w-3xl" title="Treatment notice">
          {disclaimers.treatment}
        </ResearchDisclaimer>

        <nav aria-label="Choose your inquiry route" className="mx-auto mt-10 max-w-5xl">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {routes.map((route) => (
              <li key={route.interest}>
                <a
                  href={`/contact?interest=${route.interest}#inquiry-form`}
                  {...(route.interest === "funding"
                    ? trackAttrs("funding_inquiry_started", "contact-routes")
                    : {})}
                  className="glass group flex h-full min-h-11 items-center justify-between gap-3 rounded-2xl p-4 transition-shadow duration-300 hover:shadow-lift"
                >
                  <span>
                    <span className="block font-semibold tracking-[0.01em] text-heading">{route.label}</span>
                    <span className="mt-0.5 block text-sm text-muted">{route.text}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-teal-400 transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <div className="band">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:py-24">
          <div id="inquiry-form" className="scroll-mt-28">
            <ContactForm />
          </div>

          <div className="grid content-start gap-4">
            {notes.map(({ Icon, title, text }) => (
              <GlassPanel key={title} className="flex gap-4 p-6">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-tint text-heading"
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold tracking-[0.01em] text-heading">
                    {title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {text}
                  </p>
                </div>
              </GlassPanel>
            ))}

            <GlassPanel className="p-6">
              <h2 className="label-caps mb-3">Data we collect</h2>
              <p className="text-sm leading-relaxed text-muted">
                This form collects only what you enter, for the purpose of
                responding to your inquiry. We never request medical records,
                patient histories, genetic information or sensitive health
                data — and we ask you not to send them. Submissions are
                validated and rate-limited on our servers; see the{" "}
                <a
                  href="/privacy"
                  className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200"
                >
                  Privacy Policy
                </a>{" "}
                for details.
              </p>
            </GlassPanel>
          </div>
        </div>
      </div>

      <JsonLd data={breadcrumb} />
    </>
  );
}
