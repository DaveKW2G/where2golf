"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

type BackButtonProps = {
  fallbackHref: string
  className?: string
  children: ReactNode
}

export default function BackButton({
  fallbackHref,
  className,
  children,
}: BackButtonProps) {
  const router = useRouter()

  function handleClick() {
    // Check if there is a referrer from the same site
    const referrer = document.referrer
    const currentOrigin = window.location.origin

    const isInternalReferrer =
      referrer && referrer.startsWith(currentOrigin)

    if (isInternalReferrer) {
      router.back()
      return
    }

    // Otherwise go to fallback (clean UX for Google / direct traffic)
    router.push(fallbackHref)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  )
}