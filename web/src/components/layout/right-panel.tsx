'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  TrendingUp, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function RightPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-[340px] h-screen sticky top-0 p-6 space-y-8 overflow-y-auto scrollbar-hide border-l border-brown-muted/10">
      {/* Weather Forecast Widget */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-brown-muted uppercase tracking-widest flex items-center justify-between px-2">
          Weekly Forecast
          <CloudSun size={14} />
        </h3>
        <Card className="bg-sky border-0 shadow-premium p-5 rounded-[28px] overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-20">
             <CloudSun size={80} />
           </div>
           <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
               <span className="text-4xl font-bold text-brown">32°</span>
               <div>
                  <p className="font-bold text-brown">Sunny</p>
                  <p className="text-xs text-brown-muted">Feels like 35°</p>
               </div>
             </div>
             
             <div className="grid grid-cols-4 gap-2 pt-2">
               {['Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                 <div key={day} className="flex flex-col items-center p-2 rounded-2xl bg-white/50 backdrop-blur-sm">
                   <span className="text-[10px] font-bold text-brown-muted uppercase">{day}</span>
                   <CloudSun size={16} className="my-1.5 text-primary" />
                   <span className="text-xs font-bold text-brown">{30 + i}°</span>
                 </div>
               ))}
             </div>
           </div>
        </Card>
      </section>

      {/* Farm Health Stats */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-brown-muted uppercase tracking-widest flex items-center justify-between px-2">
          Farm Vitality
          <Activity size={14} />
        </h3>
        <Card className="bg-card border-brown-muted/10 shadow-premium p-5 rounded-[28px] space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
               <div className="flex items-center gap-2 text-brown font-medium">
                 <Droplets size={16} className="text-blue-500" />
                 Soil Moisture
               </div>
               <span className="font-bold text-brown">68%</span>
            </div>
            <div className="h-2 w-full bg-sand rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: '68%' }} 
                 className="h-full bg-blue-500" 
               />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
               <div className="flex items-center gap-2 text-brown font-medium">
                 <Wind size={16} className="text-teal-500" />
                 Air Quality
               </div>
               <span className="text-primary font-bold">Good</span>
            </div>
            <div className="h-2 w-full bg-sand rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: '92%' }} 
                 className="h-full bg-teal-500" 
               />
            </div>
          </div>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-brown-muted uppercase tracking-widest px-2">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center justify-center p-4 bg-primary text-white rounded-[24px] shadow-premium hover:bg-primary-hover transition-all group">
             <Plus size={24} className="mb-2" />
             <span className="text-[11px] font-bold uppercase tracking-tight">New Scan</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-sand text-brown border border-brown-muted/10 rounded-[24px] hover:bg-card transition-all">
             <TrendingUp size={24} className="mb-2 text-primary" />
             <span className="text-[11px] font-bold uppercase tracking-tight">Analytics</span>
          </button>
        </div>
      </section>

      {/* Trust Badge */}
      <div className="mt-auto p-6 bg-primary-50 rounded-[32px] border border-primary/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
           <ShieldCheck size={28} />
        </div>
        <div>
           <p className="text-sm font-bold text-brown italic font-serif">Verified Partner</p>
           <p className="text-[10px] text-brown-muted uppercase tracking-widest">KisanMitr AI Core</p>
        </div>
      </div>
    </aside>
  );
}
