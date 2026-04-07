'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

type Course = {
  id: number
  course_name: string
  latitude: number
  longitude: number
  town: string
  region: string
}

type Props = {
  courses: Course[]
}

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function MapBounds({ courses }: Props) {
  const map = useMap()

  useEffect(() => {
    if (!courses.length) return

    const bounds = L.latLngBounds(
      courses.map((course) => [course.latitude, course.longitude])
    )

    map.fitBounds(bounds, { padding: [50, 50] })
  }, [courses, map])

  return null
}

export default function CourseMap({ courses }: Props) {

  const defaultCenter: [number, number] = [46.8, 8.3]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={8}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapBounds courses={courses} />

      {courses.map((course) => (
        <Marker
          key={course.id}
          position={[course.latitude, course.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <strong>{course.course_name}</strong>
            <br />
            {course.town}, {course.region}
            <br />
            <a href={`/courses/${course.id}`}>
              View Course
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}