import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

const siteUrl = 'https://guestplaygolf.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'GuestPlayGolf | Find golf courses you can play',
  description:
    'Find golf courses where independent guests can play. Discover guest access, handicap requirements, pricing and where you can play today.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'GuestPlayGolf | Find golf courses you can play',
    description:
      'Find golf courses where independent guests can play. Discover guest access, handicap requirements, pricing and where you can play today.',
    url: siteUrl,
    siteName: 'GuestPlayGolf',
    type: 'website',
  },
}

export default function HomePage() {
  return <HomePageClient />
}