import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { createMetadata } from "@/lib/metadata";
import { disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Privacy",
  description:
    "How Project Neorhiza collects, uses, shares and protects the minimal information submitted through this website, and the rights you have under Kenyan data-protection law.",
  path: "/privacy",
});

const EFFECTIVE = "9 November 2026";
const REVISED = "9 November 2026";

const sections = [
  {
    title: "Who is responsible for your information",
    body: [
      `${site.name} is an early-stage research initiative based in Kenya, not yet institutionally affiliated. The data controller for information collected through this website is the project's founder, Rereu Lemein, acting for ${site.name}.`,
    ],
  },
  {
    title: "How to contact us",
    body: [
      `For any question about this policy or to exercise your rights, write to ${site.contactEmail}. You can also use the contact form and select “General inquiry”.`,
    ],
  },
  {
    title: "What we collect",
    body: [
      "Through the contact form: your full name and professional email address (required), your organization, professional role and country (optional), the area of interest you select, your message, and your confirmation that you consent to us processing the inquiry.",
      "Automatically, when you use the site: the IP address of your connection, which our servers use briefly to limit how many inquiries can be sent in a short period; standard request information (such as IP address, browser type and the page requested) that our hosting provider records in its operational logs; and aggregate, cookieless usage and performance measurements described under “Analytics and tracking”.",
    ],
  },
  {
    title: "What we do not collect",
    body: [
      "We do not collect medical records, patient histories, diagnoses, genetic information or any other health data, and we ask you not to include such information in a message. We do not collect payment, donation or other financial information — this website processes no payments of any kind. We do not use advertising cookies, advertising trackers or cross-site profiling.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "To review and respond to your professional inquiry in line with the collaboration framework described on the Collaboration page, including — for qualified inquiries — sending the public research overview or arranging a meeting.",
      "To send one automated email confirming that your inquiry was received. It does not repeat your message.",
      "To keep the website and the contact form secure and available, including detecting and limiting spam and abuse.",
      "To understand, in aggregate, which pages are useful and how quickly they load, so we can improve the site.",
      "We do not sell, rent or share your information for marketing, and we do not send newsletters or promotional email.",
    ],
  },
  {
    title: "Our lawful bases",
    body: [
      "Consent: we process the information you submit through the contact form, and send the confirmation email, because you consent to it when you submit the form. You can withdraw consent at any time; withdrawal does not affect processing that already took place.",
      "Legitimate interests: we process connection data (such as IP addresses) for security, abuse prevention and rate limiting, and use aggregate analytics to keep the site working well. These uses are limited to what is necessary and do not identify you to us.",
    ],
  },
  {
    title: "Service providers we use",
    body: [
      "Website hosting, operational logs, Web Analytics and Speed Insights: Vercel.",
      "Transactional email (delivering inquiries to our inbox and sending your confirmation): Resend.",
      "Our inquiry mailbox: Namecheap Private Email.",
      "Rate limiting, where enabled: a managed Redis service (Upstash) that holds short-lived counters keyed to the connection's IP address.",
      "These providers act on our instructions and process information only to deliver their service to us.",
    ],
  },
  {
    title: "Processing outside Kenya",
    body: [
      "Our service providers operate infrastructure outside Kenya, including in the United States and the European Union, so your information may be transferred to and stored in those countries. We use providers that commit contractually to protecting personal data and that apply recognized safeguards such as encryption in transit, access controls and data-processing terms, and we transfer only what is needed to provide the service.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Inquiries that do not lead to ongoing correspondence are deleted within 12 months of receipt.",
      "Where an inquiry leads to an ongoing professional relationship, related correspondence is kept while that relationship is active and deleted or anonymized within 24 months of the last contact, unless a written agreement or a legal obligation requires us to keep it longer.",
      "Rate-limit counters expire automatically at the end of the rate-limit window (10 minutes by default) and are never stored with your inquiry. Hosting logs and email-delivery records are kept by Vercel and Resend for limited periods under their own retention settings.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Subject to Kenya's Data Protection Act, 2019, you have the right to be informed about how your information is used; to access it; to have inaccurate information corrected; to have it deleted; to object to processing; to request that processing be restricted; to withdraw consent at any time; and, where applicable, to receive the information you provided in a portable format.",
      `To exercise any of these rights, write to ${site.contactEmail}. We will respond as soon as practicable and within the time the law allows, and may ask you to confirm your identity before acting on a request.`,
    ],
  },
  {
    title: "Complaints",
    body: [
      "If you are concerned about how we have handled your information, please contact us first so we can try to resolve it. You also have the right to lodge a complaint with Kenya's Office of the Data Protection Commissioner (ODPC), www.odpc.go.ke.",
    ],
  },
  {
    title: "Analytics and tracking",
    body: [
      "This website uses Vercel Web Analytics and Vercel Speed Insights. Both are first-party (served from this website's own domain), do not set cookies and report only aggregate information — such as page views, referring sites, country, device type and page-load performance. According to Vercel, visitors are not tracked across websites and no persistent identifier is stored on your device.",
      "We also count a small number of aggregate events — for example, that a contact form was started or a collaboration button was clicked. These events never include your name, email address, message or anything else you type.",
      "We do not use advertising trackers, social-media pixels, session recording or cross-site behavioral profiling. If we ever add another analytics or measurement tool, it will be described on this page before it is switched on.",
    ],
  },
  {
    title: "How your information is protected",
    body: [
      "All traffic to this website is encrypted (HTTPS with HSTS). Submissions are validated, sanitized and rate-limited on our servers, and the contact form refuses requests sent from other websites. Our operational logs record only technical outcomes, never the content of inquiries. Access to submitted inquiries is limited to the people responsible for responding to them.",
    ],
  },
  {
    title: "Children",
    body: [
      "This website is intended for professional audiences and is not directed at children. We do not knowingly collect information from children; if you believe a child has submitted information, contact us and we will delete it.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      `This policy took effect on ${EFFECTIVE} and was last revised on ${REVISED}. If we change how we handle personal information, we will update this page and its revision date before the change takes effect.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 md:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Privacy"
        title="Privacy Policy"
        lead={`Minimal collection, professional use, honest explanation. Effective ${EFFECTIVE} · Last revised ${REVISED}.`}
      />

      <div className="mt-12 grid gap-6">
        {sections.map((section) => (
          <GlassPanel key={section.title} className="p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-[0.01em] text-heading">
              {section.title}
            </h2>
            <div className="mt-3 space-y-4">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="leading-relaxed text-ink/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassPanel>
        ))}

        <ResearchDisclaimer>
          {disclaimers.footer}
        </ResearchDisclaimer>

        <p className="text-sm text-muted">
          Questions about this policy:{" "}
          <a
            href={`mailto:${site.contactEmail}`}
            className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200"
          >
            {site.contactEmail}
          </a>{" "}
          or the{" "}
          <a
            href="/contact"
            className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200"
          >
            contact form
          </a>
          . {site.name}.
        </p>
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Privacy", path: "/privacy" }])} />
    </div>
  );
}
