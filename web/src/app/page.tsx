'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CloudSun, 
  Search, 
  Mic, 
  MapPin, 
  Thermometer, 
  Sprout, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Waves,
  ScanLine
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { staggerContainer, staggerItem, urgentShake, slideInRight } from '@/lib/animations';

export default function Dashboard() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-12 py-6 max-w-4xl mx-auto"
    >
      {/* 1. Header & Greeting */}
      <motion.section variants={staggerItem} className="space-y-2">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h1 className="text-display-large font-serif font-medium text-brown tracking-tight leading-tight">
              Good morning,<br /> Rajesh
            </h1>
            <div className="flex items-center gap-3 text-brown-muted font-medium">
              <MapPin size={18} className="text-primary" />
              <span>Nashik, Vineyard B-12</span>
            </div>
          </motion.div>
          
          <div className="hidden sm:block">
            <div className="bg-primary-50 px-6 py-4 rounded-[28px] border border-primary/10 flex items-center gap-4 shadow-sm">
               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Sprout size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest leading-none mb-1">Crop Stage</p>
                  <p className="font-bold text-brown leading-none">Flowering</p>
               </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. AI Intelligence Bar (Central Hub) */}
      <section className="sticky top-6 z-40">
        <Link href="/ai">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-clay rounded-pill blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center gap-4 bg-card border border-card rounded-pill p-2 shadow-lift transition-all focus-within:ring-4 focus-within:ring-primary-50 focus-within:bg-sand">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="bg-primary text-white p-4 rounded-full flex items-center justify-center shadow-premium"
              >
                <Sparkles size={24} />
              </motion.div>
              <span className="flex-1 text-brown-muted font-medium text-xl h-12 flex items-center">
                Ask Kisan AI about your vineyard...
              </span>
              <div className="flex items-center gap-2 pr-2">
                <div className="p-3 text-brown-muted group-hover:text-brown transition-colors">
                  <ScanLine size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* 3. Heatwave Alert (Critical Context) */}
      <motion.section 
        variants={slideInRight}
      >
        <Card className="bg-gradient-to-r from-clay-tint to-sand border-l-8 border-clay p-8 rounded-[32px] shadow-lift relative overflow-hidden group">
          <motion.div 
            variants={urgentShake}
            animate="animate"
            className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"
          >
            <AlertTriangle size={120} />
          </motion.div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-2 bg-clay text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                 <Thermometer size={14} /> Critical Alert
              </div>
              <h2 className="text-2xl font-serif font-medium text-brown leading-tight">Heatwave expected in 48 hours</h2>
              <p className="text-lg text-brown-muted font-medium leading-relaxed">Temperatures may reach 42°C. Increase irrigation by 20% starting tomorrow evening.</p>
            </div>
            <Link href="/activity">
              <Button className="bg-brown text-sand hover:bg-black rounded-pill px-8 py-6 h-auto font-bold text-lg shadow-lift transition-all">
                Update Schedule
              </Button>
            </Link>
          </div>
        </Card>
      </motion.section>

      {/* 4. Insights & Performance Grid */}
      <motion.section variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Farm Performance Graph Preview */}
        <Card className="p-8 bg-card border-brown-muted/10 shadow-premium rounded-[32px] space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brown flex items-center gap-2">
                 <BarChart3 size={20} className="text-primary" />
                 Growth Metrics
              </h3>
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary-50 px-2 py-1 rounded-lg">+12.4%</span>
           </div>
           
           <div className="h-32 flex items-end gap-1.5 pt-4">
              {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className={cn(
                    "flex-1 rounded-t-lg transition-colors",
                    i === 5 ? "bg-primary shadow-premium" : "bg-primary/20 hover:bg-primary/30"
                  )}
                />
              ))}
           </div>
           <p className="text-sm text-brown-muted font-medium">Yield index is higher than previous season's average.</p>
        </Card>

        {/* Soil Health Summary */}
        <Card className="p-8 bg-card border-brown-muted/10 shadow-premium rounded-[32px] space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brown flex items-center gap-2">
                 <Waves size={20} className="text-primary" />
                 Leaf Saturation
              </h3>
              <span className="text-xs font-bold text-brown-muted uppercase tracking-widest">Optimal</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-8 border-primary/10 border-t-primary flex items-center justify-center relative shadow-inner">
                 <span className="font-black text-brown text-xl">84%</span>
              </div>
              <div className="space-y-1">
                 <p className="font-bold text-brown">Nitrogen Levels</p>
                 <p className="text-xs text-brown-muted font-medium mt-1">Analysis complete • 10m ago</p>
              </div>
           </div>
           <Button variant="ghost" className="w-full text-primary hover:bg-primary-50 rounded-pill font-bold gap-2">
              Run Field Diagnostic <ArrowRight size={18} />
           </Button>
        </Card>
      </motion.section>

      {/* 5. Intelligence Feed */}
      <motion.section variants={staggerItem} className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-caption font-bold text-brown-muted uppercase tracking-widest">Recommended Actions</h2>
          <Link href="/activity" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>
        
        <div className="space-y-4">
          {[
            { title: 'Fertilizer Application', desc: 'Apply NPK 19-19-19 for flowering stage.', type: 'advisory', icon: Sprout },
            { title: 'Market Trend Alert', desc: 'Grapes prices rising in Mumbai market.', type: 'market', icon: TrendingUp },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <button className="w-full flex items-center justify-between p-6 bg-card border border-brown-muted/10 rounded-[28px] hover:bg-sand transition-all group shadow-sm hover:shadow-premium">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-sand rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500 shadow-inner">
                    <item.icon size={28} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-brown leading-tight mb-1">{item.title}</h4>
                    <p className="text-brown-muted font-medium">{item.desc}</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center text-brown-muted group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <ArrowRight size={20} />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="pb-32 lg:pb-0" />
    </motion.div>
  );
}
