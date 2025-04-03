import {  NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string; jobId: string }> }
) {
  const { country, jobId } = await params;
  
  
  try {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    
    if (!appId || !appKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/get/${jobId}?app_id=${appId}&app_key=${appKey}`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600'
        }
      });
    }

    const searchUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=1&what_or=${jobId}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results?.length > 0) {
      return NextResponse.json(searchData.results[0], {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600'
        }
      });
    }

    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );

  }
}