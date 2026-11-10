"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type BackButtonProps = {
  fallbackHref: string;
  className?: string;
  children: ReactNode;
};

export default function BackButton({
  fallbackHref,
  className,
  children,
}: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    // The browser history may point outside GPG or to an unfiltered listing.
    // Replace the course page with its explicit return destination instead.
    router.replace(fallbackHref);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
