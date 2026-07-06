'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { participantSchema, ParticipantFormData } from '@/app/lib/validations/participant.schema';
import { ATTRIBUTE_OPTIONS, AXIS_OPTIONS, DASHBOARD_CONTENT } from '@/app/lib/constants';
import { User, Mail, Phone, Building2, Award, Users as UsersIcon, X, Check, UserPlus, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface ParticipantFormProps {
  gender: 'Boy' | 'Girl';
  lang: string;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: ParticipantFormData & { _id?: string };
}

export function ParticipantForm({
  gender,
  lang,
  onSuccess,
  onCancel,
  initialData,
}: ParticipantFormProps) {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: initialData || {
      gender,
      status: 'Not Present',
    },
  });

  const attributeOptions = ATTRIBUTE_OPTIONS[lang as keyof typeof ATTRIBUTE_OPTIONS] || ATTRIBUTE_OPTIONS.en;
  const axisOptions = AXIS_OPTIONS[lang as keyof typeof AXIS_OPTIONS] || AXIS_OPTIONS.en;

  const onSubmit = async (data: ParticipantFormData) => {
    try {
      const url = initialData?._id
        ? `/api/participants/${initialData._id}`
        : '/api/participants';
      
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          initialData?._id
            ? t.updateSuccess
            : t.addSuccess
        );
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || t.addError);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full Name & University */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            {t.fullName} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder={t.fullName}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-rose-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            {t.universityName} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder={t.universityName}
              {...register('university')}
            />
          </div>
          {errors.university && (
            <p className="text-sm text-rose-500">{errors.university.message}</p>
          )}
        </div>
      </div>

      {/* Matricule & Phone */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            {t.matricule} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder={t.matricule}
              {...register('matricule')}
            />
          </div>
          {errors.matricule && (
            <p className="text-sm text-rose-500">{errors.matricule.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            {t.phoneNumber} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder={t.phoneNumber}
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-rose-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {t.emailAddress} <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder={t.emailAddress}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-rose-500">{errors.email.message}</p>
        )}
      </div>

      {/* Axis & Club */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            {t.competitionAxis} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Award size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              {...register('axis')}
            >
              <option value="">{t.competitionAxis}...</option>
              {axisOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {errors.axis && (
            <p className="text-sm text-rose-500">{errors.axis.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            {t.clubName} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <UsersIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder={t.clubName}
              {...register('clubName')}
            />
          </div>
          {errors.clubName && (
            <p className="text-sm text-rose-500">{errors.clubName.message}</p>
          )}
        </div>
      </div>

      {/* Attribute - Now includes "سائق" (Driver) */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {t.attributeLabel} <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Award size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            {...register('attribute')}
          >
            <option value="">{t.attributeLabel}...</option>
            {attributeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {errors.attribute && (
          <p className="text-sm text-rose-500">{errors.attribute.message}</p>
        )}
      </div>

      {/* Gender Display */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.genderLabel}
            </label>
            <div className="mt-1 flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700">
                <User size={14} />
                {gender === 'Boy' ? t.boy : t.girl}
              </span>
              <span className="text-xs text-slate-400">({t.autoSet})</span>
            </div>
          </div>
          <User size={18} className={gender === 'Boy' ? 'text-emerald-600' : 'text-rose-600'} />
        </div>
      </div>

      <input type="hidden" {...register('status')} value="Not Present" />
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-green-100 to-green-100 py-3 text-sm font-semibold text-green-900 shadow-lg shadow-green-300/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {t.saving}
            </>
          ) : initialData?._id ? (
            <>
              <Check size={16} />
              {t.updateParticipant}
            </>
          ) : (
            <>
              <UserPlus size={16} />
              {t.addParticipant}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
        >
          <X size={16} />
          {t.cancel}
        </button>
      </div>
    </form>
  );
}