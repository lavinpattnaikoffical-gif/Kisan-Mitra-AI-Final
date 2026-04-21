'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Send, 
  X, 
  Sparkles, 
  ChevronLeft,
  Volume2,
  ScanLine,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AiPage() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello Rajesh! I can help you with crop disease identification, weather forecasts, or market trends. What would you like to know today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I've analyzed the recent trends. The soil moisture levels in your Vineyard are slightly below optimal. I recommend increasing the irrigation cycle by 15 minutes this evening." 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-brown hover:text-brown border border-card rounded-pill px-4">
            <ChevronLeft size={18} /> Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(47,125,78,0.8)] animate-pulse" />
          <span className="text-sm font-bold text-brown tracking-tight uppercase">Kisan AI Active</span>
        </div>
        <Button variant="ghost" size="sm" className="bg-primary-50 rounded-full h-10 w-10 p-0 hover:bg-primary-hover hover:text-white transition-colors text-primary">
          <Sparkles size={18} />
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-20 px-2 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
              <div className={cn(
                "max-w-[85%] rounded-[24px] p-5 shadow-sm",
                msg.role === 'user' 
                  ? "bg-brown text-sand rounded-tr-sm shadow-lift" 
                  : "bg-card border border-brown-muted/10 text-brown rounded-tl-sm shadow-premium"
              )}>
              <p className="text-base leading-relaxed font-medium">{msg.content}</p>
              {msg.role === 'assistant' && (
                <button className="mt-4 text-primary hover:text-primary-hover transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <Volume2 size={16} /> Listen to Advice
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area (Floating Intelligence Bar) */}
      <div className="fixed bottom-28 md:bottom-12 left-0 right-0 px-4 z-40">
        <div className="max-w-3xl mx-auto">
          {/* Suggested Prompts */}
          <div className="flex gap-2 overflow-x-auto mb-4 pb-2 scrollbar-hide">
            {['Weather update', 'Soil health', 'Market prices', 'Pest control'].map(prompt => (
              <button 
                key={prompt}
                onClick={() => setInput(prompt)}
                className="whitespace-nowrap bg-card border border-brown-muted/10 px-5 py-2.5 rounded-pill text-sm font-bold text-brown-muted hover:text-brown hover:bg-sand hover:border-primary/20 transition-all shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Main Input Pill */}
          <div className="relative group">
            <motion.div
              animate={isListening ? { scale: [1, 1.02, 1] } : {}}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "flex items-center gap-3 bg-card border border-card rounded-pill p-2 shadow-lift transition-all focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-50 focus-within:bg-sand focus-within:shadow-[0_0_20px_rgba(47,125,78,0.15)]",
                isListening && "border-primary ring-4 ring-primary/20 bg-sand"
              )}
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="bg-primary text-white p-3 rounded-full flex items-center justify-center shadow-premium"
              >
                <Sparkles size={20} />
              </motion.div>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask Kisan AI anything..."}
                className="flex-1 bg-transparent border-0 focus:ring-0 text-brown placeholder:text-brown-muted font-medium text-lg outline-none"
              />
              
              <AnimatePresence mode="wait">
                {input.trim() ? (
                  <motion.button
                    key="send"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    className="p-3 bg-brown text-sand hover:bg-primary transition-colors rounded-full shadow-lg h-12 w-12 flex items-center justify-center"
                  >
                    <Send size={20} className="ml-1" />
                  </motion.button>
                ) : (
                  <div key="actions" className="flex items-center gap-1 pr-1">
                    <button className="p-3 text-brown-muted hover:text-brown transition-colors">
                      <ScanLine size={24} />
                    </button>
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseDown={() => setIsListening(true)}
                      onMouseUp={() => setIsListening(false)}
                      className={cn(
                        "p-3 rounded-full transition-all shadow-sm flex items-center justify-center h-12 w-12",
                        isListening ? "bg-clay text-white animate-pulse" : "bg-primary-50 text-primary hover:bg-primary hover:text-white"
                      )}
                    >
                      <Mic size={22} />
                    </motion.button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Waveform for listening */}
            {isListening && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 8] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1.5 bg-primary rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
