import { redirect } from "next/navigation"

type RegionPageProps = {
  searchParams: Promise<{
    region?: string
    lat?: string
    lng?: string
  }>
}

export default async function RegionPage({ searchParams }: RegionPageProps) {
  const params = await searchParams

  const region = params.region?.toLowerCase()

  // Preserve location params if they exist
  if (region) {
    if (params.lat && params.lng) {
      return redirect(
        `/switzerland/${region}?lat=${params.lat}&lng=${params.lng}`
      )
    }

    return redirect(`/switzerland/${region}`)
  }

  // fallback
  return redirect("/switzerland")
}