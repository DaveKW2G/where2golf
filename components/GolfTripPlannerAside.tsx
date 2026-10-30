import Link from "next/link";

type GolfTripPlannerAsideProps = {
  heading: string;
  description: string;
  steps: [string, string, string];
  footer: string;
};

export default function GolfTripPlannerAside({
  heading,
  description,
  steps,
  footer,
}: GolfTripPlannerAsideProps) {
  return (
    <aside className="min-w-0">
      <div className="flex h-full flex-col rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 lg:p-6">
        <span className="inline-block w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
          Free online tool
        </span>

        <h2 className="mt-4 text-xl font-bold text-slate-900">{heading}</h2>

        <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>

        <div className="mt-4 grid gap-3">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                {index + 1}
              </span>
              <p className="pt-1 text-sm text-slate-700">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <Link
            href="/ireland/planner"
            className="block w-full rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-emerald-900"
          >
            Start Free Golf Trip Planner
          </Link>

          <p className="mt-3 text-center text-xs leading-5 text-slate-600">
            {footer}
          </p>
        </div>
      </div>
    </aside>
  );
}
