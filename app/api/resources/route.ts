import { NextResponse } from 'next/server';
import { fetchAllResources } from '@/app/resources/fetchData';
import { fallbackResources } from '@/app/resources/data';

export async function GET() {
  try {
    const resources = await fetchAllResources();
    return NextResponse.json(resources.length > 0 ? resources : fallbackResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(fallbackResources);
  }
}
