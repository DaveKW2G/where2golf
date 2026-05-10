import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://guestplaygolf.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "About GuestPlayGolf | Helping golfers find where to play",
  description:
    "Learn more about GuestPlayGolf and our mission to help visiting golfers discover where they can play golf around the world.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About GuestPlayGolf",
    description:
      "GuestPlayGolf helps golfers discover where they can play next, with clear information on golf courses, access and travel-friendly golf regions.",
    url: `${siteUrl}/about`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white no-underline">
              ← Home
            </Link>

            <div className="text-[13px] uppercase tracking-wide text-white/80">
              GuestPlayGolf
            </div>

            <div className="w-10" />
          </div>

          <div className="mt-6">
            <p className="text-[12px] uppercase tracking-[0.18em] text-emerald-200">
              About GuestPlayGolf
            </p>

            <h1 className="mt-3 text-[30px] font-bold leading-tight">
              Helping golfers find where to play next
            </h1>

            <p className="mt-5 text-[16px] leading-7 text-emerald-50/95">
              Golf isn’t easy. Finding where to play should be.
            </p>

            <p className="mt-4 text-[15px] leading-6 text-white/85">
              GuestPlayGolf exists to help golfers quickly discover courses they
              can actually play, whether planning a golf trip, searching nearby
              options or exploring a new region.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[20px] font-semibold text-slate-900">
            Why GuestPlayGolf was created
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-700">
            Finding golf courses online is easy. Understanding where you can
            actually play as a visiting golfer is much harder.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            GuestPlayGolf was created to make golf discovery simpler, clearer
            and more transparent. We focus on the information golfers actually
            care about when deciding where to play next.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            That includes course type, guest access, handicap requirements,
            location, seasonality and practical planning information that helps
            golfers compare options quickly.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[20px] font-semibold text-slate-900">
            Why Switzerland and Ireland
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-700">
            Switzerland and Ireland offer very different golfing experiences,
            but both highlight the same challenge for travelling and independent
            golfers.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            In Switzerland, the challenge is often understanding access rules,
            handicap requirements and seasonal availability across a smaller and
            more exclusive golf market.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            In Ireland, the challenge is different. Golf is generally more open
            and accessible, but the sheer number of great courses and regions
            can make planning difficult — especially for visiting golfers trying
            to choose between links, parkland and championship layouts.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            GuestPlayGolf aims to simplify both experiences by helping golfers
            compare courses clearly and confidently.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[20px] font-semibold text-slate-900">
            What GuestPlayGolf focuses on
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>
              • Helping golfers identify where they can play as visitors or
              independent guests
            </li>

            <li>
              • Making golf discovery faster and easier on mobile
            </li>

            <li>
              • Comparing course types including links, parkland and inland
              layouts
            </li>

            <li>
              • Showing practical information such as handicap requirements,
              guest access and seasonality
            </li>

            <li>
              • Helping golfers plan golf around major regions, cities and golf
              destinations
            </li>
          </ul>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[20px] font-semibold text-slate-900">
            Regions GuestPlayGolf covers
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-700">
            GuestPlayGolf is currently focused on Switzerland and Ireland, with
            regional golf guides and destination pages designed specifically for
            visiting golfers.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Coverage includes major golf regions, nearby golf guides and courses
            that welcome visitors across both countries.
          </p>

          <div className="mt-5 grid gap-3">
            <Link
              href="/switzerland"
              className="rounded-2xl bg-emerald-800 px-5 py-4 text-white no-underline shadow-sm hover:bg-emerald-900"
            >
              <div className="text-[17px] font-semibold">
                Golf in Switzerland
              </div>

              <p className="mt-1 text-sm leading-5 text-white/85">
                Discover golf across Switzerland with clear information on
                access, regions and seasonal play.
              </p>
            </Link>

            <Link
              href="/ireland"
              className="rounded-2xl bg-emerald-800 px-5 py-4 text-white no-underline shadow-sm hover:bg-emerald-900"
            >
              <div className="text-[17px] font-semibold">
                Golf in Ireland
              </div>

              <p className="mt-1 text-sm leading-5 text-white/85">
                Explore links, parkland and championship golf across Ireland’s
                major golf regions.
              </p>
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-emerald-900 p-6 text-white shadow-sm">
          <h2 className="text-[22px] font-bold leading-tight">
            Golf isn’t easy.
            <br />
            Finding where to play should be.
          </h2>

          <p className="mt-4 text-sm leading-6 text-emerald-50/90">
            GuestPlayGolf was built to make golf discovery simpler, clearer and
            more useful for golfers planning their next round.
          </p>
        </div>
      </section>
    </main>
  )
}