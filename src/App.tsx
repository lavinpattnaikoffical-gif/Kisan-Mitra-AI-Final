/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sprout, 
  Home, 
  Camera, 
  Store, 
  ClipboardList, 
  Bot, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell, 
  Sun, 
  Moon, 
  Volume2,
  MapPin,
  X,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { UserProfile, MetricItem, InboxAlert, MarketProduct, FarmActivityLog, ScanRecord, ChatMessage } from "./types";
import { TRANSLATIONS, LanguageCode } from "./translations";

// Components
import LoginOnboarding from "./components/LoginOnboarding";
import Dashboard from "./components/Dashboard";
import Detect from "./components/Detect";
import Marketplace from "./components/Marketplace";
import Telemetry from "./components/Telemetry";
import Advisor from "./components/Advisor";
import Settings from "./components/Settings";

// Initializing beautiful mock products for PM-Kisan subsidy marketplace
const INITIAL_PRODUCTS: MarketProduct[] = [
  { id: "p1", name: "Premium Hybrid Bt-Cotton Seeds", category: "Seeds", price: 340, originalPrice: 680, subsidyPercent: 50, seller: "Mahyco India", rating: 4.6, soldCount: 420, location: "Nashik depot", isVerified: true, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300&q=40" },
  { id: "p2", name: "Soluble Organo-NPK Crop Fertilizer", category: "Fertilizers", price: 540, originalPrice: 900, subsidyPercent: 40, seller: "IFFCO Cooperative", rating: 4.8, soldCount: 940, location: "Pune District Depot", isVerified: true, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=300&q=40" },
  { id: "p3", name: "Drip Irrigation Micro-Emitter Nozzle Kit", category: "Irrigation", price: 1450, originalPrice: 2900, subsidyPercent: 50, seller: "Jain Irrigation Systems", rating: 4.5, soldCount: 180, location: "Aurangabad", isVerified: true, image: "https://images.unsplash.com/photo-1563514227147-6d2ff8655700?auto=format&fit=crop&w=300&q=40" },
  { id: "p4", name: "Neem Fruit Extract Bio-Pesticide (1500ppm)", category: "Fertilizers", price: 290, originalPrice: 480, subsidyPercent: 40, seller: "Kisan Bio-Chemicals", rating: 4.4, soldCount: 310, location: "Sangli Depot", isVerified: true, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=40" },
  { id: "p5", name: "Heavy Duty Handheld Soil pH Meter Probe", category: "Tools", price: 780, originalPrice: 1300, subsidyPercent: 40, seller: "AgroInstruments Corp", rating: 4.2, soldCount: 75, location: "Nashik depot", isVerified: false, image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=40" }
];

// Initial farm logs to show a healthy timeline
const INITIAL_LOGS: FarmActivityLog[] = [
  { id: "l1", activityType: "Irrigation", cropName: "Cotton", amount: "12mm duration", notes: "Regular morning cycle initiated via smart solenoid.", timestamp: "Yesterday, 06:15 AM" },
  { id: "l2", activityType: "Fertilizing", cropName: "Cotton", amount: "1.5 kg organic manure", notes: "Applied balanced composting formula along the middle rows.", timestamp: "2 days ago, 08:30 AM" }
];

// Initial alert cards representing Priority Inbox
const INITIAL_ALERTS: InboxAlert[] = [
  { id: "a1", severity: "high", titleKey: "moistureAlertTitle", descKey: "moistureAlertDesc", details: "Zone B moisture dropped to 42% triggering high risk of crop water deficit.", actionKey: "triggerIrr", timestamp: "10 mins ago" },
  { id: "a2", severity: "medium", titleKey: "pestAdvisorTitle", descKey: "pestAdvisorDesc", details: "Warm humid nights in Nashik increase fungal spore germination times.", actionKey: "viewDetails", timestamp: "1 hr ago", tabTarget: "detect" }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("English");
  const [currentTab, setCurrentTab] = useState<"dashboard" | "detect" | "market" | "activity" | "ai" | "settings">("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [liveLocation, setLiveLocation] = useState<{district: string; state: string} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Core synchronized agricultural database states
  const [metrics, setMetrics] = useState<MetricItem[]>([
    { id: "soil-moisture", label: "Soil Moisture", value: "42%", trend: "down", trendText: "-8% vs yesterday", status: "danger", sensorId: "GRID-S1", lastUpdated: "Today, 08:15 AM", sourceType: "IoT Sensor" },
    { id: "soil-temp", label: "Soil Temperature", value: "31°C", trend: "up", trendText: "+2°C vs noon", status: "neutral", sensorId: "GRID-S2", lastUpdated: "Today, 08:15 AM", sourceType: "IoT Sensor" },
    { id: "crop-vitality", label: "Crop Vitality", value: "84%", trend: "stable", trendText: "Optimal index", status: "success", sensorId: "SATELLITE-V1", lastUpdated: "Yesterday, 04:30 PM", sourceType: "Satellite Estimate" }
  ]);
  const [alerts, setAlerts] = useState<InboxAlert[]>(INITIAL_ALERTS);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [logs, setLogs] = useState<FarmActivityLog[]>(INITIAL_LOGS);
  const [listings, setListings] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("kisan_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setSelectedLanguage(parsed.language || "English");
      }
      
      const savedScans = localStorage.getItem("kisan_scans");
      if (savedScans) setScans(JSON.parse(savedScans));

      const savedLogs = localStorage.getItem("kisan_logs");
      if (savedLogs) setLogs(JSON.parse(savedLogs));

      const savedListings = localStorage.getItem("kisan_listings");
      if (savedListings) setListings(JSON.parse(savedListings));

      // Theme toggle initialization matching prefers-color-scheme
      const savedTheme = localStorage.getItem("kisan_theme");
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setDarkMode(true);
      }
    } catch (e) {
      console.warn("Storage reading error:", e);
    }
  }, []);

  // Update browser classes on dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("kisan_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Geolocation: detect user's live location after login
  useEffect(() => {
    if (!profile) return;
    if (liveLocation) return;
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=en`,
              { headers: { "User-Agent": "KisanMitrAI/1.0" } }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const detectedDistrict = addr.county || addr.city_district || addr.city || addr.town || addr.village || profile.district;
              const detectedState = addr.state || profile.state;
              setLiveLocation({ district: detectedDistrict, state: detectedState });
              // Auto-update profile
              const updated = { ...profile, district: detectedDistrict, state: detectedState };
              setProfile(updated);
              localStorage.setItem("kisan_profile", JSON.stringify(updated));
            }
          } catch (e) {
            console.warn("Reverse geocode failed:", e);
          } finally {
            setLocationLoading(false);
          }
        },
        () => setLocationLoading(false),
        { timeout: 8000 }
      );
    } else {
      setLocationLoading(false);
    }
  }, [profile]);

  // Sync profile language changes globally instantly
  const handleSetLanguage = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    if (profile) {
      const updated = { ...profile, language: lang };
      setProfile(updated);
      localStorage.setItem("kisan_profile", JSON.stringify(updated));
    }
  };

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setSelectedLanguage(newProfile.language as LanguageCode);
    localStorage.setItem("kisan_profile", JSON.stringify(newProfile));
    
    // Add warm welcome advisor message on first launch
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: "bot",
      text: newProfile.language === "Hindi" 
        ? `नमस्ते राजेश जी! किसानमित्र AI में आपका स्वागत है। आपके ${newProfile.cropType} के खेत (क्षेत्र: ${newProfile.farmSize} ${newProfile.farmSizeUnit}) के लिए मैंने सभी कृषि मानकों को अनुकूलित कर दिया है। मिट्टी की नमी की जांच के लिए आप 'मुख्य पेज' और फसल सुरक्षा समीक्षा के लिए 'बीमारी स्कैनर' का उपयोग कर सकते हैं।`
        : `Namaste Rajesh! Welcome to KisanMitr AI. I have successfully customized your farmer desk matching your ${newProfile.cropType} cultivation (${newProfile.farmSize} ${newProfile.farmSizeUnit}). Reach out if you need soil advisor feedback!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setChatHistory([welcomeMsg]);
  };

  // Trigger hydration solenoid valve simulation
  const handleTriggerIrrigation = (zone: string) => {
    // Update local metrics immediately
    setMetrics((prev) => 
      prev.map((item) => 
        item.id === "soil-moisture" 
          ? { ...item, value: "65%", trend: "up" as const, trendText: "+23% post irrigation", status: "success" as const, lastUpdated: "Just now" } 
          : item
      )
    );
    // Dismiss alerts matching water checklist
    setAlerts((prev) => prev.filter((a) => a.actionKey !== "triggerIrr"));
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem("kisan_profile", JSON.stringify(updatedProfile));
  };

  const handleResetData = () => {
    localStorage.clear();
    setProfile(null);
    setCurrentTab("dashboard");
    setScans([]);
    setLogs(INITIAL_LOGS);
    setListings([]);
    setAlerts(INITIAL_ALERTS);
    setChatHistory([]);
  };

  // Add items committed across secondary logs
  const handleAddScan = (record: ScanRecord) => {
    const list = [record, ...scans];
    setScans(list);
    localStorage.setItem("kisan_scans", JSON.stringify(list));
  };

  const handleAddLog = (log: FarmActivityLog) => {
    const list = [log, ...logs];
    setLogs(list);
    localStorage.setItem("kisan_logs", JSON.stringify(list));
  };

  const handleAddListing = (listing: any) => {
    const list = [listing, ...listings];
    setListings(list);
    localStorage.setItem("kisan_listings", JSON.stringify(list));
  };

  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Helper dictionary keys
  const t = TRANSLATIONS[selectedLanguage];

  if (!profile) {
    return (
      <LoginOnboarding 
        onComplete={handleCompleteOnboarding} 
        selectedLanguage={selectedLanguage}
        setLanguage={handleSetLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4F0] dark:bg-[#0F0F10] text-[#1C1C1E] dark:text-[#F5F5F7] font-sans flex flex-col transition-colors duration-normal select-none">
      
      {/* 🧭 Header Desk bar with quick profile information */}
      <header className="sticky top-0 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-[#D4CFC7]/50 dark:border-white/10 h-16 px-4 sm:px-6 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#2F7D4E] dark:text-[#4ADE80]">
            <Sprout size={24} className="animate-spin-slow text-[#2F7D4E]" />
            <span className="font-extrabold tracking-tight font-display text-base">{t.appName}</span>
          </div>

          <span className="h-4 border-l border-[#D4CFC7] dark:border-white/10 hidden sm:inline" />

          {/* District + live location */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#5A5A5F] dark:text-[#A1A1A6]">
            <MapPin size={12} className="text-[#2F7D4E] dark:text-[#4ADE80]" />
            <span>{liveLocation ? `${liveLocation.district}, ${liveLocation.state}` : `${profile.district} District Panel`}</span>
            {locationLoading ? (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
        </div>

        {/* Dynamic header menus: Theme switcher, notifications indicator, profiles */}
        <div className="flex items-center gap-3 select-none">
          {/* Quick Tab indicators inside header */}
          <span className="text-xs font-extrabold text-[#5A5A5F] dark:text-[#A1A1A6] mr-1 hidden md:inline">
            🚜 {profile.name} ({profile.cropType} Cultivator)
          </span>

          {/* Theme custom Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-xl bg-[#EDE8E0] hover:bg-[#D4CFC7] dark:bg-[#1C1C1E] dark:hover:bg-[#2C2C2E] flex items-center justify-center transition-all cursor-pointer focus:outline-none"
            aria-label="Toggle dark mode theme"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
          </button>

          {/* Active Notifications Indicator popup button */}
          <button
            id="notifications-indicator-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-[#EDE8E0] hover:bg-[#D4CFC7] dark:bg-[#1C1C1E] dark:hover:bg-[#2C2C2E] flex items-center justify-center transition-all cursor-pointer relative focus:outline-none"
            aria-label="Open notifications panel"
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute top-2 right-2.5 bg-rose-600 w-2 h-2 rounded-full animate-ping" />
            )}
          </button>

          {/* Quick Settings Icon on mobile devices */}
          <button
            id="mobile-settings-btn"
            onClick={() => {
              setCurrentTab("settings");
              stopTTS();
            }}
            className={`lg:hidden w-10 h-10 rounded-xl bg-[#EDE8E0] hover:bg-[#D4CFC7] dark:bg-[#1C1C1E] dark:hover:bg-[#2C2C2E] flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
              currentTab === "settings" ? "text-[#2F7D4E] dark:text-[#4ADE80]" : ""
            }`}
            aria-label="Open settings panel"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      {/* Main Panel Core Frame */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto overflow-hidden relative">
        
        {/* Module Sidebar (Desktop) - 250px wide */}
        <nav className="w-64 border-r border-[#D4CFC7]/50 dark:border-white/10 hidden lg:flex flex-col justify-between py-6 px-4 bg-white/40 dark:bg-black/10 select-none">
          <div className="space-y-1">
            {[
              { id: "dashboard", label: t.dashboard, icon: Home },
              { id: "detect", label: t.detect, icon: Camera },
              { id: "market", label: t.market, icon: Store },
              { id: "activity", label: t.activity, icon: ClipboardList },
              { id: "ai", label: t.ai, icon: Bot },
              { id: "settings", label: t.settings, icon: SettingsIcon }
            ].map((navItem) => (
              <button
                key={navItem.id}
                id={`sidebar-nav-${navItem.id}`}
                onClick={() => {
                  setCurrentTab(navItem.id as any);
                  stopTTS();
                }}
                className={`w-full h-12 rounded-2xl px-4 flex items-center gap-3.5 text-xs font-extrabold tracking-wide uppercase transition-all duration-fast cursor-pointer ${
                  currentTab === navItem.id
                    ? "bg-[#2F7D4E] text-white shadow-sm shadow-[#2F7D4E]/10"
                    : "text-[#5A5A5F] dark:text-[#A1A1A6] hover:bg-[#EDE8E0] dark:hover:bg-[#1C1C1E] hover:text-[#1C1C1E]"
                }`}
              >
                <navItem.icon size={16} />
                <span>{navItem.label}</span>
              </button>
            ))}
          </div>

          {/* Logout Action button */}
          <button
            id="sidebar-logout-btn"
            onClick={handleResetData}
            className="w-full h-11 rounded-xl px-4 flex items-center gap-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/15 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Reset Setup Portfolio</span>
          </button>
        </nav>



        {/* Main Content Workspace viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:py-8 relative pb-20 select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {currentTab === "dashboard" && (
                <Dashboard 
                  profile={profile} 
                  selectedLanguage={selectedLanguage}
                  onNavigateTab={setCurrentTab}
                  metrics={metrics}
                  alertList={alerts}
                  onDismissAlert={handleDismissAlert}
                  onTriggerIrrigation={handleTriggerIrrigation}
                  onAddPriorityLog={(type, amt, notes) => handleAddLog({
                    id: `tk-${Date.now()}`,
                    activityType: type as any,
                    cropName: profile.cropType,
                    amount: amt,
                    notes,
                    timestamp: "Just now"
                  })}
                />
              )}

              {currentTab === "detect" && (
                <Detect 
                  profile={profile} 
                  selectedLanguage={selectedLanguage}
                  onNavigateTab={setCurrentTab}
                  scans={scans}
                  onAddScan={handleAddScan}
                />
              )}

              {currentTab === "market" && (
                <Marketplace 
                  profile={profile} 
                  selectedLanguage={selectedLanguage}
                  onNavigateTab={setCurrentTab}
                  products={INITIAL_PRODUCTS}
                  userListings={listings}
                  onAddListing={handleAddListing}
                />
              )}

              {currentTab === "activity" && (
                <Telemetry 
                  profile={profile} 
                  selectedLanguage={selectedLanguage}
                  onNavigateTab={setCurrentTab}
                  logs={logs}
                  onAddLog={handleAddLog}
                  metrics={metrics}
                  onTriggerIrrigation={handleTriggerIrrigation}
                />
              )}

              {currentTab === "ai" && (
                <Advisor 
                  profile={profile} 
                  selectedLanguage={selectedLanguage}
                  onNavigateTab={setCurrentTab}
                  chatHistory={chatHistory}
                  onAddChatMessage={handleAddChatMessage}
                  onTriggerIrrigation={handleTriggerIrrigation}
                />
              )}

              {currentTab === "settings" && (
                <Settings 
                  profile={profile} 
                  selectedLanguage={selectedLanguage}
                  setLanguage={handleSetLanguage}
                  onUpdateProfile={handleUpdateProfile}
                  onResetData={handleResetData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Helper trigger clear speech helper */}
      <span className="hidden">
        {/* Standard helper speech canceller */}
      </span>

      {/* Floating Bottom Menu Navigation Dock (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#1C1C1E]/95 border-t border-[#D4CFC7]/50 dark:border-white/10 h-16 flex items-center justify-around z-40 select-none pb-safe">
        {[
          { id: "dashboard", label: "Home", icon: Home },
          { id: "detect", label: "Detect", icon: Camera },
          { id: "market", label: "Market", icon: Store },
          { id: "activity", label: "Farm Log", icon: ClipboardList },
          { id: "ai", label: "Kisan AI", icon: Bot }
        ].map((dockItem) => (
          <button
            key={dockItem.id}
            id={`dock-nav-btn-${dockItem.id}`}
            onClick={() => {
              setCurrentTab(dockItem.id as any);
              stopTTS();
            }}
            className={`flex flex-col items-center justify-center p-1 transition-all focus:outline-none pointer-events-auto cursor-pointer ${
              currentTab === dockItem.id
                ? "text-[#2F7D4E] dark:text-[#4ADE80] scale-110"
                : "text-[#8E8E93] hover:text-[#5A5A5F]"
            }`}
          >
            <dockItem.icon size={18} />
            <span className="text-[10px] font-extrabold mt-0.5 tracking-wider uppercase">{dockItem.label}</span>
          </button>
        ))}
      </div>

      {/* === NOTIFICATION PANEL === */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Desktop: Slide-in right sidebar */}
            <div className="hidden lg:block">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-50"
              />
              {/* Panel */}
              <motion.div
                initial={{ x: 340 }}
                animate={{ x: 0 }}
                exit={{ x: 340 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-[340px] bg-white dark:bg-[#1C1C1E] border-l border-[#D4CFC7] dark:border-[#2C2C2E] shadow-2xl z-50 flex flex-col"
              >
                <div className="flex items-center justify-between p-5 border-b border-[#D4CFC7]/30 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Bell size={18} className="text-[#2F7D4E]" />
                    <h2 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] uppercase tracking-wider">Notifications</h2>
                    {alerts.length > 0 && (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 px-1.5 py-0.5 rounded-md">{alerts.length}</span>
                    )}
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-lg bg-[#EDE8E0] dark:bg-[#2C2C2E] flex items-center justify-center hover:bg-[#D4CFC7] dark:hover:bg-[#3A3A3C] transition-colors cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 notification-scroll">
                  {alerts.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <Bell size={32} className="text-[#D4CFC7] dark:text-[#3A3A3C] mx-auto" />
                      <p className="text-xs font-semibold text-[#8E8E93]">All clear! No active alerts.</p>
                    </div>
                  ) : (
                    alerts.map((alert, idx) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={`p-4 rounded-2xl border-l-4 space-y-2 ${
                          alert.severity === "high"
                            ? "bg-rose-50/80 dark:bg-rose-950/15 border-rose-500"
                            : "bg-amber-50/80 dark:bg-amber-950/15 border-[#D96C3B]"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={14} className={alert.severity === "high" ? "text-rose-500 shrink-0 mt-0.5" : "text-[#D96C3B] shrink-0 mt-0.5"} />
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7]">
                              {alert.titleKey === "moistureAlertTitle" ? "Critical: Zone B Soil Moisture 42%" : alert.titleKey === "pestAdvisorTitle" ? "Seasonal Alert: Cotton Pest Cycle" : alert.titleKey}
                            </p>
                            <p className="text-[10px] text-[#5A5A5F] dark:text-[#A1A1A6] mt-0.5 font-medium">{alert.details}</p>
                            <p className="text-[9px] text-[#8E8E93] mt-1 font-semibold">{alert.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { handleDismissAlert(alert.id); }} className="text-[10px] font-bold text-[#8E8E93] px-2.5 py-1.5 border border-[#D4CFC7]/50 dark:border-white/10 rounded-lg hover:bg-[#EDE8E0] dark:hover:bg-[#2C2C2E] transition-colors cursor-pointer">Dismiss</button>
                          <button onClick={() => { if (alert.tabTarget) { setCurrentTab(alert.tabTarget as any); } setShowNotifications(false); }} className="text-[10px] font-extrabold text-white bg-[#2F7D4E] px-2.5 py-1.5 rounded-lg hover:bg-[#256B3F] flex items-center gap-1 cursor-pointer">
                            <span>View</span><ChevronRight size={10} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Mobile: Full-screen blurred overlay with bubble cards */}
            <div className="lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-notification z-50 flex flex-col items-center justify-center p-6"
                onClick={(e) => { if (e.target === e.currentTarget) setShowNotifications(false); }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-sm space-y-4 max-h-[80vh] overflow-y-auto notification-scroll"
                >
                  {/* Close button */}
                  <div className="flex justify-end">
                    <button onClick={() => setShowNotifications(false)} className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#1C1C1E]/90 flex items-center justify-center shadow-lg cursor-pointer">
                      <X size={18} className="text-[#1C1C1E] dark:text-[#F5F5F7]" />
                    </button>
                  </div>

                  {alerts.length === 0 ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white/95 dark:bg-[#1C1C1E]/95 rounded-3xl p-8 text-center shadow-2xl space-y-2">
                      <Bell size={36} className="text-[#D4CFC7] mx-auto" />
                      <p className="text-sm font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">All Clear</p>
                      <p className="text-xs text-[#8E8E93]">No active alerts right now.</p>
                    </motion.div>
                  ) : (
                    alerts.map((alert, idx) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: idx * 0.12, type: "spring", damping: 20 }}
                        className={`bg-white/95 dark:bg-[#1C1C1E]/95 rounded-3xl p-5 shadow-2xl space-y-3 border ${
                          alert.severity === "high" ? "border-rose-300/50 dark:border-rose-800/30" : "border-amber-300/50 dark:border-amber-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${alert.severity === "high" ? "bg-rose-500 animate-pulse" : "bg-[#D96C3B]"}`} />
                          <p className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7]">
                            {alert.titleKey === "moistureAlertTitle" ? "Critical: Soil Moisture 42%" : alert.titleKey === "pestAdvisorTitle" ? "Pest Cycle Alert" : alert.titleKey}
                          </p>
                        </div>
                        <p className="text-xs text-[#5A5A5F] dark:text-[#A1A1A6] font-medium leading-relaxed">{alert.details}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDismissAlert(alert.id)} className="flex-1 text-xs font-bold text-[#8E8E93] py-2.5 border border-[#D4CFC7]/50 dark:border-white/10 rounded-xl hover:bg-[#EDE8E0] dark:hover:bg-[#2C2C2E] transition-colors cursor-pointer">Dismiss</button>
                          <button onClick={() => { if (alert.tabTarget) setCurrentTab(alert.tabTarget as any); setShowNotifications(false); }} className="flex-1 text-xs font-extrabold text-white bg-[#2F7D4E] py-2.5 rounded-xl hover:bg-[#256B3F] cursor-pointer">Take Action</button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Clean helper to safely cancel voice synthesis on route context switches
function stopTTS() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
