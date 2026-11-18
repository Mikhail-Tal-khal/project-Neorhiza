import Image from "next/image";
import { Globe, Mail, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { site } from "@/lib/site";
import { trackAttrs } from "@/lib/analytics-events";

const founderLinks = [
  {
    label: "Portfolio",
    value: "lemein.vercel.app",
    href: "https://lemein.vercel.app",
    icon: Globe,
  },
  {
    label: "GitHub",
    value: "Mikhail-Tal-khal",
    href: "https://github.com/Mikhail-Tal-khal",
    icon: GithubIcon,
  },
  {
    label: "Project email",
    value: site.contactEmail,
    href: `mailto:${site.contactEmail}`,
    icon: Mail,
  },
  { label: "Location", value: "Kenya", icon: MapPin },
] as const;

/**
 * The Founder's verified profile: photograph, introduction, professional
 * links, background and statement. Shown on the Leadership page.
 * Never describe the Founder as a scientist, clinician or laboratory
 * specialist — their background is engineering and cybersecurity.
 */
export function FounderProfile({ headingId = "founder-name" }: { headingId?: string }) {
  return (
    <GlassPanel className="p-5 sm:p-7 md:p-10">
      {/* Photograph beside the introduction from tablet up, above it on phones. */}
      <div className="grid gap-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
        <div className="mx-auto w-full max-w-xs md:mx-0 md:max-w-none">
          <Image
            src="/images/rereu-lemein.jpg"
            alt="Rereu Lemein, Founder of Project Neorhiza."
            width={702}
            height={927}
            sizes="(min-width: 1024px) 18rem, (min-width: 768px) 14rem, 20rem"
            className="h-auto w-full rounded-2xl border border-border shadow-soft"
          />
        </div>
        <div>
          <h3
            id={headingId}
            className="text-2xl font-semibold leading-tight tracking-[0.01em] text-heading md:text-3xl"
          >
            Rereu Lemein
          </h3>
          <p className="label-caps mt-2">Founder, {site.name}</p>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink">
            Rereu Lemein is a software and cybersecurity engineer,
            entrepreneur, philosopher and community builder based in
            Kenya. He is the founder of Lyshub Limited, the Kenyan company that
            operates Project Neorhiza, with a professional background in building secure,
            reliable systems and supporting community development.
          </p>
          <ul
            aria-label="Founder's professional links"
            className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
          >
            {founderLinks.map(({ label, value, icon: Icon, ...link }) => (
              <li
                key={label}
                className="glass flex items-center gap-3 rounded-2xl p-4"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-tint text-heading"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                    {label}
                  </p>
                  {"href" in link ? (
                    <a
                      href={link.href}
                      rel="noopener noreferrer"
                      {...(link.href.startsWith("https:")
                        ? trackAttrs("outbound_profile_clicked", label.toLowerCase())
                        : {})}
                      className="inline-flex min-h-6 items-center text-sm [overflow-wrap:anywhere] font-medium text-teal-700 underline underline-offset-4 hover:text-teal-400 dark:text-teal-200 dark:hover:text-white"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="flex min-h-6 items-center text-sm font-medium text-ink">
                      {value}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 grid gap-4 border-t border-border pt-10 lg:grid-cols-2">
        <GlassCard className="p-5 sm:p-6 md:p-8">
          <h4 className="label-caps mb-3">
            Motivation for establishing Project Neorhiza
          </h4>
          <p className="leading-relaxed text-ink">
            Rereu established Project Neorhiza to explore the long-term
            potential of patient-specific tissue engineering. The
            initiative is built around the possibility that a
            patient’s own living cells could one day contribute to
            developing functional replacement tissue designed
            specifically for that person.
          </p>
          <p className="mt-4 leading-relaxed text-ink">
            Neorhiza is currently in its Foundation Phase, focused on
            evidence review, scientific advising, institutional
            partnerships and responsible governance. No laboratory
            research has begun, and future experimental work will
            require qualified institutional supervision, ethical
            approval and the appropriate scientific and regulatory
            agreements.
          </p>
        </GlassCard>
        <GlassCard className="p-5 sm:p-6 md:p-8">
          <h4 className="label-caps mb-3">Professional background</h4>
          <p className="leading-relaxed text-ink">
            Rereu has experience in software engineering,
            cybersecurity, secure infrastructure, fraud analysis and
            systems development. He has built and supported production
            systems serving thousands of users, including a
            ride-hailing platform used by more than 5,000 riders and
            drivers and enterprise systems supporting over 50,000
            users.
          </p>
          <p className="mt-4 leading-relaxed text-ink">
            He holds a Computer Science qualification from the
            Technical University of Mombasa, an OSINT Forensic Analysis
            Operations certification and the Google Cybersecurity
            Professional Certificate. He has also mentored junior
            engineers and trained thousands of people in digital
            safety and fraud awareness.
          </p>
          <p className="mt-4 leading-relaxed text-ink">
            His professional background is in engineering and
            cybersecurity rather than clinical medicine or
            tissue-engineering research. His role is to establish
            Neorhiza’s direction, build its governance and bring
            together qualified scientists, healthcare professionals,
            institutions and responsible funding partners.
          </p>
        </GlassCard>
      </div>

      <figure className="glass mt-4 rounded-2xl p-5 sm:p-6 md:p-10">
        <h4 className="label-caps mb-5">Founder’s statement</h4>
        <blockquote className="max-w-3xl space-y-4 border-l-2 border-coral-500 pl-4 sm:pl-5 md:pl-7">
          <p className="text-pretty text-lg font-medium leading-relaxed text-heading md:text-xl">
            “I founded Neorhiza with a long-term vision and a clear
            understanding of the responsibility involved. We will not
            present ambition as proven science or make claims
            unsupported by evidence.
          </p>
          <p className="text-pretty text-lg font-medium leading-relaxed text-heading md:text-xl">
            Our progress, limitations and challenges will be
            communicated honestly. Safety, ethical oversight and
            scientific credibility will always take priority over speed
            or publicity.
          </p>
          <p className="text-pretty text-lg font-medium leading-relaxed text-heading md:text-xl">
            I stand personally behind Neorhiza and remain accountable
            for how the project is developed, represented and
            governed.”
          </p>
        </blockquote>
        <figcaption className="mt-6 pl-4 text-sm text-muted sm:pl-5 md:pl-7">
          Rereu Lemein, Founder, {site.name}
        </figcaption>
      </figure>
    </GlassPanel>
  );
}
