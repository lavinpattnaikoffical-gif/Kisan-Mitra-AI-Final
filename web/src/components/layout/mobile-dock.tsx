'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBasket, MessageSquare, Activity, Settings, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: ShoppingBasket, label: 'Market', href: '/market' },
  { icon: MessageSquare, label: 'AI', href: '/ai', isAi: true },
  { icon: Camera, label: 'Detect', href: '/detect' },
  { icon: Activity, label: 'Activity', href: '/activity' },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:hidden">
      <div className="mx-auto max-w-md rounded-pill bg-sand shadow-premium px-2 py-2 flex items-center justify-between border border-card/50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isAi) {
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative -top-6 bg-primary p-5 rounded-full text-white isolate animate-breathing"
                >
                  <Icon size={28} strokeWidth={2.5} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href} className="flex-1 relative">
              <div className={cn(
                "flex flex-col items-center justify-center py-1 transition-all duration-300 relative z-10",
                isActive ? "text-primary px-2" : "text-brown-muted hover:text-brown"
              )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNavMobile"
                    className="absolute bottom-0 w-5 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
