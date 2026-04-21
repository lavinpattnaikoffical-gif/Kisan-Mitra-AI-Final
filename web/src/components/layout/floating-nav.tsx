'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBasket, MessageSquare, Activity, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: ShoppingBasket, label: 'Marketplace', href: '/market' },
  { icon: Activity, label: 'My Farm', href: '/activity' },
  { icon: MessageSquare, label: 'Kisan AI', href: '/ai', isAi: true },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 hidden md:block">
      <div className="mx-auto max-w-4xl rounded-pill bg-sand shadow-premium px-8 py-3 flex items-center justify-between border border-card/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-serif italic">K</div>
          <span className="font-bold text-brown font-serif text-lg tracking-tight">KisanMitr</span>
        </div>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors relative py-2 px-4 rounded-pill",
                  isActive ? "text-primary bg-primary-50" : "text-brown-muted hover:text-brown",
                  item.isAi ? "bg-primary-50 text-primary hover:bg-primary-hover hover:text-white transition-colors" : ""
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-brown-muted hover:text-brown transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-card border border-brown-muted/20 flex items-center justify-center text-brown">
            <User size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
