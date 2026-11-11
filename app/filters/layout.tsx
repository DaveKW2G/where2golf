import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  title: "Golf Course Search | GuestPlayGolf",
  alternates: {
    canonical: `${siteUrl}/filters`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function FiltersLayout({ children }: { children: ReactNode }) {
  return children;
}
