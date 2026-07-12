"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type BackButtonProps = {
  fallbackHref: string;
  className?: string;
  children: ReactNode;
};

type NavigationHistoryEntry = {
  index: number;
  url: string | null;
};

type BrowserNavigation = {
  currentEntry?: NavigationHistoryEntry;
  entries?: () => NavigationHistoryEntry[];
};

declare global {
  interface Window {
    navigation?: BrowserNavigation;
  }
}

export default function BackButton({
  fallbackHref,
  className,
  children,
}: BackButtonProps) {
  const router = useRouter();

  function getPreviousInternalUrl() {
    const currentOrigin = window.location.origin;
    const navigation = window.navigation;

    /*
     * The Navigation API can identify the actual previous browser-history
     * entry, including navigation performed through the Next.js App Router.
     */
    if (navigation?.currentEntry && navigation.entries) {
      const entries = navigation.entries();
      const currentIndex = navigation.currentEntry.index;
      const previousEntry = entries.find(
        (entry) => entry.index === currentIndex - 1,
      );

      if (previousEntry?.url) {
        try {
          const previousUrl = new URL(previousEntry.url);

          if (previousUrl.origin === currentOrigin) {
            return previousUrl;
          }
        } catch {
          // Ignore an invalid history URL and continue to the fallback checks.
        }
      }
    }

    /*
     * Fallback for browsers that do not expose the Navigation API.
     * This works for traditional page navigation from another page
     * on GuestPlayGolf.
     */
    const referrer = document.referrer;

    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);

        if (referrerUrl.origin === currentOrigin) {
          return referrerUrl;
        }
      } catch {
        // Ignore an invalid referrer.
      }
    }

    return null;
  }

  function handleClick() {
    const previousInternalUrl = getPreviousInternalUrl();

    if (previousInternalUrl) {
      router.back();
      return;
    }

    /*
     * Direct visits from Google, bookmarks, shared links or external
     * websites use the page-specific fallback rather than leaving the site.
     */
    router.push(fallbackHref);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}