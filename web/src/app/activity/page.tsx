'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShoppingBag, 
  Sprout, 
  AlertCircle, 
  ChevronRight, 
  Droplets, 
  Thermometer, 
  Wind,
  TrendingUp,
  CloudRain,
  Sun
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const metrics = [
  { label: 'Soil Moisture', value: '42%', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2%' },
  { label: 'Temperature', value: '28°C', icon: Thermometer, color: 'text-orange-600', bg: 'bg-orange-50', trend: '-1°C' },
  { label: 'Humidity', value: '65%', icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50', trend: 'Stable' },
  { label: 'Health Score', value: '94/100', icon: Activity, color: 'text-primary', bg: 'bg-primary-50', trend: 'Optimal' },
];

const activities = [
  { id: 1, type: 'order', title: 'Order Delivered', desc: 'Premium Organic Seeds (5kg)', time: '2 hours ago', icon: ShoppingBag, color: 'text-primary bg-primary-50' },
  { id: 2, type: 'alert', title: 'Watering Alert', desc: 'Tomato Field B requires irrigation', time: '5 hours ago', icon: AlertCircle, color: 'text-clay bg-clay/20' },
  { id: 3, type: 'crop', title: 'Health Update', desc: 'Vineyard health improved by 5%', time: 'Yesterday', icon: Sprout, color: 'text-primary bg-primary-50' },
];

export default function ActivityPage() {
  return (
    <div className="py-8 space-y-10 max-w-[1240px] mx-auto px-4 pb-32">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* MAIN DASHBOARD */}
        <div className="flex-1 space-y-10">
          <header className="space-y-2">
            <h1 className="text-display font-serif font-medium text-brown tracking-tight flex items-center gap-3">
              Farm Live Dashboard
            </h1>
            <p className="text-lg text-brown-muted font-medium">Real-time monitoring for your Vineyard Section B.</p>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {metrics.map((metric, i) => (
              <Card key={i} className="p-4 sm:p-6 bg-card border-brown-muted/10 shadow-premium hover:shadow-lift transition-all rounded-[24px] sm:rounded-[32px] group">
                <div className="space-y-3 sm:space-y-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${metric.bg} rounded-xl sm:rounded-2xl flex items-center justify-center ${metric.color} group-hover:scale-110 transition-transform`}>
                    <metric.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest leading-none mb-1">{metric.label}</p>
                    <div className="flex items-end gap-1.5 sm:gap-2">
                      <span className="text-xl sm:text-2xl font-black text-brown leading-none">{metric.value}</span>
                      <span className={`text-[10px] font-bold leading-none ${metric.trend.startsWith('+') ? 'text-primary' : metric.trend.startsWith('-') ? 'text-clay' : 'text-brown-muted'}`}>
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Health Chart Simulation */}
          <Card className="p-8 bg-card border-brown-muted/10 shadow-premium rounded-[40px] overflow-hidden relative">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-serif font-medium text-brown">Crop Health Trend</h3>
                <p className="text-brown-muted font-medium">Weekly vitality analysis</p>
              </div>
              <div className="flex items-center gap-2 bg-sand px-4 py-2 rounded-full border border-brown-muted/5">
                <TrendingUp size={18} className="text-primary" />
                <span className="text-sm font-black text-brown">Excellent</span>
              </div>
            </div>

            {/* Simulated Chart Visual */}
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {[65, 78, 72, 85, 82, 94, 90].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full relative flex flex-col justify-end h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                      className={`w-full rounded-t-2xl transition-all group-hover:opacity-80 ${i === 5 ? 'bg-primary shadow-[0_0_20px_rgba(47,125,78,0.3)]' : 'bg-primary/20'}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button className="flex-1 py-6 sm:py-8 rounded-[24px] sm:rounded-[32px] bg-primary hover:bg-primary-hover text-white flex items-center justify-between px-6 sm:px-8 text-lg sm:text-xl font-bold transition-all shadow-lift h-auto min-h-[72px]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl shrink-0">
                  <Droplets size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="leading-tight text-left">Start Irrigation</span>
              </div>
              <ChevronRight size={20} className="sm:w-6 sm:h-6 opacity-50 shrink-0" />
            </Button>
            <Button variant="outline" className="flex-1 py-6 sm:py-8 rounded-[24px] sm:rounded-[32px] bg-white border-brown-muted/10 hover:bg-sand text-brown flex items-center justify-between px-6 sm:px-8 text-lg sm:text-xl font-bold transition-all shadow-sm h-auto min-h-[72px]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-xl sm:rounded-2xl text-primary shrink-0">
                  <Sprout size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="leading-tight text-left">View Recommendations</span>
              </div>
              <ChevronRight size={20} className="sm:w-6 sm:h-6 text-brown-muted shrink-0" />
            </Button>
          </div>

          {/* Activity Log Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-display-small font-serif font-medium text-brown">Recent Alerts</h3>
              <Button variant="ghost" className="text-primary font-bold">View History</Button>
            </div>
            
            <div className="space-y-4">
              {activities.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button className="w-full flex items-center justify-between p-5 bg-card border border-brown-muted/10 rounded-[24px] hover:bg-sand transition-all group shadow-sm hover:shadow-premium">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-transform group-hover:scale-105 ${item.color}`}>
                        <item.icon size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{item.time}</p>
                        <h4 className="text-lg font-bold text-brown">{item.title}</h4>
                        <p className="text-brown-muted font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-brown-muted group-hover:text-brown transition-colors" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - CONTEXTUAL INFO */}
        <div className="lg:w-80 shrink-0 space-y-8">
           {/* Weather Forecast Card */}
           <Card className="bg-sand border-0 shadow-premium rounded-[40px] p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-brown-muted uppercase tracking-widest">Weather</p>
                    <h4 className="text-3xl font-black text-brown">28°C</h4>
                 </div>
                 <div className="p-4 bg-white rounded-3xl shadow-sm text-primary">
                    <Sun size={32} />
                 </div>
              </div>

              <div className="space-y-4">
                 {[
                   { day: 'Mon', icon: CloudRain, temp: '24°' },
                   { day: 'Tue', icon: Sun, temp: '30°' },
                   { day: 'Wed', icon: Sun, temp: '31°' },
                   { day: 'Thu', icon: CloudRain, temp: '26°' },
                 ].map((d, i) => (
                   <div key={i} className="flex items-center justify-between border-b border-brown-muted/5 pb-4 last:border-0 last:pb-0">
                      <span className="font-bold text-brown-muted">{d.day}</span>
                      <d.icon size={20} className="text-primary" />
                      <span className="font-black text-brown">{d.temp}</span>
                   </div>
                 ))}
              </div>
           </Card>

           {/* Market Snapshot Card */}
           <Card className="bg-card border-brown-muted/10 shadow-premium rounded-[40px] p-8 space-y-6">
              <h4 className="text-lg font-serif font-medium text-brown">Market Pulse</h4>
              <div className="space-y-4">
                 {[
                   { name: 'Grapes', price: '₹85/kg', trend: '+5%' },
                   { name: 'Tomato', price: '₹42/kg', trend: '-2%' },
                   { name: 'Onion', price: '₹28/kg', trend: '+12%' },
                 ].map((m, i) => (
                   <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm font-bold">
                         <span className="text-brown">{m.name}</span>
                         <span className="text-brown">{m.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <div className="flex-1 h-1 bg-sand rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '70%' }} />
                         </div>
                         <span className={`text-[10px] font-black ${m.trend.startsWith('+') ? 'text-primary' : 'text-clay'}`}>
                           {m.trend}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
              <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-pill h-12 shadow-none border-0">
                 Market Analysis
              </Button>
           </Card>
        </div>

      </div>
    </div>
  );
}
