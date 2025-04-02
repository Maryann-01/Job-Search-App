import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { country: string; jobId: string } }
) {
  const { country, jobId } = params;
  
  console.log(`API Route Handler: Fetching job ${jobId} from ${country}`);
  
  try {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/get/${jobId}?app_id=${appId}&app_key=${appKey}`;
    
    console.log(`Calling Adzuna API: ${url}`);
    
    const response = await fetch(url);
    
    console.log(`Adzuna API response status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    console.log("Direct job fetch failed, trying search by ID");
    const searchUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=1&what_or=${jobId}`;
    
    console.log(`Trying search by ID: ${searchUrl}`);
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    if (searchData.results && searchData.results.length > 0) {
      console.log("Found job via search endpoint");
      return NextResponse.json(searchData.results[0]);
    }
    console.log("Both job fetch methods failed");
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}