"use client";
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import CourseCard from '@/components/CourseCard'
import { filterCourses, priceBands, distanceKm, type Course, type Filters } from '@/lib/course-explorer'
export type CountyCourse = Course
const CountyCourseMap = dynamic(() => import('@/components/CountyCourseMap'), { ssr: false, loading: () => <div className="rounded-3xl bg-white p-8">Loading map…</div> })
const empty: Filters = { price: '', courseType: '', holes: '', county: '', when: '', search: '', radius: '' }
type Props = { courses: Course[]; countyName: string; source: string; initialCenter: [number, number]; showCounty?: boolean; pricingFocus?: boolean }
export default function CountyCourseExplorer({ courses, countyName, source, initialCenter, showCounty = false, pricingFocus = false }: Props) {
  const [filters, setFilters] = useState<Filters>(empty)
  const [sort, setSort] = useState(pricingFocus ? 'price' : 'name')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [origin, setOrigin] = useState<[number,number] | null>(null)
  const [place, setPlace] = useState('')
  const [locationLabel, setLocationLabel] = useState('')
  const [locationError, setLocationError] = useState('')
  const [busy, setBusy] = useState(false)
  const [visibleCount, setVisibleCount] = useState(24)
  function change(key: keyof Filters, value: string) { setFilters(current => ({...current, [key]: value})); setVisibleCount(24) }
  const filtered = useMemo(() => filterCourses(courses,filters,origin,sort), [courses,filters,origin,sort])
  const counties = [...new Set(courses.map(c => c.region?.trim()).filter((x): x is string => Boolean(x)))].sort()
  const types = [...new Set(courses.map(c => c.course_type?.trim()).filter((x): x is string => Boolean(x)))].sort()
  const access = ['Everyday', 'Weekdays', 'Weekend', 'Limited Access', ...new Set(courses.map(c => c.independent_guest_days?.trim()).filter((x): x is string => Boolean(x) && !['Everyday','Weekdays','Weekend','Weekends','Limited','Limited Access'].includes(x!))) ]
  const holes = [...new Set(courses.map(c => c.holes).filter((x): x is number => x != null))].sort((a,b)=>a-b)
  function clear() { setFilters(empty); setOrigin(null); setPlace(''); setLocationLabel(''); setLocationError(''); setSort(pricingFocus ? 'price' : 'name'); setVisibleCount(24) }
  function located(point: [number,number], label: string) { setOrigin(point); setLocationLabel(label); setFilters(current => ({...current, radius: current.radius || '50'})); setSort('distance'); setLocationError(''); setVisibleCount(24); setBusy(false) }
  function nearMe() {
    if (!navigator.geolocation) { setLocationError('Your browser does not support location access. Enter a town instead.'); return }
    setBusy(true); setLocationError('')
    navigator.geolocation.getCurrentPosition(p => located([p.coords.latitude,p.coords.longitude], 'Your location'), () => {setBusy(false);setLocationError('Location access was unavailable. Enter a town instead.')}, {timeout:10000, maximumAge:300000})
  }
  async function findPlace() {
    if (!place.trim()) return
    setBusy(true); setLocationError('')
    try {
      const response = await fetch(`/api/geocode?country=Ireland&place=${encodeURIComponent(place.trim())}`)
      const result = await response.json()
      if (!response.ok || !Number.isFinite(result.latitude) || !Number.isFinite(result.longitude)) throw Error('Location not found. Try another town or use your location.')
      located([result.latitude,result.longitude], place.trim())
    } catch (error) { setLocationError(error instanceof Error ? error.message : 'Unable to find this location.'); setBusy(false) }
  }
  const control = 'mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 focus:outline-emerald-700'
  function select(label: string, key: keyof Filters, options: {value:string;label:string}[]) {
    return <label className="text-sm font-semibold text-slate-700">{label}<select aria-label={label} className={control} value={filters[key]} onChange={e=>change(key,e.target.value)}><option value="">{key === 'when' ? 'Any visitor access' : key === 'county' ? 'All counties' : key === 'price' ? 'All prices' : key === 'courseType' ? 'All course types' : 'Any number of holes'}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
  }
  return <div>
    <div className="mb-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 lg:p-5">
      {pricingFocus && <div className="mb-5"><h2 className="text-xl font-bold text-slate-900">Choose your visitor price band</h2><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={()=>change('price','')} aria-pressed={!filters.price} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${!filters.price?'bg-emerald-800 text-white':'border-slate-300'}`}>All prices</button>{priceBands.map(b=><button key={b.value} type="button" onClick={()=>change('price',b.value)} aria-pressed={filters.price===b.value} className={`rounded-xl border px-4 py-3 text-left text-sm ${filters.price===b.value?'bg-emerald-800 text-white':'border-slate-300'}`}><strong className="block">{b.value}</strong></button>)}</div></div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-semibold text-slate-700">Search courses, towns or counties<input className={control} value={filters.search} onChange={e=>change('search',e.target.value)} placeholder="Course name or location" /></label>
        {showCounty && select('County','county',counties.map(x=>({value:x,label:x})))}
        {!pricingFocus && select('Price','price',priceBands.map(b=>({value:b.value,label:`${b.value} · ${b.range}`})))}
        {select('Course type','courseType',types.map(x=>({value:x,label:x})))}
        {select('Holes','holes',holes.map(x=>({value:String(x),label:`${x} holes`})))}
        {select('When can you play?','when',access.map(x=>({value:x,label:x==='Weekend'?'Weekends':x==='Everyday'?'Every day':x})))}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Weekday and weekend filters include courses with everyday visitor access. Tee times remain subject to club availability and competitions.</p>
      <details className="mt-4 border-t border-slate-100 pt-3"><summary className="cursor-pointer text-sm font-semibold text-emerald-800">Filter by distance</summary><div className="mt-3 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3"><label className="text-sm font-semibold">Town or starting point<input className={control} value={place} onChange={e=>setPlace(e.target.value)} placeholder="e.g. Limerick" /></label><div className="flex gap-2"><button type="button" disabled={busy || !place.trim()} onClick={findPlace} className="rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Find location</button><button type="button" disabled={busy} onClick={nearMe} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold disabled:opacity-50">Near me</button></div><label className="text-sm font-semibold">Distance<select className={control} value={filters.radius} disabled={!origin} onChange={e=>change('radius',e.target.value)}><option value="">Any distance</option>{[10,25,50,100,150].map(x=><option key={x} value={x}>Within {x} km</option>)}</select></label></div>{busy && <p role="status" className="mt-2 text-sm">Finding your location…</p>}{locationLabel && <p className="mt-2 text-sm text-slate-600">Distances from {locationLabel} are straight-line distances.</p>}{locationError && <p role="alert" className="mt-2 text-sm text-red-700">{locationError}</p>}</details>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><label className="text-sm font-semibold">Sort by<select className={control} value={sort} onChange={e=>{setSort(e.target.value);setVisibleCount(24)}}><option value="name">Course name</option><option value="price">Lowest price band first</option>{origin && <option value="distance">Nearest first</option>}</select></label><div className="flex flex-wrap gap-2"><button type="button" onClick={clear} className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold">Clear filters</button><div role="group" aria-label="Results view" className="flex rounded-full border border-emerald-800 p-1">{(['list','map'] as const).map(option=><button key={option} type="button" aria-pressed={view===option} onClick={()=>setView(option)} className={`rounded-full px-5 py-2 text-sm font-semibold ${view===option?'bg-emerald-800 text-white':'text-emerald-800'}`}>{option==='list'?'List':'Map'}</button>)}</div></div></div>
      <p role="status" aria-live="polite" className="mt-4 text-sm text-slate-600">Showing <strong>{filtered.length}</strong> of {courses.length} golf courses in {countyName}.</p>
    </div>
    {filtered.length===0 ? <div className="rounded-3xl bg-white p-6 text-center">No courses match these filters. Try clearing a filter.</div> : view==='map' ? <CountyCourseMap courses={filtered} source={source} initialCenter={initialCenter}/> : <><div className="grid gap-4 lg:grid-cols-2">{filtered.slice(0,visibleCount).map(c=><CourseCard key={c.id} id={c.id} country={c.country||'Ireland'} course_name={c.course_name} town={c.town||''} region={c.region||''} holes={c.holes??undefined} independent_guest_days={c.independent_guest_days??undefined} season={c.season??undefined} price_range={c.price_range??undefined} course_type={c.course_type??undefined} course_image={c.course_image??undefined} latitude={c.latitude??undefined} longitude={c.longitude??undefined} max_handicap={c.max_handicap??undefined} distance={origin && Number.isFinite(distanceKm(c,origin)) ? distanceKm(c,origin) : undefined} searchParams={{country:'ireland',source,returnTo:`/${source}`}} />)}</div>{visibleCount<filtered.length && <button type="button" onClick={()=>setVisibleCount(n=>n+24)} className="mx-auto mt-5 block rounded-full bg-emerald-800 px-6 py-3 font-semibold text-white">Show more courses ({Math.min(24,filtered.length-visibleCount)})</button>}</>}
  </div>
}
