'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertCircle, CheckCircle, Lock, ArrowRight, Fingerprint, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Welcome! Redirecting to dashboard...', {
          icon: <CheckCircle className="text-emerald-500" size={20} />,
          style: {
            background: '#0B6B3A',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
          },
        });
        onSuccess();
      } else {
        setError('Invalid access code. Please try again.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        toast.error('Invalid access code. Please try again.', {
          icon: <AlertCircle className="text-red-500" size={20} />,
          style: {
            background: '#CE1126',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
          },
        });
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [isOpen]);

  const fullCode = code.join('');
  const isComplete = fullCode.length === 6;

  // Get the display value for each input (show ● when filled)
  const getDisplayValue = (digit: string) => {
    return digit ? '●' : '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-blur-md bg-transparent"
            onClick={onClose}
          />

          {/* Floating Particles */}
          <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/20"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [null, -200, null],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 12,
                  repeat: Infinity,
                  delay: Math.random() * 6,
                }}
              />
            ))}
          </div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 350,
                duration: 0.5,
              }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B6B3A]/5 via-transparent to-[#CE1126]/5" />

              {/* Animated Gradient Bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B6B3A] via-[#F2891D] to-[#CE1126]"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ backgroundSize: '200% 100%' }}
              />

              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </motion.button>

              <div className="relative p-8 pt-10">
                {/* Premium Icon */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b6ecd0] to-[#adf0ca] blur-2xl opacity-20 animate-pulse" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ccf1de] to-[#c7f0d9] shadow-lg shadow-[#0B6B3A]/10">
                      <Shield size={36} className="text-green-900" />
                      <motion.div
                        className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow-md"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Lock size={12} className="text-[#0B6B3A]" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Access Dashboard</h2>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#0B6B3A]" />
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Secure Entry
                    </span>
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#0B6B3A]" />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Enter the 6-digit code provided by the organizer
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-slate-700">
                        Verification Code
                      </label>
                      <span className="text-xs font-medium text-slate-400">
                        {fullCode.length}/6 digits
                      </span>
                    </div>

                    {/* 6 Individual Input Fields - Left to Right */}
                    <motion.div
                      animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center gap-2.5"
                      dir="ltr"
                    >
                      {code.map((digit, index) => (
                        <motion.div
                          key={index}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <input
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={getDisplayValue(digit)}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className={`w-12 h-14 text-center text-2xl font-bold rounded-2xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
                              error
                                ? 'border-red-300 bg-red-50/50 focus:ring-red-200'
                                : digit
                                ? 'border-[#0B6B3A] bg-[#0B6B3A]/5 focus:ring-[#0B6B3A]/20'
                                : 'border-slate-200 bg-white/80 focus:border-[#0B6B3A] focus:ring-[#0B6B3A]/20 hover:border-slate-300'
                            }`}
                            autoFocus={index === 0}
                            style={{ direction: 'ltr' }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-red-600"
                        >
                          <AlertCircle size={15} />
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Progress Indicator */}
                    <div className="mt-4 flex justify-center gap-1.5">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            width: i < fullCode.length ? 24 : 8,
                            backgroundColor:
                              i < fullCode.length
                                ? '#0B6B3A'
                                : error
                                ? '#fca5a5'
                                : '#e2e8f0',
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i < fullCode.length
                              ? 'bg-[#0B6B3A]'
                              : error
                              ? 'bg-red-300'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-2xl border-2 border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || !isComplete}
                      className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B6B3A] to-[#1a8a4a] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0B6B3A]/30 transition-all hover:shadow-xl hover:shadow-[#0B6B3A]/40 disabled:opacity-50 disabled:hover:shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div
                            className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          {isComplete ? 'Verify Access' : 'Enter Code'}
                          <ArrowRight
                            size={18}
                            className={`transition-transform group-hover:translate-x-1 ${
                              !isComplete && 'opacity-50'
                            }`}
                          />
                        </span>
                      )}
                    </motion.button>
                  </div>
                </form>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-400">Secure</span>
                  </div>
                  <span className="text-xs text-slate-300">•</span>
                  <div className="flex items-center gap-2">
                    <Fingerprint size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-400">256-bit encrypted</span>
                  </div>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400">v2.0</span>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs text-slate-300">Paste your code to auto-fill</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
