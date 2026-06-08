/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle,
  Clock,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  X,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, ChatMessage } from "../types";
import { TRANSLATIONS, LanguageCode } from "../translations";

interface AdvisorProps {
  profile: UserProfile;
  selectedLanguage: LanguageCode;
  onNavigateTab: (tab: any) => void;
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  onTriggerIrrigation: (zone: string) => void;
}

export default function Advisor({
  profile,
  selectedLanguage,
  onNavigateTab,
  chatHistory,
  onAddChatMessage,
  onTriggerIrrigation
}: AdvisorProps) {
  const t = TRANSLATIONS[selectedLanguage];

  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Audio Speech Recognition states
  const [recognizing, setRecognizing] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (historyTargetRef.current) {
      const el = document.getElementById(`msg-${historyTargetRef.current}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-emerald-400/50");
        setTimeout(() => el.classList.remove("ring-2", "ring-emerald-400/50"), 2000);
      }
      historyTargetRef.current = null;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, loading]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedLanguage === "Hindi") utterance.lang = "hi-IN";
    else if (selectedLanguage === "Marathi") utterance.lang = "mr-IN";
    else utterance.lang = "en-IN";
    
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    setSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingText(null);
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-chat-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    onAddChatMessage(userMsg);
    setInputMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: chatHistory,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Chat server busy. Connecting local chatbot.");
      }

      const resData = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-chat-${Date.now()}`,
        sender: "bot",
        text: resData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      // Add smart direct context action chips depending on AI response keywords
      if (resData.text.toLowerCase().includes("irrigation") || resData.text.toLowerCase().includes("पानी") || resData.text.toLowerCase().includes("ओल")) {
        botMsg.actions = [
          { label: "Trigger zone B irrigation", action: "triggerIrrigation" },
          { label: "View telemetry charts", action: "navActivity" }
        ];
      } else if (resData.text.toLowerCase().includes("blight") || resData.text.toLowerCase().includes("mildew") || resData.text.toLowerCase().includes("रोग") || resData.text.toLowerCase().includes("पत्ती")) {
        botMsg.actions = [
          { label: "Buy Mancozeb fungicide", action: "buyFungicide" },
          { label: "Run leaf scanner", action: "navDetect" }
        ];
      }

      onAddChatMessage(botMsg);
      // Auto speech synthesis of Gemini AI response for illiterate accessibility (voice-first!)
      speakText(resData.text);

    } catch (err) {
      console.warn("Chat error, connecting local template responder:", err);
      // Fallback pre-approved AI responder
      let fallbackText = `Hello! I'm KisanMitr Offline Advisor. I couldn't reach the online Gemini service, but I can guide you based on current soil parameters:
      - Soil Moisture is critical at 42%. Initiate drip lines.
      - Weather is dry. Spray treatments before 10 AM before thermal winds pick up.`;
      
      if (selectedLanguage === "Hindi") {
        fallbackText = `नमस्ते! मैं किसानमित्र ऑफ़लाइन सलाहकार हूं। 
        - आपके खेत की नमी अभी ४२% (कम) है। सिंचाई टूल का उपयोग करें।
        - मौसम शुष्क है। रासायनिक छिड़काव सुबह १० बजे से पहले पूर्ण करें।`;
      } else if (selectedLanguage === "Marathi") {
        fallbackText = `नमस्कार! मी किसानमित्र ऑफलाइन सल्लागार आहे. 
        - जमिनीतील ओलावा ४२% (कमी) वर आला आहे. ठिबक सिंचन सुरू करा.
        - बुरशीनाशकाची फवारणी सकाळी वारा शांत असताना पूर्ण करा.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-chat-${Date.now()}`,
        sender: "bot",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: [
          { label: "Trigger irrigation now", action: "triggerIrrigation" },
          { label: "Proceed to Mandi Market", action: "navMarket" }
        ]
      };
      onAddChatMessage(botMsg);
      speakText(fallbackText);
    } finally {
      setLoading(false);
    }
  };

  const executeActionChip = (action: string) => {
    if (action === "triggerIrrigation") {
      onTriggerIrrigation("Zone B");
      alert("Smart irrigation action executed for Zone B via Kisan AI!");
    } else if (action === "navActivity") {
      onNavigateTab("activity");
    } else if (action === "navDetect") {
      onNavigateTab("detect");
    } else if (action === "navMarket") {
      onNavigateTab("market");
    } else if (action === "buyFungicide") {
      onNavigateTab("market");
    }
  };

  // Simulate Speak recognition
  const toggleSpeechRecognition = () => {
    if (recognizing) {
      setRecognizing(false);
      return;
    }

    // Try starting Web Speech recognition in supported browsers, or simulate realistic farmer speech
    const SpeechRecObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecObj) {
      const rec = new SpeechRecObj();
      rec.continuous = false;
      rec.interimResults = false;
      
      if (selectedLanguage === "Hindi") rec.lang = "hi-IN";
      else if (selectedLanguage === "Marathi") rec.lang = "mr-IN";
      else rec.lang = "en-IN";

      rec.onstart = () => setRecognizing(true);
      rec.onend = () => setRecognizing(false);
      rec.onerror = () => setRecognizing(false);
      
      rec.onresult = (event: any) => {
        const txt = event.results[0][0].transcript;
        setInputMsg(txt);
        handleSend(txt);
      };
      rec.start();
    } else {
      // Simulate speech input transcript beautifully
      setRecognizing(true);
      setTimeout(() => {
        let simulatedPhrase = "I have white powdery spots on my cotton leaf. What is the cure?";
        if (selectedLanguage === "Hindi") simulatedPhrase = "कपास के पत्तों पर सफेद फंगस धब्बे दिख रहे हैं, इसका क्या इलाज है?";
        else if (selectedLanguage === "Marathi") simulatedPhrase = "कापसाच्या पानांवर पांढरे ठिपके दिसत आहेत, यावर काय खत टाकावे?";
        
        setInputMsg(simulatedPhrase);
        setRecognizing(false);
      }, 2500);
    }
  };

  // Group chat history by user queries for the history drawer
  const userQueries = chatHistory.filter(m => m.sender === "user");

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl shadow-sm select-none font-sans relative flex flex-col h-[calc(100vh-12rem)]">
      {/* Advisor header */}
      <div className="border-b border-[#D4CFC7]/30 p-4 sm:p-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E8F5EC] dark:bg-[#153B22]/15 text-[#2F7D4E] rounded-xl flex items-center justify-center">
            <Bot size={20} className="animate-bounce-slow" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7]">KISAN AI CHAT ASSISTANT</h2>
            <p className="text-[10px] text-[#2F7D4E] dark:text-[#4ADE80] font-bold">Multilingual Agronomist · Speaks Hindi, Marathi, Tamil</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {speakingText && (
            <button
              id="advisor-mute-btn"
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 text-[10px] font-bold rounded-lg border border-rose-200/50"
            >
              <VolumeX size={12} />
              <span>Mute Voice API</span>
            </button>
          )}

          {/* Chat History Toggle */}
          <button
            id="chat-history-toggle"
            onClick={() => setShowHistory(!showHistory)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              showHistory
                ? "bg-[#2F7D4E] text-white"
                : "bg-[#EDE8E0] hover:bg-[#D4CFC7] dark:bg-[#2C2C2E] dark:hover:bg-[#3A3A3C] text-[#5A5A5F] dark:text-[#A1A1A6]"
            }`}
            aria-label="Toggle chat history"
          >
            <History size={16} />
          </button>
        </div>
      </div>

      {/* Main chat area with optional history drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Chat History Drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="border-r border-[#D4CFC7]/30 dark:border-white/10 bg-[#F6F4F0] dark:bg-[#121214] overflow-hidden shrink-0 flex flex-col"
            >
              <div className="p-3 border-b border-[#D4CFC7]/30 dark:border-white/5 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-widest">Recent Queries</span>
                <button onClick={() => setShowHistory(false)} className="text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 chat-scroll">
                {userQueries.length === 0 ? (
                  <p className="text-[10px] text-[#8E8E93] font-semibold text-center py-6">No queries yet. Start chatting!</p>
                ) : (
                  userQueries.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        historyTargetRef.current = q.id;
                        setShowHistory(false);
                        // Trigger re-render to scroll
                        setTimeout(() => {
                          const el = document.getElementById(`msg-${q.id}`);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "center" });
                            el.classList.add("ring-2", "ring-emerald-400/50");
                            setTimeout(() => el.classList.remove("ring-2", "ring-emerald-400/50"), 2000);
                          }
                        }, 300);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7]/30 dark:border-white/5 hover:border-[#2F7D4E]/50 transition-all group"
                    >
                      <p className="text-[11px] font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] line-clamp-2 leading-relaxed">{q.text}</p>
                      <p className="text-[9px] text-[#8E8E93] font-medium mt-1 flex items-center gap-1">
                        <Clock size={9} />
                        {q.timestamp}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message history panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-5 space-y-4 pr-1 chat-scroll">
            {chatHistory.map((item) => (
              <div
                key={item.id}
                id={`msg-${item.id}`}
                className={`flex gap-3 transition-all rounded-2xl ${item.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {item.sender === "bot" && (
                  <div className="w-8 h-8 rounded-xl bg-[#EDE8E0] dark:bg-black/20 shrink-0 flex items-center justify-center">
                    <Bot size={16} className="text-[#2F7D4E]" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1.5`}>
                  <div className={`p-3.5 rounded-2.5xl text-xs font-semibold leading-relaxed ${
                    item.sender === "user"
                      ? "bg-[#2F7D4E] text-white rounded-tr-sm"
                      : "bg-[#F6F4F0] dark:bg-[#121214] text-[#1C1C1E] dark:text-[#F5F5F7] rounded-tl-sm border border-[#D4CFC7]/20"
                  }`}>
                    <p className="select-text whitespace-pre-wrap">{item.text}</p>
                    
                    {/* Dynamically parsed action cards */}
                    {item.actions && item.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 select-none">
                        {item.actions.map((act, idy) => (
                          <button
                            key={idy}
                            id={`action-chip-btn-${idy}`}
                            onClick={() => executeActionChip(act.action)}
                            className="px-3 py-2 text-[10px] font-extrabold rounded-lg bg-white hover:bg-neutral-50 text-[#2F7D4E] dark:bg-[#1C1C1E] dark:hover:bg-[#252528] dark:text-emerald-400 border border-[#D4CFC7]/30 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <span>{act.label}</span>
                            <ArrowRight size={10} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 text-[9px] text-[#8E8E93] font-semibold ${
                    item.sender === "user" ? "justify-end" : "justify-start pl-1"
                  }`}>
                    <span>{item.timestamp}</span>
                    {item.sender === "bot" && (
                      <>
                        <span>·</span>
                        <button
                          id={`speak-msg-btn-${item.id}`}
                          onClick={() => speakText(item.text)}
                          className="hover:text-emerald-600 dark:hover:text-emerald-400 font-bold"
                        >
                          Listen Out Loud
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-[#EDE8E0] dark:bg-black/20 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-[#2F7D4E] animate-pulse" />
                </div>
                <div className="p-3.5 bg-[#F6F4F0] dark:bg-[#121214] rounded-2.5xl rounded-tl-sm border border-[#D4CFC7]/10 flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-[#8E8E93]" />
                  <p className="text-[11px] font-extrabold text-[#8E8E93] uppercase animate-pulse">Kisan AI generating response...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recognition Ambient Waveform overlay during recording */}
          <AnimatePresence>
            {recognizing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-4 mb-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 p-3.5 rounded-2xl flex items-center justify-between gap-4 z-10"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-400">Listening to farmer's speech...</p>
                </div>

                {/* Simulated sound waves visualizer */}
                <div className="flex items-end gap-1 h-6 w-16" aria-hidden="true">
                  <motion.div className="bg-rose-500 w-1 rounded-full flex-1" style={{ height: "40%" }} animate={{ height: ["40%", "90%", "40%"] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                  <motion.div className="bg-rose-500 w-1 rounded-full flex-1" style={{ height: "70%" }} animate={{ height: ["70%", "30%", "70%"] }} transition={{ repeat: Infinity, duration: 0.4 }} />
                  <motion.div className="bg-rose-500 w-1 rounded-full flex-1" style={{ height: "90%" }} animate={{ height: ["90%", "50%", "90%"] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                  <motion.div className="bg-rose-500 w-1 rounded-full flex-1" style={{ height: "50%" }} animate={{ height: ["50%", "80%", "50%"] }} transition={{ repeat: Infinity, duration: 0.3 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat workspace footer area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputMsg);
            }}
            className="flex items-center gap-2 border-t border-[#D4CFC7]/30 dark:border-white/10 p-4 sm:px-5 select-none shrink-0"
          >
            {/* Toggle MIC */}
            <button
              id="speech-recognition-btn"
              type="button"
              onClick={toggleSpeechRecognition}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                recognizing 
                  ? "bg-rose-600 text-white" 
                  : "bg-[#F6F4F0] dark:bg-[#121214] text-[#8E8E93] hover:text-[#1C1C1E] border border-[#D4CFC7]/30"
              }`}
              aria-label="Activate voice diagnostic speech input"
            >
              {recognizing ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              id="chat-input"
              type="text"
              placeholder="Ask about fertilizer ratios, mildew symptoms, mandi rates..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 h-11 bg-[#F6F4F0] dark:bg-[#121214] border border-[#D4CFC7] dark:border-white/10 rounded-2xl px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2F7D4E] text-[#1C1C1E] dark:text-[#F5F5F7]"
            />

            <button
              id="send-chat-submit-btn"
              type="submit"
              className="w-11 h-11 bg-[#2F7D4E] hover:bg-[#256B3F] text-white rounded-2xl shrink-0 transition-colors flex items-center justify-center cursor-pointer shadow-xs font-bold"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
