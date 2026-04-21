'use client';

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Languages, 
  ShieldCheck, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Sprout,
  Camera,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

const sections = [
  {
    id: 'profile',
    title: 'Profile Info',
    icon: User,
    fields: [
      { label: 'Full Name', value: 'Rajesh Kumar' },
      { label: 'Phone Number', value: '+91 98765 43210' },
      { label: 'Village', value: 'Nashik, Maharashtra' },
    ]
  },
  {
    id: 'farm',
    title: 'Farm Details',
    icon: Sprout,
    fields: [
      { label: 'Total Area', value: '12 Acres' },
      { label: 'Primary Crop', value: 'Thompson Grapes' },
      { label: 'Soil Type', value: 'Black Cotton' },
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    fields: [
      { label: 'Weather Alerts', toggle: true, active: true },
      { label: 'Market Prices', toggle: true, active: true },
    ]
  },
  {
    id: 'account',
    title: 'Account',
    icon: ShieldCheck,
    fields: [
      { label: 'Payment Methods', value: 'UPI Linked' },
      { label: 'Language', value: 'English (India)' },
    ]
  }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="py-8 space-y-8 max-w-[1240px] mx-auto px-4 pb-32"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-full bg-card hover:bg-sand text-brown border border-brown-muted/10">
              <ChevronLeft size={24} />
            </Button>
          </Link>
          <h1 className="text-display font-serif font-medium text-brown tracking-tight">Settings</h1>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-white rounded-pill px-6 font-bold shadow-premium transition-all">
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Navigation Tabs */}
        <div className="lg:w-64 shrink-0 space-y-2">
          {sections.map((section) => {
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-left relative overflow-hidden group",
                  isActive ? "text-sand" : "text-brown-muted hover:text-brown"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeSettingTab"
                    className="absolute inset-0 bg-brown shadow-premium z-0"
                    transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                  />
                )}
                <section.icon size={20} className="relative z-10" />
                <span className="relative z-10">{section.title}</span>
                {isActive && <ChevronRight size={18} className="ml-auto relative z-10" />}
              </button>
            );
          })}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-clay hover:bg-clay-tint transition-all font-bold text-left mt-8"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>

        {/* CENTER: Form Fields */}
        <div className="flex-1 space-y-6">
          <motion.div variants={staggerItem}>
            <Card className="p-8 bg-card border-brown-muted/10 shadow-premium rounded-[32px] space-y-8">
               <div className="space-y-1 text-left">
                  <h3 className="text-2xl font-serif font-medium text-brown">
                    {sections.find(s => s.id === activeTab)?.title}
                  </h3>
                  <p className="text-brown-muted font-medium">Update your preferences and account information.</p>
               </div>

               <AnimatePresence mode="wait">
                 <motion.div 
                   key={activeTab}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.3, ease: 'easeInOut' }}
                   className="space-y-6"
                 >
                    {(sections.find(s => s.id === activeTab)?.fields as any[])?.map((field: any, i: number) => (
                       <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                             <label className="text-sm font-bold text-brown-muted uppercase tracking-wider">{field.label}</label>
                             {field.toggle && (
                                <motion.button 
                                  whileTap={{ scale: 0.9 }}
                                  className={cn(
                                   "w-12 h-6 rounded-full transition-all relative p-1",
                                   field.active ? "bg-primary" : "bg-brown-muted/20"
                                )}>
                                   <motion.div 
                                      layout
                                      className={cn(
                                      "w-4 h-4 bg-white rounded-full shadow-sm",
                                      field.active ? "ml-6" : "ml-0"
                                   )} />
                                </motion.button>
                             )}
                          </div>
                          {!field.toggle && (
                             <div className="relative group">
                                <input 
                                   defaultValue={field.value}
                                   className="w-full h-14 bg-sand border border-brown-muted/10 rounded-2xl px-6 font-bold text-brown focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary/20 transition-all focus:bg-white"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-0 group-focus-within:opacity-100 transition-opacity">
                                   <Check size={20} />
                                </div>
                             </div>
                          )}
                       </div>
                    ))}
                 </motion.div>
               </AnimatePresence>
            </Card>
          </motion.div>
        </div>

        {/* RIGHT: Profile Preview */}
        <div className="lg:w-80 shrink-0">
          <Card className="bg-sand border-0 shadow-premium rounded-[40px] overflow-hidden sticky top-8">
             <div className="h-32 bg-gradient-to-br from-primary to-primary-hover relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-[32px] bg-card border-4 border-sand shadow-lift flex items-center justify-center text-4xl overflow-hidden">
                         🍇
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brown text-sand rounded-xl shadow-premium flex items-center justify-center hover:bg-primary transition-colors">
                         <Camera size={18} />
                      </button>
                   </div>
                </div>
             </div>
             
             <div className="pt-16 pb-8 px-8 text-center space-y-6">
                <div>
                   <h2 className="text-2xl font-serif font-medium text-brown">Rajesh Kumar</h2>
                   <div className="flex items-center justify-center gap-1.5 text-brown-muted font-medium">
                      <MapPin size={16} />
                      Nashik, MH
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-card rounded-2xl border border-brown-muted/10">
                      <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">Crop</p>
                      <p className="text-sm font-black text-brown">Grapes</p>
                   </div>
                   <div className="p-3 bg-card rounded-2xl border border-brown-muted/10">
                      <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">Type</p>
                      <p className="text-sm font-black text-brown">Organic</p>
                   </div>
                </div>

                <div className="bg-primary-50 rounded-2xl p-4 border border-primary/10 flex items-center justify-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   <span className="text-xs font-bold text-primary uppercase tracking-widest">Verified Farmer</span>
                </div>
             </div>
          </Card>
          
          <p className="text-center text-brown-muted/40 text-xs mt-8">
            KisanMitr AI v1.2.4 • Made with intelligence
          </p>
        </div>
      </div>
    </motion.div>
  );
}
