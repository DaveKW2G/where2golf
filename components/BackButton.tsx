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

function getSingleParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);

  if (!value || value === "undefined" || value === "null") {
    return null;
  }

  return value;
}

function getCountryFromUrl(url: URL) {
  const paramCountry = getSingleParam(url.searchParams, "country");

  if (paramCountry) {
    const cleanCountry = paramCountry.toLowerCase();

    if (cleanCountry === "switzerland") return "switzerland";
    if (cleanCountry === "ireland") return "ireland";
  }

  if (url.pathname.startsWith("/switzerland")) return "switzerland";
  if (url.pathname.startsWith("/ireland")) return "ireland";

  return null;
}

function getCountryFromHref(href: string) {
  if (href.startsWith("/switzerland")) return "switzerland";
  if (href.startsWith("/ireland")) return "ireland";

  try {
    const parsedUrl = new URL(href, window.location.origin);
    return getCountryFromUrl(parsedUrl);
  } catch {
    return null;
  }
}

function getPlannerHref(country: string, tripId?: string | null) {
  const basePath =
    country === "switzerland" ? "/switzerland/planner" : "/ireland/planner";

  if (tripId && tripId !== "undefined" && tripId !== "null") {
    return `${basePath}?tripId=${encodeURIComponent(tripId)}`;
  }

  return basePath;
}

function isPlannerContext(url: URL) {
  const planner = getSingleParam(url.searchParams, "planner");
  const tripId = getSingleParam(url.searchParams, "tripId");
  const source = getSingleParam(url.searchParams, "source");

  return planner === "true" || Boolean(tripId) || source === "planner";
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
          // Ignore invalid history URLs.
        }
      }
    }

    const referrer = document.referrer;

    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);

        if (referrerUrl.origin === currentOrigin) {
          return referrerUrl;
        }
      } catch {
        // Ignore invalid referrer URLs.
      }
    }

    return null;
  }

  function handleClick() {
    const currentUrl = new URL(window.location.href);
    const previousInternalUrl = getPreviousInternalUrl();

    const currentCountry = getCountryFromUrl(currentUrl);
    const previousCountry = previousInternalUrl
      ? getCountryFromUrl(previousInternalUrl)
      : null;
    const fallbackCountry = getCountryFromHref(fallbackHref);

    const country = currentCountry || previousCountry || fallbackCountry;

    const currentTripId = getSingleParam(currentUrl.searchParams, "tripId");
    const previousTripId = previousInternalUrl
      ? getSingleParam(previousInternalUrl.searchParams, "tripId")
      : null;

    const tripId = currentTripId || previousTripId;

    const currentIsPlannerContext = isPlannerContext(currentUrl);
    const previousIsPlannerContext = previousInternalUrl
      ? isPlannerContext(previousInternalUrl)
      : false;

    /*
     * Planner journeys must be country-aware.
     * This prevents Swiss planner/course flows from falling back into /ireland/planner
     * because of browser history.
     */
    if (
      country &&
      (currentIsPlannerContext ||
        previousIsPlannerContext ||
        fallbackHref.includes("/planner"))
    ) {
      router.push(getPlannerHref(country, tripId));
      return;
    }

    if (previousInternalUrl) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}