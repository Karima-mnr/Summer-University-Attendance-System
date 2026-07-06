'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { Sidebar } from './components/Sidebar';
import { LANGUAGES } from '@/app/lib/constants';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState(searchParams?.get('lang') || 'en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const urlLang = searchParams?.get('lang') || 'en';
    if (urlLang !== lang) {
      setLang(urlLang);
    }
  }, [searchParams, lang]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!isAuthenticated) {
    return null;
  }

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr';

  return (
    <div dir={dir} className="min-h-screen bg-[#f4f6f9]">
      <Sidebar 
        lang={lang}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      
      <div 
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]",
          "ml-0"
        )}
      >
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e8ecf1] bg-white/80 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B6B3A] to-[#1a8a4a] text-sm font-bold text-white shadow-lg shadow-[#0B6B3A]/30">
              S
            </div>
            <span className="text-base font-extrabold text-[#1a202c]">
              Summer<span className="text-[#0B6B3A]">Uni</span>
            </span>
          </div>
          <button
            className="rounded-xl p-2 transition-colors hover:bg-[#f7fafc]"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={20} className="text-[#4a5568]" />
          </button>
        </div>

        <main className="p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}