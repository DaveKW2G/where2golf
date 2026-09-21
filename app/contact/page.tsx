import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://guestplaygolf.com";
const contactEmail = "guestplaygolf@gmail.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Contact GuestPlayGolf | Courses, Corrections & Club Enquiries",
  description:
    "Suggest a golf course, tell GuestPlayGolf about a correction, or get in touch about your golf club.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact GuestPlayGolf",
    description:
      "Suggest a golf course, report a correction or get in touch about your club.",
    url: `${siteUrl}/contact`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

const topics = [
  {
    title: "Suggest a course",
    description:
      "Know a golf course we should list? Tell us its name and where it is.",
    subject: "Course suggestion for GuestPlayGolf",
    body: "Course name:\nLocation:\nCourse website (if known):\n\nAnything else we should know:\n",
    label: "Suggest a course →",
  },
  {
    title: "Correct a listing",
    description:
      "Spotted something out of date or in the wrong place? Send us the page and what needs fixing.",
    subject: "Course correction for GuestPlayGolf",
    body: "Course or page URL:\nWhat needs correcting:\nSource (if known):\n",
    label: "Report a correction →",
  },
  {
    title: "Get in touch about your club",
    description:
      "Work with a golf club? Tell us which club you're with and how we can help.",
    subject: "Golf club enquiry for GuestPlayGolf",
    body: "Club name:\nYour role:\nClub website:\n\nYour message:\n",
    label: "Contact us about your club →",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-10 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <div className="mt-6 max-w-[760px]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">
              Get in touch
            </p>

            <h1 className="mt-2 text-[30px] font-bold leading-tight sm:text-[36px] lg:text-[44px]">
              Contact GuestPlayGolf
            </h1>

            <p className="mt-4 text-[15px] leading-7 text-emerald-50/95 lg:text-[17px]">
              Suggest a course, flag a mistake or get in touch about your golf
              club. We&apos;d be glad to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-7 lg:max-w-[1120px] lg:px-5 lg:py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {topics.map((topic) => (
            <article
              key={topic.title}
              className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {topic.title}
              </h2>

              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                {topic.description}
              </p>

              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(topic.subject)}&body=${encodeURIComponent(topic.body)}`}
                className="mt-5 inline-block rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-emerald-900"
              >
                {topic.label}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100 lg:p-6">
          <p className="text-sm leading-6 text-slate-700">
            Prefer to write your own email? You can reach us directly at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-semibold text-emerald-800 underline underline-offset-2"
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}