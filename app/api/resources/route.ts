import { NextResponse } from 'next/server'
import { fallbackResources } from '@/app/resources/data'

// Fixed F-Droid API error by removing problematic external API calls
export async function GET() {
  try {
    // Return only curated fallback resources to avoid 403 errors
    // This ensures stable operation without external API dependencies
    return NextResponse.json(fallbackResources, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(fallbackResources, {
      headers: {
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes on error
      }
    })
  }
}