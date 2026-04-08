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
    if (window.history.length > 1) {
      router.back()
      return
    }

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