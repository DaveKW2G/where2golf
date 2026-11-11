"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { consumeCourseReturnTo } from "@/lib/course-navigation";

type BackButtonProps = {
  fallbackHref: string;
  courseId: number;
  className?: string;
  children: ReactNode;
};

export default function BackButton({
  fallbackHref,
  courseId,
  className,
  children,
}: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    const rememberedReturnTo = consumeCourseReturnTo(courseId);
    if (rememberedReturnTo) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.replace(rememberedReturnTo);
      }
      return;
    }

    try {
      if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
        router.back();
        return;
      }
    } catch {
      // Use the safe country-level destination for an invalid referrer.
    }

    router.replace(fallbackHref);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
