import { NextResponse } from 'next/server'

type GeocodeResult = {
  lat: string
  lon: string
  display_name?: string
}

function normaliseCountry(country: string | null) {
  if (!country) return 'Ireland'

  const lowerCountry = country.toLowerCase()

  if (lowerCountry === 'ireland') return 'Ireland'
  if (lowerCountry === 'switzerland') return 'Switzerland'

  return 'Ireland'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const place = searchParams.get('place')
  const country = normaliseCountry(searchParams.get('country'))

  if (!place || place.trim().length === 0) {
    return NextResponse.json(
      { error: 'Place is required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        `${place.trim()}, ${country}`
      )}`,
      {
        headers: {
          'User-Agent': 'GuestPlayGolf/1.0',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Unable to geocode location' },
        { status: 502 }
      )
    }

    const data = (await response.json()) as GeocodeResult[]

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      label: data[0].display_name || place.trim(),
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to geocode location' },
      { status: 500 }
    )
  }
}