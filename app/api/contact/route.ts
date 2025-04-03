import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.json();
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FORMSPREE_URL}${process.env.FORMSPREE_FORM_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    );

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Submission failed' },
      { status: 500 }
    );
  }
}