import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db/mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ 
      success: true, 
      message: ' MongoDB connected successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: ' Failed to connect to MongoDB',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}