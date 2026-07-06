import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const accessCode = '240602';

    if (code === accessCode) {
      return NextResponse.json({ 
        success: true,
        message: 'Access granted'
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid access code' 
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}