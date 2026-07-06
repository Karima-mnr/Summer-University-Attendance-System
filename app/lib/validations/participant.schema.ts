import { z } from 'zod';

export const participantSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  university: z.string().min(2, 'University is required'),
  matricule: z.string().min(3, 'Matricule is required'),
  phone: z.string().min(8, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  axis: z.string().min(2, 'Axis is required'),
  clubName: z.string().min(2, 'Club name is required'),
  attribute: z.string().min(2, 'Attribute is required'),
  gender: z.enum(['Boy', 'Girl']),
  status: z.enum(['Present', 'Not Present']).default('Not Present'),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;