import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  title: "Ireland Golf Trip Shortlist | Discover, Share & Vote",
  description:
    "Choose your base, explore Irish golf courses on a map, build a shared shortlist and vote with your group.",
  alternates: {
    canonical: `${siteUrl}/ireland/planner`,
  },
  openGraph: {
    title: "Ireland Golf Trip Shortlist | Discover, Share & Vote",
    description:
      "Explore Irish golf courses, build a shared shortlist, invite friends and vote together.",
    url: `${siteUrl}/ireland/planner`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ireland Golf Trip Shortlist | Discover, Share & Vote",
    description:
      "Explore Irish golf courses, build a shared shortlist, invite friends and vote together.",
  },
};

export default function IrelandPlannerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
