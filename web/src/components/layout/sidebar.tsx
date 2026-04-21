'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  ShoppingBasket, 
  MessageSquare, 
  Activity, 
  Settings, 
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: ShoppingBasket, label: 'Marketplace', href: '/market' },
  { icon: Activity, label: 'My Farm', href: '/activity' },
  { icon: MessageSquare, label: 'Kisan AI', href: '/ai', isAi: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Simulated logout
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-[260px] h-screen sticky top-0 bg-card border-r border-brown-muted/10 transition-all duration-300">
      {/* Logo */}
      <div className="p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold font-serif italic text-xl shadow-premium shrink-0">K</div>
          <span className="font-bold text-brown font-serif text-2xl tracking-tight hidden lg:block">KisanMitr</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-2xl transition-all group relative",
                isActive ? "text-white" : "text-brown-muted hover:text-brown"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNavDesktop"
                  className="absolute inset-0 bg-primary rounded-2xl shadow-premium z-0"
                  transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                />
              )}
              <Icon size={24} className={cn("relative z-10 shrink-0", !isActive && "group-hover:text-primary")} />
              <span className="relative z-10 font-bold text-base hidden lg:block">{item.label}</span>
              {item.isAi && !isActive && (
                 <div className="relative z-10 ml-auto w-2 h-2 rounded-full bg-primary animate-pulse hidden lg:block" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 mt-auto border-t border-brown-muted/10 space-y-2">
        <Link 
          href="/settings"
          className={cn(
            "flex items-center gap-3 p-3 rounded-2xl text-brown-muted hover:bg-sand hover:text-brown transition-all group",
            pathname === '/settings' && "bg-sand text-brown"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-sand border border-brown-muted/20 flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-bold text-brown truncate">Rajesh Kumar</p>
            <p className="text-xs text-brown-muted">Farmer Profile</p>
          </div>
          <Settings size={18} className="ml-auto hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-clay hover:bg-clay-tint transition-all truncate"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="font-bold text-sm hidden lg:block">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
