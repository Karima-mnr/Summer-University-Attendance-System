import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db/mongoose';
import Participant from '@/app/lib/db/models/Participant';

export async function POST(request: Request) {
  try {
    console.log(' Validate API called');
    
    await connectToDatabase();
    console.log(' Database connected');
    
    let body;
    try {
      body = await request.json();
      console.log(' Request body:', body);
    } catch (error) {
      console.error(' Failed to parse JSON:', error);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { id } = body;

    if (!id) {
      console.log(' No ID provided');
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    console.log(` Looking for participant with ID: ${id}`);

    const participant = await Participant.findById(id);
    
    if (!participant) {
      console.log(' Participant not found');
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    console.log(` Found participant: ${participant.fullName}, Status: ${participant.status}`);

    if (participant.status === 'Present') {
      console.log(' Participant already present');
      return NextResponse.json(
        { error: 'Participant is already present' },
        { status: 400 }
      );
    }

    participant.status = 'Present';
    participant.attendanceTime = new Date();
    await participant.save();

    console.log(` Updated participant: ${participant.fullName}, New Status: ${participant.status}`);

    return NextResponse.json({
      success: true,
      message: 'Attendance validated successfully',
      participant: {
        _id: participant._id,
        fullName: participant.fullName,
        status: participant.status,
        attendanceTime: participant.attendanceTime
      }
    });
  } catch (error) {
    console.error(' Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate attendance', details: String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Allow': 'POST, OPTIONS',
        'Content-Type': 'application/json',
      },
    }
  );
}