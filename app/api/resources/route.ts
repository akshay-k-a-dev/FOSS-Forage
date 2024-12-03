import { NextResponse } from 'next/server';
import { fetchAllResources } from '@/app/resources/fetchData';
import { fallbackResources } from '@/app/resources/data';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    // Use fallback data in production build
    return NextResponse.json(fallbackResources);
  }

  try {
    const resources = await fetchAllResources();
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(fallbackResources);
  }
}
