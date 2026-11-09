import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const destination = request.nextUrl.clone()
  destination.pathname = '/golf-courses-algarve'

  return NextResponse.redirect(destination, 301)
}
