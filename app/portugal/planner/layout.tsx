import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portugal Golf Trip Shortlist | GuestPlayGolf",
  description:
    "Choose your base, discover Portuguese golf courses on a map, build a shared shortlist and vote with your group.",
  alternates: {
    canonical: "https://guestplaygolf.com/portugal/planner",
  },
  openGraph: {
    title: "Portugal Golf Trip Shortlist | GuestPlayGolf",
    description:
      "Explore Portuguese golf courses, build a shared shortlist, invite friends and vote together.",
    url: "https://guestplaygolf.com/portugal/planner",
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

export default function PortugalPlannerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
