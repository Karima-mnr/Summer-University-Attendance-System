import mongoose, { Schema, Document } from 'mongoose';

export interface IParticipant extends Document {
  fullName: string;
  university: string;
  matricule: string;
  phone: string;
  email: string;
  axis: string;
  clubName: string;
  attribute: string;
  gender: 'Boy' | 'Girl';
  status: 'Present' | 'Not Present';
  attendanceTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    fullName: { type: String, required: true },
    university: { type: String, required: true },
    matricule: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    axis: { type: String, required: true },
    clubName: { type: String, required: true },
    attribute: { type: String, required: true },
    gender: { type: String, enum: ['Boy', 'Girl'], required: true },
    status: { type: String, enum: ['Present', 'Not Present'], default: 'Not Present' },
    attendanceTime: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Participant || mongoose.model<IParticipant>('Participant', ParticipantSchema);