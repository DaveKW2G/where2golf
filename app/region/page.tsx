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

  if (region) {
    const query = new URLSearchParams()

    if (params.lat) query.set("lat", params.lat)
    if (params.lng) query.set("lng", params.lng)

    const qs = query.toString()
    return redirect(`/switzerland/${region}${qs ? `?${qs}` : ""}`)
  }

  return redirect("/switzerland")
}