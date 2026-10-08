import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

const irelandPageBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  "/ireland": [
    { label: "Home", href: "/" },
    { label: "Ireland", href: "/ireland" },
  ],
};

const countyPages = {
  clare: "Clare",
  cork: "Cork",
  donegal: "Donegal",
  down: "Down",
  dublin: "Dublin",
  galway: "Galway",
  kerry: "Kerry",
  kildare: "Kildare",
  limerick: "Limerick",
  wicklow: "Wicklow",
};

for (const [slug, county] of Object.entries(countyPages)) {
  const href = `/golf-courses-${slug}`;
  irelandPageBreadcrumbs[href] = [
    { label: "Home", href: "/" },
    { label: "Ireland", href: "/ireland" },
    { label: `County ${county}`, href },
  ];
}

const irelandGuidePages: Record<string, string> = {
  "/golf-near-adare-manor": "Golf Near Adare Manor",
  "/golf-near-belfast": "Golf Near Belfast",
  "/golf-near-cork": "Golf Near Cork",
  "/golf-near-dublin": "Golf Near Dublin",
  "/golf-near-galway": "Golf Near Galway",
  "/golf-green-fees-ireland": "Golf Green Fees Ireland",
  "/golf-in-northern-ireland": "Golf in Northern Ireland",
  "/golf-in-south-east-ireland": "Golf in South East Ireland",
  "/links-golf-ireland": "Links Golf in Ireland",
  "/links-golf-near-dublin": "Links Golf Near Dublin",
};

for (const [href, label] of Object.entries(irelandGuidePages)) {
  irelandPageBreadcrumbs[href] = [
    { label: "Home", href: "/" },
    { label: "Ireland", href: "/ireland" },
    { label, href },
  ];
}

const countyRoutes: Record<string, string> = Object.fromEntries(
  Object.entries(countyPages).map(([slug, county]) => [
    `golf-courses-${slug}`,
    `County ${county}`,
  ]),
);

const sourceParents: Record<string, { label: string; href: string }> = {
  ireland: { label: "Ireland", href: "/ireland" },
  "golf-green-fees-ireland": {
    label: "Golf Green Fees Ireland",
    href: "/golf-green-fees-ireland",
  },
  "golf-in-northern-ireland": {
    label: "Golf in Northern Ireland",
    href: "/golf-in-northern-ireland",
  },
  "golf-in-south-east-ireland": {
    label: "Golf in South East Ireland",
    href: "/golf-in-south-east-ireland",
  },
  "links-golf-ireland": {
    label: "Links Golf in Ireland",
    href: "/links-golf-ireland",
  },
  "irish-links-golf": {
    label: "Links Golf in Ireland",
    href: "/links-golf-ireland",
  },
  "links-golf-near-dublin": {
    label: "Links Golf Near Dublin",
    href: "/links-golf-near-dublin",
  },
  cork: { label: "Golf Near Cork", href: "/golf-near-cork" },
  dublin: { label: "Golf Near Dublin", href: "/golf-near-dublin" },
  galway: { label: "Golf Near Galway", href: "/golf-near-galway" },
  belfast: { label: "Golf Near Belfast", href: "/golf-near-belfast" },
  adare: {
    label: "Golf Near Adare Manor",
    href: "/golf-near-adare-manor",
  },
};

for (const [slug, county] of Object.entries(countyPages)) {
  sourceParents[`golf-courses-${slug}`] = {
    label: `County ${county}`,
    href: `/golf-courses-${slug}`,
  };
}

export function getIrelandCourseBreadcrumbs(
  courseId: number,
  courseName: string,
  region: string,
  source?: string,
): BreadcrumbItem[] {
  const parent = source ? sourceParents[source] : undefined;
  const countySlug = region.trim().toLowerCase().replace(/\s+/g, "-");
  const countyLabel = countyRoutes[`golf-courses-${countySlug}`];
  const fallbackParent = countyLabel
    ? {
        label: countyLabel,
        href: `/golf-courses-${countySlug}`,
      }
    : { label: "Ireland", href: "/ireland" };
  const selectedParent = parent || fallbackParent;

  return [
    { label: "Home", href: "/" },
    { label: "Ireland", href: "/ireland" },
    ...(selectedParent.href === "/ireland" ? [] : [selectedParent]),
    { label: courseName, href: `/courses/${courseId}` },
  ];
}

export default function Breadcrumbs({
  page,
  items,
  compact = false,
}: {
  page?: string;
  items?: BreadcrumbItem[];
  compact?: boolean;
}) {
  const breadcrumbItems = items || (page ? irelandPageBreadcrumbs[page] : null);

  if (!breadcrumbItems?.length) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, "https://guestplaygolf.com").toString(),
    })),
  };

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={
          compact
            ? "mb-4 text-xs text-slate-600"
            : "mx-auto max-w-[480px] px-4 pt-3 pb-1 text-xs text-slate-600 lg:max-w-[1120px] lg:px-5"
        }
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {breadcrumbItems.map((item, index) => {
            const isCurrentPage = index === breadcrumbItems.length - 1;

            return (
              <li
                key={`${item.href}-${item.label}`}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <span aria-hidden="true" className="text-slate-400">
                    /
                  </span>
                )}
                {isCurrentPage ? (
                  <span
                    aria-current="page"
                    className="font-medium text-slate-800"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-emerald-800 underline-offset-2 hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
