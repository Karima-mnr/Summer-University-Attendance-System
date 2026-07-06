'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cairo } from 'next/font/google';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import LoginModal from '@/app/dashboard/components/LoginModal';
import { useAuthStore } from '@/app/lib/store/auth.store';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const LANGUAGES = [
  { code: 'ar', label: 'عربي', dir: 'rtl' },
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'en', label: 'EN', dir: 'ltr' },
];

const CONTENT = {
  ar: {
    eyebrow: 'نظام الحضور الرقمي',
    republic: 'الجمهورية الجزائرية الديمقراطية الشعبية',
    ministry: 'وزارة التعليم العالي والبحث العلمي',
    university: 'جامعة حسيبة بن بوعلي الشلف',
    supervision: 'تحت إشراف مديرية الحياة الطلابية',
    residence: 'المدينة الجامعية بالشلف',
    edition: 'تنظم الطبعة السادسة',
    titleLine1: 'الجامعة الصيفية',
    titleLine2: 'للنوادي العلمية',
    login: 'تسجيل الدخول',
    footer: 'منصة الحضور الرقمية © الجامعة الصيفية للنوادي العلمية — مديرية الحياة الطلابية، الشلف',
  },
  fr: {
    eyebrow: "Système numérique de présence",
    republic: 'République Algérienne Démocratique et Populaire',
    ministry: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
    university: 'Université Hassiba Benbouali de Chlef',
    supervision: 'Sous la supervision de la Direction de la Vie Étudiante',
    residence: 'Cité Universitaire de Chlef',
    edition: 'Organise la 6ème édition',
    titleLine1: "L'Université d'Été",
    titleLine2: 'des Clubs Scientifiques',
    login: 'Connexion',
    footer: "Plateforme numérique de présence © Université d'Été des Clubs Scientifiques — Direction de la Vie Étudiante, Chlef",
  },
  en: {
    eyebrow: 'Digital Attendance System',
    republic: "People's Democratic Republic of Algeria",
    ministry: 'Ministry of Higher Education and Scientific Research',
    university: 'Hassiba Benbouali University of Chlef',
    supervision: 'Under the Supervision of the Student Life Directorate',
    residence: 'Chlef University Residence',
    edition: 'Organizes the 6th Edition',
    titleLine1: 'Summer University',
    titleLine2: 'of Scientific Clubs',
    login: 'Login',
    footer: 'Digital attendance platform © Summer University of Scientific Clubs — Student Life Directorate, Chlef',
  },
};

function LanguageSwitcher({ lang, setLang }: { lang: string; setLang: (code: string) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/70 p-1 shadow-sm backdrop-blur-sm">
      <Globe size={14} className="mx-1.5 text-[#142016]/40" />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          aria-label={`Switch language to ${l.label}`}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            lang === l.code
              ? 'bg-[#0B6B3A] text-white shadow-sm'
              : 'text-[#142016]/55 hover:text-[#142016]'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function DecorativeBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="motion-safe:animate-[float_9s_ease-in-out_infinite] absolute -top-1/3 -left-1/4 h-[140%] w-[70%] rotate-[18deg] bg-gradient-to-br from-[#F2891D]/85 via-[#F2891D]/35 to-transparent [clip-path:polygon(0_0,55%_0,28%_100%,0%_100%)]" />
      <div className="motion-safe:animate-[float_11s_ease-in-out_infinite_reverse] absolute -top-1/4 -right-1/4 h-[130%] w-[60%] -rotate-[14deg] bg-gradient-to-bl from-[#0B6B3A]/80 via-[#0B6B3A]/30 to-transparent [clip-path:polygon(45%_0,100%_0,100%_100%,70%_100%)]" />
      <div className="absolute left-1/2 top-0 h-full w-[5%] -translate-x-1/2 rotate-[9deg] bg-[#CE1126]/10" />
      <div className="absolute inset-x-0 bottom-0 h-44 opacity-[0.07] [background-image:radial-gradient(circle,#142016_1px,transparent_1.5px)] [background-size:16px_16px]" />
      <svg className="absolute bottom-4 left-4 h-16 w-16 opacity-[0.18] sm:left-8" viewBox="0 0 64 64" fill="none" stroke="#0B6B3A" strokeWidth="1.4">
        <path d="M16 60 C16 40 20 28 18 8" strokeLinecap="round" />
        <path d="M16 60 C16 40 12 28 14 8" strokeLinecap="round" />
        <ellipse cx="17.5" cy="14" rx="3" ry="6" transform="rotate(-12 17.5 14)" />
        <ellipse cx="13" cy="22" rx="2.6" ry="5.4" transform="rotate(-18 13 22)" />
        <ellipse cx="22" cy="22" rx="2.6" ry="5.4" transform="rotate(14 22 22)" />
      </svg>
      <svg className="absolute bottom-4 right-4 h-16 w-16 opacity-[0.18] sm:right-8" viewBox="0 0 64 64" fill="none" stroke="#CE1126" strokeWidth="1.4">
        <path d="M48 60 C48 40 52 28 50 8" strokeLinecap="round" />
        <path d="M48 60 C48 40 44 28 46 8" strokeLinecap="round" />
        <ellipse cx="49.5" cy="14" rx="3" ry="6" transform="rotate(-12 49.5 14)" />
        <ellipse cx="45" cy="22" rx="2.6" ry="5.4" transform="rotate(-18 45 22)" />
        <ellipse cx="54" cy="22" rx="2.6" ry="5.4" transform="rotate(14 54 22)" />
      </svg>
      <div className="absolute inset-0 [background:radial-gradient(60%_55%_at_50%_38%,rgba(252,250,244,0.94)_0%,rgba(252,250,244,0.6)_55%,transparent_82%)]" />
    </div>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState('ar');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  const t = CONTENT[lang as keyof typeof CONTENT];
  const dir = LANGUAGES.find((l) => l.code === lang)?.dir || 'rtl';

  const handleLoginSuccess = () => {
    login();
    setIsLoginModalOpen(false);
    router.push('/dashboard');
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <main
      dir={dir}
      className={`${cairo.className} relative h-screen overflow-hidden bg-[#FCFAF4] text-[#142016] flex flex-col`}
    >
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(14px) rotate(var(--r, 0deg)); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <DecorativeBackground />

      <section className="relative z-10 flex-1 flex flex-col">
        <div className="absolute left-4 top-2 flex h-14 w-14 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_4px_18px_-6px_rgba(20,32,22,0.4)] ring-4 ring-white sm:left-8 sm:top-4 sm:h-20 sm:w-20">
          <img src="/UHBC.png" alt="University services logo" className="h-full w-full rounded-full object-contain" />
        </div>
        <div className="absolute right-4 top-2 flex h-14 w-14 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_4px_18px_-6px_rgba(20,32,22,0.4)] ring-4 ring-white sm:right-8 sm:top-4 sm:h-20 sm:w-20">
          <img src="/Chlef.jfif" alt="Hassiba Benbouali University of Chlef logo" className="h-full w-full rounded-full object-contain" />
        </div>

        <header className="flex justify-center pt-5">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </header>

        <div className="motion-safe:animate-[fadeInUp_0.8s_ease-out] flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B6B3A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B6B3A] sm:text-[11px]">
            <Sparkles size={12} />
            {t.eyebrow}
          </span>

          <div className="mt-6 space-y-1 text-[12.5px] leading-relaxed text-[#142016]/70 sm:text-sm">
            <p>{t.republic}</p>
            <p>{t.ministry}</p>
            <p className="font-semibold text-[#142016]">{t.university}</p>
          </div>

          <div className="my-6 h-px w-16 bg-[#142016]/15" />

          <div className="space-y-1 text-sm text-[#142016]/80 sm:text-base">
            <p>{t.supervision}</p>
            <p className="font-medium">{t.residence}</p>
          </div>

          <div className="mt-8 inline-flex items-center gap-3">
            <span className="h-2 w-8 rounded-full bg-gradient-to-r from-[#CE1126] via-white to-[#0B6B3A] ring-1 ring-black/5" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#142016]/70 sm:text-sm">
              {t.edition}
            </span>
            <span className="h-2 w-8 rounded-full bg-gradient-to-r from-[#0B6B3A] via-white to-[#CE1126] ring-1 ring-black/5" />
          </div>

          <h1 className="mt-6 font-black leading-[1.05] tracking-tight">
            <span className="block text-[clamp(2.2rem,7vw,4.3rem)] text-[#0B6B3A]">{t.titleLine1}</span>
            <span className="block text-[clamp(2.2rem,7vw,4.3rem)] text-[#CE1126]">{t.titleLine2}</span>
          </h1>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#142016] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(20,32,22,0.5)] transition hover:bg-[#0B6B3A] sm:text-base"
          >
            {t.login}
            <ArrowRight
              size={18}
              className={`transition-transform ${
                dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-black/5 bg-white/60 px-6 py-5 text-center text-[10.5px] text-[#142016]/50 backdrop-blur-sm sm:text-xs">
        {t.footer}
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </main>
  );
}