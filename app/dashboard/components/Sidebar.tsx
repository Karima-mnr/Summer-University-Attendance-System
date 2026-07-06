'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  User, 
  LogOut, 
  Globe, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { DASHBOARD_CONTENT, LANGUAGES } from '@/app/lib/constants';
import { cn } from '@/app/lib/utils';

interface SidebarProps {
  lang: string;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ 
  lang, 
  collapsed, 
  onToggle,
  mobileOpen = false, 
  onMobileClose 
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  const navigation = [
    { name: t.dashboard, href: `/dashboard?lang=${lang}`, icon: LayoutDashboard },
    { name: t.boys, href: `/dashboard/boys?lang=${lang}`, icon: Users },
    { name: t.girls, href: `/dashboard/girls?lang=${lang}`, icon: User },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const switchLanguage = (code: string) => {
    const currentPath = pathname || '/dashboard';
    router.push(`${currentPath}?lang=${code}`);
    if (onMobileClose) onMobileClose();
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      <aside 
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-[#e8ecf1] bg-white shadow-xl shadow-slate-200/50 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[240px]",
          "max-lg:-translate-x-full",
          mobileOpen && "max-lg:translate-x-0",
          mobileOpen && "w-[280px]"
        )}
      >
        <div className={cn(
          "flex min-h-[72px] items-center border-b border-[#e8ecf1] transition-all duration-300",
          collapsed ? "justify-center px-3" : "justify-between px-5"
        )}>
          <div className={cn(
            "flex items-center gap-3 overflow-hidden",
            collapsed ? "justify-center" : ""
          )}>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm overflow-hidden">
              <img
                src="/UHBC.png"
                alt="Summer University Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className={cn(
              "text-lg font-extrabold text-[#1a202c] whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              Summer<span className="text-[#0B6B3A]">Univ</span>
            </span>
          </div>
          <div className={cn(
            "w-8",
            collapsed ? "hidden" : "block"
          )} />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigation.map((item) => {
            const isActive = pathname === item.href.split('?')[0];
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center px-2" : "",
                  isActive
                    ? "bg-[#d1fae5] text-[#0B6B3A] shadow-sm"
                    : "text-[#4a5568] hover:bg-[#f7fafc] hover:text-[#1a202c]"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-[#e8ecf1] px-3 py-4">
          <div className={cn(
            "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#4a5568]",
            collapsed ? "justify-center px-2" : ""
          )}>
            <Globe className="h-[18px] w-[18px] flex-shrink-0" />
            <div className={cn(
              "flex gap-1.5 transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              {LANGUAGES.map((l) => (
                <span
                  key={l.code}
                  onClick={() => switchLanguage(l.code)}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-0.5 text-xs font-medium transition-all",
                    lang === l.code
                      ? "bg-[#0B6B3A] text-white"
                      : "hover:bg-[#f0f2f5]"
                  )}
                >
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#CE1126] transition-all duration-200 hover:bg-[#fde8ea]",
              collapsed ? "justify-center px-2" : ""
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span className={cn(
              "whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <button
        onClick={onToggle}
        className={cn(
          "fixed top-6 z-50 hidden h-8 w-8 items-center justify-center rounded-full border border-[#e8ecf1] bg-white text-[#4a5568] shadow-lg shadow-slate-200/50 transition-all duration-300 hover:bg-[#f7fafc] hover:shadow-xl lg:flex",
          collapsed ? "left-[76px]" : "left-[244px]"
        )}
        style={{ transform: 'translateX(-50%)' }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {mobileOpen && (
        <div 
          className="fixed inset-0 -z-10 bg-black/30 lg:hidden"
          onClick={() => onMobileClose?.()}
        />
      )}
    </>
  );
}