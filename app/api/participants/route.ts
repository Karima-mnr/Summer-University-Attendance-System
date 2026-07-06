import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db/mongoose';
import Participant from '@/app/lib/db/models/Participant';

export async function GET() {
  try {
    await connectToDatabase();
    const participants = await Participant.find().sort({ createdAt: -1 });
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const participant = new Participant(body);
    await participant.save();
    
    return NextResponse.json(participant, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Matricule already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create participant' },
      { status: 500 }
    );
  }
}