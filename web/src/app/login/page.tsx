'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronRight, Phone, Mail, Mic, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/animations';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (step === 1) {
      if (!inputValue) return; // Basic validation
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1200);
    } else {
      setLoading(true);
      setTimeout(() => {
        router.push('/');
      }, 800);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-sand flex flex-col lg:flex-row overflow-hidden z-[100]"
    >
      {/* LEFT SIDE: Brand & Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-sand via-primary-50 to-primary-50 flex-col items-center justify-center p-12 overflow-hidden">
        {/* Abstract Sunrise Background */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-clay/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center space-y-12 max-w-lg"
        >
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-md px-6 py-2.5 rounded-pill border border-white/40 shadow-premium">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-serif italic text-lg">K</div>
               <span className="font-bold text-brown font-serif text-xl tracking-tight">KisanMitr AI</span>
             </div>
             <h2 className="text-h1 font-serif font-medium text-brown leading-tight">Your smart farming companion</h2>
             <p className="text-xl text-brown-muted font-medium">Empowering land, weather, and life through intelligence.</p>
          </div>
          
          <div className="aspect-square bg-white/40 backdrop-blur-3xl rounded-[60px] border border-white/40 shadow-premium relative overflow-hidden flex items-center justify-center group">
             {/* Simple Abstract Illustration Placeholder */}
             <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 bg-clay/20 rounded-full blur-3xl absolute" 
                />
                <div className="relative flex flex-col items-center gap-4 text-primary">
                   <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lift text-primary group-hover:scale-110 transition-transform duration-500">
                      <Phone size={40} />
                   </div>
                   <p className="font-bold uppercase tracking-widest text-xs opacity-50">Local Intelligence</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-24 relative">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full max-w-md space-y-10"
        >
          <motion.div variants={staggerItem} className="space-y-3">
            <h1 className="text-display font-serif font-medium text-brown leading-tight">
              {step === 1 ? (loginMethod === 'phone' ? 'Hello, Farmer' : 'Join KisanMitr') : 'Verify Phone'}
            </h1>
            <p className="text-lg text-brown-muted font-medium">
              {step === 1 
                ? (loginMethod === 'phone' ? 'Login safely with your phone number.' : 'Enter your email to get started.')
                : "We've sent a 4-digit code to your mobile."}
            </p>
          </motion.div>

          <Card className="bg-card border-brown-muted/10 p-8 rounded-[32px] shadow-lift">
            <AnimatePresence mode="wait">
              <motion.div
                key={step + loginMethod}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {step === 1 ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-brown-muted uppercase tracking-widest ml-1">
                         {loginMethod === 'phone' ? 'Mobile Number' : 'Email Address'}
                       </label>
                       <div className="relative group">
                          {loginMethod === 'phone' ? (
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-brown-muted/20 pr-3 pointer-events-none">
                               <span className="font-bold text-brown">+91</span>
                            </div>
                          ) : (
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brown-muted" size={20} />
                          )}
                          <input 
                            type={loginMethod === 'phone' ? "tel" : "email"}
                            placeholder={loginMethod === 'phone' ? "98765 43210" : "rajesh@farm.com"}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            className={cn(
                              "w-full h-16 bg-sand border border-brown-muted/10 rounded-2xl shadow-inner outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary/20 transition-all font-bold text-lg text-brown focus:bg-white",
                              loginMethod === 'phone' ? "pl-20 pr-6" : "pl-14 pr-6"
                            )}
                            autoFocus
                          />
                       </div>
                    </div>

                    <button 
                      onClick={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold text-sm tracking-wide transition-colors"
                    >
                      {loginMethod === 'phone' ? <Mail size={16} /> : <Phone size={16} />}
                      Use {loginMethod === 'phone' ? 'Email' : 'Phone'} instead
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center px-4">
                        {[1, 2, 3, 4].map((i) => (
                          <input
                            key={i}
                            type="text"
                            maxLength={1}
                            autoFocus={i === 1}
                            onChange={(e) => {
                              if (e.target.value && i < 4) {
                                const next = e.target.nextElementSibling as HTMLInputElement;
                                if (next) next.focus();
                              } else if (e.target.value && i === 4) {
                                handleNext();
                              }
                            }}
                            className="w-16 h-20 text-center text-3xl font-black bg-sand border border-brown-muted/10 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary/50 focus:outline-none transition-all text-brown"
                          />
                        ))}
                    </div>
                    <div className="text-center">
                       <button className="text-brown-muted hover:text-brown font-bold text-sm">
                         Didn't get code? <span className="text-primary hover:underline">Resend in 30s</span>
                       </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                   <Button 
                     className="w-full h-16 text-lg font-bold rounded-pill shadow-premium bg-primary hover:bg-primary-hover transition-colors text-white"
                     onClick={handleNext}
                     disabled={loading}
                   >
                     {loading ? (
                        <div className="flex items-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Verifying...
                        </div>
                     ) : (
                        <div className="flex items-center justify-center gap-2">
                           {step === 1 ? 'Get OTP' : 'Login Now'}
                           <ChevronRight size={22} />
                        </div>
                     )}
                   </Button>
                   
                   {step === 2 && (
                      <button 
                        onClick={() => setStep(1)}
                        className="w-full flex items-center justify-center gap-2 text-brown-muted hover:text-brown font-bold py-2 transition-colors"
                      >
                         <ArrowLeft size={18} />
                         Change Number
                      </button>
                   )}
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>

          <motion.footer variants={staggerItem} className="text-center space-y-4">
             <button className="inline-flex items-center gap-3 text-brown-muted hover:text-brown transition-all px-6 py-3 rounded-pill hover:bg-card border border-transparent hover:border-brown-muted/10">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                   <Mic size={18} />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">Voice Onboarding</span>
             </button>
             <p className="text-xs text-brown-muted/60 font-medium">By continuing, you agree to KisanMitr's Terms & Privacy Policy.</p>
          </motion.footer>
        </motion.div>
      </div>
    </motion.div>
  );
}
