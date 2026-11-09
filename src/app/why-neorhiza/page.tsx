import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { VesselDivider } from "@/components/ui/vessel-divider";
import { AnnotatedMark } from "@/components/ui/annotated-mark";
import { BrandMark } from "@/components/ui/brand-mark";
import Image from "next/image";
import { Github, Globe, Mail, MapPin } from "lucide-react";
import { notList, values } from "@/content/why";
import { createMetadata } from "@/lib/metadata";
import { disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Why Neorhiza",
  description:
    "The story behind the name, the mission, the values and the governance of Project Neorhiza — an early-stage patient-specific tissue engineering initiative.",
  path: "/why-neorhiza",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Why Neorhiza", path: "/why-neorhiza" }]);

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
    icon: Github,
  },
  {
    label: "Email",
    value: "rereulemein@gmail.com",
    href: "mailto:rereulemein@gmail.com",
    icon: Mail,
  },
  { label: "Location", value: "Mombasa, Kenya", icon: MapPin },
] as const;

export default function WhyNeorhizaPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      {/* Name and mark */}
      <section aria-labelledby="name-heading" className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="label-caps mb-3">Why Neorhiza</p>
          <h1
            id="name-heading"
            className="text-balance text-4xl font-semibold leading-[1.12] tracking-[0.01em] text-heading md:text-5xl"
          >
            A New Root, From Which Possibility May Grow
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink">
            Neorhiza combines the idea of the new with the image of a
            root — a new biological foundation from which possibility may
            grow.
          </p>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
            The mark expresses this as one branching root system that is
            also a vascular tree: a thick trunk splitting into progressively
            thinner curved branches, each ending in a small coral circle —
            a living cell. One idea, drawn once, governs the visual
            language of everything you see on this site.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StatusBadge>Early-Stage Research Initiative</StatusBadge>
            <StatusBadge>Foundation Phase</StatusBadge>
          </div>
        </div>
        <GlassPanel className="p-8 md:p-10">
          <div className="text-teal-700 dark:text-teal-100">
            <AnnotatedMark />
          </div>
          {/* The stacked lockup has no reversed version: it sits on a solid light tile in both themes. */}
          <div className="logo-tile mt-6 px-6 py-6">
            <BrandMark variant="stacked" height={96} className="mx-auto" />
          </div>
        </GlassPanel>
      </section>

      <VesselDivider />

      {/* Mission, vision, governance */}
      <section aria-labelledby="mission-heading" className="grid gap-4 py-16 md:grid-cols-2 lg:grid-cols-3">
        <h2 id="mission-heading" className="sr-only">
          Mission, vision and governance
        </h2>
        <GlassCard>
          <h3 className="label-caps mb-3">Mission</h3>
          <p className="leading-relaxed text-ink">
            To advance the scientific and engineering foundation of
            patient-specific tissue engineering through responsible,
            partnership-driven research — and to communicate that journey
            honestly with the public, the scientific community and the
            institutions whose supervision makes such work legitimate.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Vision</h3>
          <p className="leading-relaxed text-ink">
            A future in which living cells obtained from a patient may
            contribute to the development of functional replacement tissue
            designed for that same patient — developed through disciplined
            science, supervised institutions and ethical oversight.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Governance status</h3>
          <p className="leading-relaxed text-ink">
            Project Neorhiza is an early-stage initiative founded by Rereu Lemein.
            It is not yet institutionally affiliated; establishing
            qualified institutional supervision and advisory structures is
            the explicit goal of the current Foundation Phase.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Current development phase</h3>
          <p className="leading-relaxed text-ink">
            Foundation Phase: evidence review, scientific advising,
            partnership building and project governance. No laboratory
            research has begun, and none will begin without institutional
            supervision, ethics review and appropriate agreements.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Long-term ambition</h3>
          <p className="leading-relaxed text-ink">
            To contribute — through decades of careful work — to patient-specific
            functional tissues and, ultimately, replacement-organ
            technologies, within fully authorized scientific and regulatory
            frameworks.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">How we speak</h3>
          <p className="leading-relaxed text-ink">
            Every public statement distinguishes established evidence,
            proposed research and long-term objectives. Where methodology
            would normally appear, the project explains that detailed
            methodologies remain confidential and will be shared only with
            qualified institutional collaborators under appropriate
            agreements.
          </p>
        </GlassCard>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="py-10">
        <SectionHeading
          eyebrow="What we hold to"
          title="Values"
          lead="Nine commitments that govern decisions, communications and conduct."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <GlassCard as="li" key={value.title} interactive>
              <h3 className="flex items-center gap-2.5 font-semibold tracking-[0.01em] text-heading">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-coral-500"
                />
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {value.text}
              </p>
            </GlassCard>
          ))}
        </ul>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder-heading" className="py-16">
        <SectionHeading
          eyebrow="Founder"
          title="The Person Behind the Project"
          align="left"
        />
        <GlassPanel className="mt-10 p-5 sm:p-7 md:p-10">
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
                id="founder-heading"
                className="text-2xl font-semibold leading-tight tracking-[0.01em] text-heading md:text-3xl"
              >
                Rereu Lemein
              </h3>
              <p className="label-caps mt-2">Founder, {site.name}</p>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink">
                Rereu Lemein is a software and cybersecurity engineer,
                entrepreneur, philosopher and community builder based in
                Mombasa, Kenya. He is the founder of LysHub and Project
                Neorhiza, with a professional background in building secure,
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
      </section>

      {/* What Neorhiza is not */}
      <section aria-labelledby="not-heading" className="py-10">
        <SectionHeading
          eyebrow="Positioning"
          title="What Neorhiza Is Not"
          lead="Clarity about what a project is not is part of scientific honesty."
        />
        <GlassPanel className="mt-12 p-7 md:p-10">
          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {notList.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.5rem] flex size-4 shrink-0 items-center justify-center rounded-full bg-coral-100 text-[0.6rem] font-bold leading-none text-coral-700 dark:bg-coral-500/15 dark:text-coral-300"
                >
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
          <ResearchDisclaimer className="mt-8" title="Services disclaimer">
            {disclaimers.services}
          </ResearchDisclaimer>
        </GlassPanel>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}
