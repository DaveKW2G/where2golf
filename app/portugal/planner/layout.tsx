import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portugal Golf Trip Planner | GuestPlayGolf",
  description:
    "Build a Portugal golf itinerary from your chosen base, compare courses, share the shortlist and vote with your group.",
  alternates: {
    canonical: "https://guestplaygolf.com/portugal/planner",
  },
  openGraph: {
    title: "Portugal Golf Trip Planner | GuestPlayGolf",
    description:
      "Choose your base and build a shared Portugal golf itinerary with GuestPlayGolf.",
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
