import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db/mongoose';
import Participant from '@/app/lib/db/models/Participant';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id } = await params;
    
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    
    const participant = await Participant.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Updated successfully',
      participant 
    });
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const participant = await Participant.findByIdAndDelete(id);
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}