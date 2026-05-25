import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (url.pathname === "/golf-near-dublin" && url.searchParams.has("radius")) {
    url.searchParams.delete("radius")
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/golf-near-dublin"],
}