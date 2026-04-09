"use client"

type CourseCTAButtonsProps = {
  websiteUrl?: string | null
  phoneNumber?: string | null
  directionsUrl: string
  courseName: string
  region: string
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

function trackClick(action: string, courseName: string, region: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: "course_cta",
      event_label: courseName,
      course_name: courseName,
      region,
    })
  }
}

export default function CourseCTAButtons({
  websiteUrl,
  phoneNumber,
  directionsUrl,
  courseName,
  region,
}: CourseCTAButtonsProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
      <div className="flex w-full max-w-[480px] gap-3">
        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackClick("click_website", courseName, region)}
            className="flex-[1.5] rounded-xl bg-emerald-700 px-4 py-3 text-center text-[14px] font-semibold text-white shadow-lg no-underline"
          >
            Website
          </a>
        ) : (
          <div className="flex-[1.5] rounded-xl bg-slate-300 px-4 py-3 text-center text-[14px] text-slate-600">
            Website
          </div>
        )}

        {phoneNumber ? (
          <a
            href={`tel:${phoneNumber}`}
            onClick={() => trackClick("click_call", courseName, region)}
            className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-center text-[14px] font-semibold text-white shadow-md no-underline"
          >
            Call
          </a>
        ) : (
          <div className="flex-1 rounded-xl bg-slate-300 px-4 py-3 text-center text-[14px] text-slate-600">
            Call
          </div>
        )}

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackClick("click_directions", courseName, region)}
          className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-center text-[14px] font-semibold text-white shadow-md no-underline"
        >
          Directions
        </a>
      </div>
    </div>
  )
}