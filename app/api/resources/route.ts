import { NextResponse } from 'next/server';
import { fetchAllResources } from '@/app/resources/fetchData';
import { fallbackResources } from '@/app/resources/data';

export async function GET() {
  try {
    // First try to get fresh resources
    const freshResources = await fetchAllResources();
    
    if (freshResources.length >= 600) {
      return NextResponse.json(freshResources, {
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }
    
    // If we don't have enough fresh resources, combine with fallback
    const combinedResources = [...freshResources];
    
    // Add fallback resources that aren't already in fresh resources
    fallbackResources.forEach(fallbackResource => {
      if (!combinedResources.some(r => r.id === fallbackResource.id)) {
        combinedResources.push(fallbackResource);
      }
    });

    return NextResponse.json(combinedResources, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(fallbackResources, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }
}
