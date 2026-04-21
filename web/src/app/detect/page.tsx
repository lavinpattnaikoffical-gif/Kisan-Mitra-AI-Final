'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  ChevronLeft, 
  Scan, 
  Zap, 
  AlertCircle, 
  Sprout,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Activity as ActivityIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DetectPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<null | 'healthy' | 'diseased'>(null);

  const startScan = () => {
    setIsScanning(true);
    setResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setResult('diseased');
    }, 3000);
  };

  return (
    <div className="py-8 space-y-8 max-w-2xl mx-auto px-4 pb-32">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-full bg-card hover:bg-sand text-brown border border-brown-muted/10">
            <ChevronLeft size={24} />
          </Button>
        </Link>
        <h1 className="text-display font-serif font-medium text-brown tracking-tight">Crop Detection</h1>
      </div>

      <section className="relative">
        <div className="aspect-[4/5] bg-[#1E1E1E] rounded-[40px] overflow-hidden relative border-8 border-sand shadow-premium">
          {/* Camera View Placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 space-y-4">
            <Camera size={64} strokeWidth={1} />
            <p className="text-lg font-medium">Align leaf within the frame</p>
          </div>

          {/* Scanning Overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(47,125,78,0.8)] z-10"
              />
            )}
          </AnimatePresence>

          {/* Guidelines */}
          <div className="absolute inset-10 border-2 border-white/20 border-dashed rounded-[32px]" />
          
          {/* AI Detection Highlights */}
          <AnimatePresence>
            {result === 'diseased' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 pointer-events-none"
              >
                <div className="absolute top-[30%] left-[40%] w-24 h-24 border-2 border-clay rounded-2xl shadow-[0_0_15px_rgba(217,108,59,0.5)]">
                  <span className="absolute -top-6 left-0 bg-clay text-white text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase">Early Blight</span>
                </div>
                <div className="absolute top-[50%] left-[20%] w-16 h-16 border-2 border-clay/60 rounded-xl">
                  <span className="absolute -top-6 left-0 bg-clay/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase">Spot</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Action Buttons Overlay */}
          <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-between items-center">
            <button className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[20px] flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Upload size={28} />
            </button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={startScan}
              disabled={isScanning}
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all relative group",
                isScanning ? "bg-primary/20" : "bg-white"
              )}
            >
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all",
                isScanning ? "bg-primary text-white animate-breathing" : "bg-primary text-white"
              )}>
                {isScanning ? <Zap size={36} className="animate-pulse" /> : <Scan size={36} />}
              </div>
              
              {!isScanning && (
                <div className="absolute inset-0 rounded-full bg-primary/20 scale-125 -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.button>

            <button className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[20px] flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Zap size={28} />
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className={cn(
              "p-8 border-0 shadow-premium flex flex-col sm:flex-row gap-8 rounded-[32px] overflow-hidden relative",
              result === 'diseased' ? "bg-clay-tint" : "bg-primary-50"
            )}>
              <div className={cn(
                "absolute top-0 left-0 w-2 h-full",
                result === 'diseased' ? "bg-clay" : "bg-primary"
              )} />
              
              <div className={cn(
                "w-20 h-20 rounded-[24px] flex items-center justify-center shrink-0 shadow-sm",
                result === 'diseased' ? "bg-clay text-white" : "bg-primary text-white"
              )}>
                {result === 'diseased' ? <AlertCircle size={40} /> : <Sprout size={40} />}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-h2-large font-bold text-brown leading-tight mb-2">
                    {result === 'diseased' ? 'Early Blight Detected' : 'Healthy Leaf Detected'}
                  </h3>
                  <p className="text-lg text-brown-muted font-medium mt-1 leading-relaxed">
                    {result === 'diseased' 
                      ? 'Your tomato leaf shows early signs of fungal infection. We recommend immediate treatment.'
                      : 'The analyzed leaf appears healthy with optimal chlorophyll levels.'}
                  </p>
                </div>

                {result === 'diseased' && (
                  <ul className="space-y-3 bg-white/40 p-5 rounded-2xl border border-clay/10">
                    <li className="flex items-start gap-3 text-brown-muted font-medium text-sm">
                      <CheckCircle2 size={16} className="text-clay mt-0.5 shrink-0" />
                      Remove and destroy infected leaves immediately.
                    </li>
                    <li className="flex items-start gap-3 text-brown-muted font-medium text-sm">
                      <CheckCircle2 size={16} className="text-clay mt-0.5 shrink-0" />
                      Avoid overhead watering to keep foliage dry.
                    </li>
                    <li className="flex items-start gap-3 text-brown-muted font-medium text-sm">
                      <CheckCircle2 size={16} className="text-clay mt-0.5 shrink-0" />
                      Apply copper-based fungicide or neem oil spray.
                    </li>
                  </ul>
                )}

                <div className="pt-2 flex flex-wrap gap-4">
                  <Button className={cn(
                    "rounded-pill px-8 py-6 h-auto text-lg font-bold shadow-sm",
                    result === 'diseased' ? "bg-clay hover:bg-clay-hover text-white" : "bg-primary hover:bg-primary-hover text-white"
                  )}>
                    View Treatment Plan
                  </Button>
                  <Button variant="outline" className="text-brown font-bold gap-3 text-lg bg-white border-brown-muted/10 px-6 rounded-pill hover:bg-sand">
                    <Volume2 size={24} className="text-primary" />
                    Listen to advice
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
