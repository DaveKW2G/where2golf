"use client";
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import CourseCard from '@/components/CourseCard'
import { filterCourses, priceBands, distanceKm, type Course, type Filters } from '@/lib/course-explorer'
export type CountyCourse = Course
const CountyCourseMap = dynamic(() => import('@/components/CountyCourseMap'), { ssr: false, loading: () => <div className="rounded-3xl bg-white p-8">Loading map…</div> })
const empty: Filters = { price: '', courseType: '', holes: '', county: '', when: '', search: '', radius: '' }
type BaseLocation = { name: string; coordinates: [number, number] }
type Props = {
  courses: Course[]
  countyName: string
  source: string
  initialCenter: [number, number]
  showCounty?: boolean
  pricingFocus?: boolean
  hideCourseType?: boolean
  allowedPriceBands?: string[]
  townExample?: string
  initialOrigin?: [number,number]
  initialRadiusKm?: number
  originName?: string
  groups?: {key:string; name:string; counties:string[]; description:string}[]
  countryName?: string
  countryQuery?: string
  regionLabel?: string
  baseLocations?: BaseLocation[]
  pricingNotice?: string
}
export default function CountyCourseExplorer({ courses, countyName, source, initialCenter, showCounty = false, pricingFocus = false, townExample = "Limerick", hideCourseType = false, allowedPriceBands, initialOrigin, initialRadiusKm, originName = "", groups, countryName = 'Ireland', countryQuery = 'ireland', regionLabel = 'County', baseLocations = [], pricingNotice }: Props) {
  const [initialQuery] = useState(() => {
    const params = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search)
    const queryFilters: Filters = {
      search: params.get('search') || '', price: params.get('price') || '',
      courseType: params.get('courseType') || '', holes: params.get('holes') || '',
      county: params.get('county') || '', when: params.get('when') || '', radius: params.get('radius') || (initialOrigin && initialRadiusKm ? String(initialRadiusKm) : ''),
    }
    const lat = Number(params.get('lat'))
    const lng = Number(params.get('lng'))
    const queryOrigin: [number, number] | null = Number.isFinite(lat) && Number.isFinite(lng) && params.has('lat') && params.has('lng') ? [lat, lng] : null
    return {
      filters: { ...empty, ...queryFilters },
      origin: queryOrigin || initialOrigin || null,
      locationLabel: params.get('location') || originName,
      sort: params.get('sort') || (initialOrigin ? 'distance' : pricingFocus ? 'price' : 'name'),
      view: params.get('view') === 'map' ? 'map' as const : 'list' as const,
      visibleCount: Math.max(24, Number(params.get('count')) || 24),
    }
  })
  const [filters, setFilters] = useState<Filters>(initialQuery.filters)
  const [sort, setSort] = useState(initialQuery.sort)
  const [view, setView] = useState<'list' | 'map'>(initialQuery.view)
  const [origin, setOrigin] = useState<[number,number] | null>(initialQuery.origin)
  const [place, setPlace] = useState(initialQuery.locationLabel)
  const [locationLabel, setLocationLabel] = useState(initialQuery.locationLabel)
  const [locationError, setLocationError] = useState('')
  const [busy, setBusy] = useState(false)
  const [visibleCount, setVisibleCount] = useState(initialQuery.visibleCount)
  const [selectedBase, setSelectedBase] = useState(baseLocations.some(base => base.name === initialQuery.locationLabel) ? initialQuery.locationLabel : '')
  function change(key: keyof Filters, value: string) { setFilters(current => ({...current, [key]: value})); setVisibleCount(24) }
  const filtered = useMemo(() => filterCourses(courses,filters,origin,sort), [courses,filters,origin,sort])
  const returnParams = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    const isDefaultRadius = key === 'radius' && initialRadiusKm && value === String(initialRadiusKm)
    if (value && !isDefaultRadius) returnParams.set(key, value)
  }
  const originMatchesDefault = origin && initialOrigin && origin[0] === initialOrigin[0] && origin[1] === initialOrigin[1]
  if (origin && !originMatchesDefault) { returnParams.set('lat', String(origin[0])); returnParams.set('lng', String(origin[1])) }
  if (locationLabel && locationLabel !== originName) returnParams.set('location', locationLabel)
  if (sort !== (initialOrigin ? 'distance' : pricingFocus ? 'price' : 'name')) returnParams.set('sort', sort)
  if (view === 'map') returnParams.set('view', 'map')
  if (visibleCount > 24) returnParams.set('count', String(visibleCount))
  const returnQuery = returnParams.toString()
  const returnPath = source === 'portugal/algarve' ? '/golf-courses-algarve' : `/${source}`
  const returnTo = `${returnPath}${returnQuery ? `?${returnQuery}` : ''}`

  useEffect(() => {
    const nextUrl = `${window.location.pathname}${returnQuery ? `?${returnQuery}` : ''}`
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(window.history.state, '', nextUrl)
    }
  }, [returnQuery])
  const counties = [...new Set(courses.map(c => c.region?.trim()).filter((x): x is string => Boolean(x)))].sort()
  const types = [...new Set(courses.map(c => c.course_type?.trim()).filter((x): x is string => Boolean(x)))].sort()
  const availablePriceBands = allowedPriceBands ? priceBands.filter(b => allowedPriceBands.includes(b.value)) : priceBands
  const access = ['Everyday', 'Weekdays', 'Weekend', 'Limited Access', ...new Set(courses.map(c => c.independent_guest_days?.trim()).filter((x): x is string => Boolean(x) && !['Everyday','Weekdays','Weekend','Weekends','Limited','Limited Access'].includes(x!))) ]
  const holes = [...new Set(courses.map(c => c.holes).filter((x): x is number => x != null))].sort((a,b)=>a-b)
  const regionPlural = regionLabel.toLowerCase() === 'county' ? 'counties' : `${regionLabel.toLowerCase()}s`
  function clear() { setFilters({...empty, radius: initialOrigin && initialRadiusKm ? String(initialRadiusKm) : ''}); setOrigin(initialOrigin || null); setPlace(''); setLocationLabel(originName); setSelectedBase(baseLocations.some(base => base.name === originName) ? originName : ''); setLocationError(''); setSort(initialOrigin ? 'distance' : pricingFocus ? 'price' : 'name'); setVisibleCount(24) }
  function located(point: [number,number], label: string, baseName = '') { setOrigin(point); setLocationLabel(label); setSelectedBase(baseName); setFilters(current => ({...current, radius: current.radius || '50'})); setSort('distance'); setLocationError(''); setVisibleCount(24); setBusy(false) }
  function chooseBase(name: string) {
    setSelectedBase(name)
    if (!name) {
      setOrigin(null)
      setLocationLabel('')
      setFilters(current => ({...current, radius: ''}))
      setSort(pricingFocus ? 'price' : 'name')
      setVisibleCount(24)
      return
    }
    const base = baseLocations.find(option => option.name === name)
    if (base) located(base.coordinates, base.name, base.name)
  }
  function nearMe() {
    if (!navigator.geolocation) { setLocationError('Your browser does not support location access. Enter a town instead.'); return }
    setBusy(true); setLocationError('')
    navigator.geolocation.getCurrentPosition(p => located([p.coords.latitude,p.coords.longitude], 'Your location'), () => {setBusy(false);setLocationError('Location access was unavailable. Enter a town instead.')}, {timeout:10000, maximumAge:300000})
  }
  async function findPlace() {
    if (!place.trim()) return
    setBusy(true); setLocationError('')
    try {
      const response = await fetch(`/api/geocode?country=${encodeURIComponent(countryName)}&place=${encodeURIComponent(place.trim())}`)
      const result = await response.json()
      if (!response.ok || !Number.isFinite(result.latitude) || !Number.isFinite(result.longitude)) throw Error('Location not found. Try another town or use your location.')
      located([result.latitude,result.longitude], place.trim())
    } catch (error) { setLocationError(error instanceof Error ? error.message : 'Unable to find this location.'); setBusy(false) }
  }
  const control = 'mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 focus:outline-emerald-700'
  function select(label: string, key: keyof Filters, options: {value:string;label:string}[]) {
    return <label className="text-sm font-semibold text-slate-700">{label}<select aria-label={label} className={control} value={filters[key]} onChange={e=>change(key,e.target.value)}><option value="">{key === 'when' ? 'Any visitor access' : key === 'county' ? `All ${regionPlural}` : key === 'price' ? 'All prices' : key === 'courseType' ? 'All course types' : 'Any number of holes'}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
  }
  const renderCards = (items: Course[]) => <div className="grid gap-4 lg:grid-cols-2">{items.map(c=><CourseCard key={c.id} id={c.id} country={c.country||countryName} course_name={c.course_name} town={c.town||''} region={c.region||''} holes={c.holes??undefined} independent_guest_days={c.independent_guest_days??undefined} season={c.season??undefined} price_range={c.price_range??undefined} course_type={c.course_type??undefined} course_image={c.course_image??undefined} latitude={c.latitude??undefined} longitude={c.longitude??undefined} max_handicap={c.max_handicap??undefined} distance={origin && Number.isFinite(distanceKm(c,origin)) ? distanceKm(c,origin) : undefined} searchParams={{country:countryQuery,source,returnTo}} />)}</div>
  return <div>
    <div className="mb-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 lg:p-5">
      {pricingFocus && <div className="mb-5"><h2 className="text-xl font-bold text-slate-900">Choose your visitor price band</h2><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={()=>change('price','')} aria-pressed={!filters.price} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${!filters.price?'bg-emerald-800 text-white':'border-slate-300'}`}>All prices</button>{availablePriceBands.map(b=><button key={b.value} type="button" onClick={()=>change('price',b.value)} aria-pressed={filters.price===b.value} className={`rounded-xl border px-4 py-3 text-left text-sm ${filters.price===b.value?'bg-emerald-800 text-white':'border-slate-300'}`}><strong className="block">{b.value}</strong><span className="mt-1 block text-xs">{b.range}</span></button>)}</div></div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-semibold text-slate-700">Search courses, towns or {regionPlural}<input className={control} value={filters.search} onChange={e=>change('search',e.target.value)} placeholder="Course name or location" /></label>
        {showCounty && select(regionLabel,'county',counties.map(x=>({value:x,label:x})))}
        {!pricingFocus && select('Price','price',availablePriceBands.map(b=>({value:b.value,label:`${b.value} · ${b.range}`})))}
        {!hideCourseType && select('Course type','courseType',types.map(x=>({value:x,label:x})))}
        {select('Holes','holes',holes.map(x=>({value:String(x),label:`${x} holes`})))}
        {select('When can you play?','when',access.map(x=>({value:x,label:x==='Weekend'?'Weekends':x==='Everyday'?'Every day':x})))}
      </div>
      {pricingNotice && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-200"><strong>Price guide:</strong> {pricingNotice}</p>}
      <p className="mt-3 text-xs leading-5 text-slate-500">Weekday and weekend filters include courses with everyday visitor access. Tee times remain subject to club availability and competitions.</p>
      <details open={Boolean(initialOrigin) || baseLocations.length > 0} className="mt-4 border-t border-slate-100 pt-3"><summary className="cursor-pointer text-sm font-semibold text-emerald-800">{baseLocations.length > 0 ? 'Choose your base and filter by distance' : 'Filter by distance'}</summary><div className="mt-3 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3">{baseLocations.length > 0 && <label className="text-sm font-semibold">Where are you staying?<select aria-label="Where are you staying?" className={control} value={selectedBase} onChange={e=>chooseBase(e.target.value)}><option value="">Choose a base</option>{baseLocations.map(base=><option key={base.name} value={base.name}>{base.name}</option>)}</select></label>}<label className="text-sm font-semibold">Town or starting point<input className={control} value={place} onChange={e=>setPlace(e.target.value)} placeholder={`e.g. ${townExample}`} /></label><div className="flex gap-2"><button type="button" disabled={busy || !place.trim()} onClick={findPlace} className="rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Find location</button><button type="button" disabled={busy} onClick={nearMe} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold disabled:opacity-50">Near me</button></div><label className="text-sm font-semibold">Distance<select className={control} value={filters.radius} disabled={!origin} onChange={e=>change('radius',e.target.value)}><option value="">Any distance</option>{[...new Set([10,25,50,75,100,150,...(initialRadiusKm ? [initialRadiusKm] : [])])].sort((a,b)=>a-b).map(x=><option key={x} value={x}>Within {x} km</option>)}</select></label></div>{busy && <p role="status" className="mt-2 text-sm">Finding your location…</p>}{locationLabel && <p className="mt-2 text-sm text-slate-600">Distances from {locationLabel} are straight-line distances.</p>}{locationError && <p role="alert" className="mt-2 text-sm text-red-700">{locationError}</p>}</details>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><label className="text-sm font-semibold">Sort by<select className={control} value={sort} onChange={e=>{setSort(e.target.value);setVisibleCount(24)}}><option value="name">Course name</option><option value="price">Lowest price band first</option>{origin && <option value="distance">Nearest first</option>}</select></label><div className="flex flex-wrap gap-2"><button type="button" onClick={clear} className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold">Clear filters</button><button type="button" aria-pressed={view==='map'} onClick={()=>setView(current=>current==='map'?'list':'map')} className={`rounded-full border px-5 py-2.5 text-sm font-semibold ${view==='map'?'bg-emerald-800 text-white':'border-emerald-800 text-emerald-800'}`}>{view==='map'?'Hide map':'Show map'}</button></div></div>
      {initialRadiusKm && <p className="mt-3 text-xs leading-5 text-slate-500">This guide covers courses within {initialRadiusKm} km of {originName}. Distance filters refine this guide; for other locations, use <a className="font-semibold text-emerald-800 underline" href={`/filters?country=${encodeURIComponent(countryName)}`}>{countryName} advanced search</a>.</p>}
      <p role="status" aria-live="polite" className="mt-4 text-sm text-slate-600">Showing <strong>{filtered.length}</strong> of {courses.length} golf courses in {countyName}.</p>
    </div>
    {filtered.length===0 ? <div className="rounded-3xl bg-white p-6 text-center">No courses match these filters. Try clearing a filter.</div> : <>{view==='map' && <div className="mb-5"><CountyCourseMap courses={filtered} initialCenter={initialCenter}/></div>}{groups ? <div className="space-y-8">{groups.map(group => {
      const matches = filtered.filter(c=>group.counties.some(county=>county.toLowerCase()===c.region?.trim().toLowerCase()))
      if (!matches.length) return null
      return <section key={group.key} id={group.key} className="scroll-mt-24"><div className="mb-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6"><p className="text-xs font-semibold text-emerald-700">{matches.length} links courses</p><h2 className="mt-1 text-xl font-bold text-slate-900">{group.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>{group.key==='dublin-east' && <a href="/links-golf-near-dublin" className="mt-3 inline-block text-sm font-semibold text-emerald-800">Staying in Dublin? See Links Golf Near Dublin →</a>}</div>{renderCards(matches)}</section>
    })}{renderCards(filtered.filter(c=>!groups.some(g=>g.counties.some(county=>county.toLowerCase()===c.region?.trim().toLowerCase()))))}</div> : renderCards(filtered.slice(0,visibleCount))}{!groups && visibleCount<filtered.length && <button type="button" onClick={()=>setVisibleCount(n=>n+24)} className="mx-auto mt-5 block rounded-full bg-emerald-800 px-6 py-3 font-semibold text-white">Show more courses ({Math.min(24,filtered.length-visibleCount)})</button>}</>}
  </div>
}
