/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  AlertTriangle, 
  Droplet, 
  Thermometer, 
  Leaf, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, MetricItem, InboxAlert } from "../types";
import { TRANSLATIONS, LanguageCode } from "../translations";

interface DashboardProps {
  profile: UserProfile;
  selectedLanguage: LanguageCode;
  onNavigateTab: (tab: any) => void;
  metrics: MetricItem[];
  alertList: InboxAlert[];
  onDismissAlert: (id: string) => void;
  onTriggerIrrigation: (zone: string) => void;
  onAddPriorityLog: (activityType: string, amount: string, notes: string) => void;
}

export default function Dashboard({
  profile,
  selectedLanguage,
  onNavigateTab,
  metrics,
  alertList,
  onDismissAlert,
  onTriggerIrrigation,
  onAddPriorityLog
}: DashboardProps) {
  const t = TRANSLATIONS[selectedLanguage];

  const [feedMode, setFeedMode] = useState<"IoT Sensor" | "Manual Log" | "Satellite Estimate">("IoT Sensor");
  const [irrigationLoading, setIrrigationLoading] = useState<string | null>(null);

  // Filter metrics based on feed mode selected
  const activeMetrics = metrics.map(m => ({
    ...m,
    value: feedMode === "Manual Log" 
      ? (m.id === "soil-moisture" ? "48%" : m.id === "soil-temp" ? "28°C" : "80%") 
      : feedMode === "Satellite Estimate"
      ? (m.id === "soil-moisture" ? "44%" : m.id === "soil-temp" ? "33°C" : "86%")
      : m.value, // IoT Live
    sourceType: feedMode
  }));

  // Simple checks list state for daily priorities
  const [tasks, setTasks] = useState([
    { id: "task-1", text: "Apply organic NPK fertilizer before 10:00 AM", done: false },
    { id: "task-2", text: "Check drip irrigation lines in East boundary section", done: false },
    { id: "task-3", text: "Inspect lower foliage for mildew signs due to high night humidity", done: false },
  ]);

  const handleTaskToggle = (id: string, text: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, done: !task.done } : task));
    // Commit a log automatically when a task is completed as a helpful smart tool
    const task = tasks.find(tk => tk.id === id);
    if (task && !task.done) {
      onAddPriorityLog("Fertilizing", "Standard dosage", `Completed task: ${text}`);
    }
  };

  const handleTriggerAction = (alert: InboxAlert) => {
    if (alert.actionKey === "triggerIrr") {
      setIrrigationLoading(alert.id);
      setTimeout(() => {
        onTriggerIrrigation("Zone B");
        onDismissAlert(alert.id);
        setIrrigationLoading(null);
      }, 1800);
    } else if (alert.tabTarget) {
      onNavigateTab(alert.tabTarget);
    }
  };

  // Weather simulation localized
  const weatherMap: Record<string, { temp: string, condition: string, relative: string, icon: string, wind: string }> = {
    "Maharashtra": { temp: "34°C", condition: "Warm & Mostly Sunny", relative: "Low rain chance today", icon: "☀️", wind: "14 km/h" },
    "Punjab": { temp: "31°C", condition: "Sunny & Air Quality PM2.5 Moderate", relative: "Dust suspension in West", icon: "🌤️", wind: "9 km/h" },
    "Gujarat": { temp: "35°C", condition: "High Heat Index Alert", relative: "Avoid spraying during peak noon", icon: "🌡️", wind: "16 km/h" },
    "Karnataka": { temp: "29°C", condition: "Humid & Light Showers Expected", relative: "80% cloud density", icon: "🌦️", wind: "12 km/h" }
  };

  const localStateWeather = weatherMap[profile.state] || weatherMap["Maharashtra"];

  return (
    <div className="space-y-6">
      {/* 🌤️ Interactive Quick-access Climate Strip */}
      <details className="group bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-2xl shadow-sm overflow-hidden select-none" open>
        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F6F4F0] dark:hover:bg-[#252528] transition-colors focus:outline-none">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="weather-icon">{localStateWeather.icon}</span>
            <div>
              <p className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7]">
                {profile.district}, {profile.state} · <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{localStateWeather.temp}</span>
              </p>
              <p className="text-xs text-[#5A5A5F] dark:text-[#A1A1A6] font-semibold">
                {localStateWeather.condition} · {localStateWeather.relative}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F7D4E] dark:text-[#4ADE80] bg-[#E8F5EC] dark:bg-[#153B22] px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AG-WEATHER LIVE</span>
          </div>
        </summary>
        <div className="p-4 pt-0 border-t border-[#D4CFC7]/50 dark:border-[#2C2C2E]/50 grid grid-cols-3 gap-3 text-center bg-[#F6F4F0]/30 dark:bg-[#121214]">
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7]/30">
            <p className="text-xs text-[#8E8E93] font-bold">Relative Humidity</p>
            <p className="text-base font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] mt-0.5">62%</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7]/30">
            <p className="text-xs text-[#8E8E93] font-bold">Wind Speed</p>
            <p className="text-base font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] mt-0.5">{localStateWeather.wind}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7]/30">
            <p className="text-xs text-[#8E8E93] font-bold">Spraying Safety</p>
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">Excellent Today</p>
          </div>
        </div>
      </details>

      {/* ⚠️ Dynamic Urgent Priority Board */}
      <section className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-[#D4CFC7]/30 dark:border-white/5 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] tracking-wider uppercase flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-[#D96C3B]" />
              {t.urgentAlerts}
            </h2>
            <p className="text-xs text-[#8E8E93] font-semibold">{t.prioritiesDesc}</p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 rounded-md">
            {alertList.length} Action{alertList.length === 1 ? "" : "s"}
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {alertList.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 text-center space-y-2"
            >
              <CheckCircle size={32} className="text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-[#5A5A5F] dark:text-[#A1A1A6]">{t.noAlerts}</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {alertList.map((alert) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border-l-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-colors duration-fast ${
                    alert.severity === "high"
                      ? "bg-rose-50/50 dark:bg-rose-950/10 border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15"
                      : "bg-[#FDEDE6]/40 dark:bg-[#D96C3B]/10 border-[#D96C3B] hover:bg-[#FDEDE6]/60 dark:hover:bg-[#D96C3B]/15"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${alert.severity === "high" ? "bg-rose-500 animate-pulse" : "bg-orange-500"}`} />
                      <h3 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7]">
                        {/* Resolve dynamic alerts */}
                        {alert.titleKey === "moistureAlertTitle" ? "Critical: Zone B Soil Moisture 42%" : alert.titleKey === "pestAdvisorTitle" ? "Seasonal Alert: Cotton Pest Cycle" : alert.titleKey}
                      </h3>
                    </div>
                    <p className="text-xs text-[#5A5A5F] dark:text-[#A1A1A6] font-medium leading-relaxed">
                      {alert.descKey === "moistureAlertDesc" ? "Moisture fell below the critical 45% threshold. Ensure drip systems are initiated immediately." : alert.descKey === "pestAdvisorDesc" ? "Nashik district forecast shows elevated risk of early cotton spot infestation due to night cooling parameters." : alert.descKey}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`alert-dismiss-${alert.id}`}
                      onClick={() => onDismissAlert(alert.id)}
                      className="text-xs font-bold text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white px-3 py-2 bg-transparent border border-[#D4CFC7] dark:border-white/10 rounded-xl transition-all"
                    >
                      Ignore
                    </button>
                    <button
                      id={`alert-act-${alert.id}`}
                      disabled={irrigationLoading === alert.id}
                      onClick={() => handleTriggerAction(alert)}
                      className={`text-xs font-extrabold px-3.5 py-2.5 rounded-xl text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                        alert.severity === "high" ? "bg-rose-600 hover:bg-rose-700" : "bg-[#2F7D4E] hover:bg-[#256B3F]"
                      }`}
                    >
                      {irrigationLoading === alert.id ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                          <span>Sending WebUSB...</span>
                        </>
                      ) : (
                        <span>{t[alert.actionKey] || alert.actionKey}</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 🧱 Unified Soil & Crop Analytics Metrics */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#5A5A5F] dark:text-[#A1A1A6] tracking-wider uppercase flex items-center gap-1.5 select-none">
            🌲 {t.sourceSelector}
          </h2>
          {/* Feed Switch Selector */}
          <div className="flex bg-[#EDE8E0] dark:bg-[#1C1C1E] rounded-full p-1 border border-[#D4CFC7]/40 dark:border-white/5 shadow-inner">
            {["IoT Sensor", "Manual Log", "Satellite Estimate"].map((mode) => (
              <button
                key={mode}
                id={`feed-btn-${mode.replace(/\s+/g, "")}`}
                onClick={() => setFeedMode(mode as any)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  feedMode === mode
                    ? "bg-[#2F7D4E] text-white shadow-xs"
                    : "text-[#5A5A5F] dark:text-[#A1A1A6] hover:text-[#1C1C1E]"
                }`}
              >
                {mode === "IoT Sensor" ? "IoT Grid" : mode === "Manual Log" ? "Manual" : "Satellite"}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeMetrics.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-[#2F7D4E]/50 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#5A5A5F] dark:text-[#A1A1A6]">
                    {card.id === "soil-moisture" && <Droplet size={14} className="text-[#2F7D4E]" />}
                    {card.id === "soil-temp" && <Thermometer size={14} className="text-orange-500" />}
                    {card.id === "crop-vitality" && <Leaf size={14} className="text-emerald-500" />}
                    <span className="uppercase tracking-wider">{t[card.id === "soil-moisture" ? "soilMoisture" : card.id === "soil-temp" ? "soilTemp" : "cropVitality"]}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    card.sourceType === "IoT Sensor"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : card.sourceType === "Manual Log"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      : "bg-[#FDEDE6] text-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
                  }`}>
                    {card.sourceType === "IoT Sensor" ? "IoT Live" : card.sourceType === "Manual Log" ? "Manual" : "Satellite"}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-[#1C1C1E] dark:text-[#F5F5F7] tracking-tight">{card.value}</span>
                  <div className="flex items-center text-xs font-bold">
                    {card.trend === "up" ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                        <TrendingUp size={14} /> {card.trendText}
                      </span>
                    ) : card.trend === "down" ? (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center">
                        <TrendingDown size={14} /> {card.trendText}
                      </span>
                    ) : (
                      <span className="text-[#8E8E93] font-mono">Stable</span>
                    )}
                  </div>
                </div>

                {/* Highly structured SVG Sparkline visualizer avoiding Recharts breaking packages */}
                <div className="h-10 w-full mt-2" aria-hidden="true">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2F7D4E" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2F7D4E" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {card.id === "soil-moisture" ? (
                      <>
                        <path d="M 0 25 Q 25 10 50 18 T 100 28" fill="none" stroke="#2F7D4E" strokeWidth="2.5" />
                        <path d="M 0 25 Q 25 10 50 18 T 100 28 L 100 30 L 0 30 Z" fill={`url(#grad-${card.id})`} />
                      </>
                    ) : card.id === "soil-temp" ? (
                      <>
                        <path d="M 0 18 Q 25 22 50 10 T 100 15" fill="none" stroke="#D96C3B" strokeWidth="2.5" />
                      </>
                    ) : (
                      <>
                        <path d="M 0 22 Q 25 20 50 15 T 100 8" fill="none" stroke="#10B981" strokeWidth="2.5" />
                        <circle cx="100" cy="8" r="3" fill="#10B981" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D4CFC7]/30 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-[#8E8E93]">
                <span>{t.lastUpdated}: {card.lastUpdated}</span>
                {card.id === "soil-moisture" && (
                  <button
                    id="trigger-irrigation-card-btn"
                    onClick={() => onTriggerIrrigation("Zone B")}
                    className="text-[#2F7D4E] dark:text-[#4ADE80] font-bold hover:underline"
                  >
                    Quick Hydrate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid containing Priority Checklist and Animated Vitality Forecast */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Priorities Checklist Action Card */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#D4CFC7]/30 dark:border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] tracking-wider uppercase flex items-center gap-1.5">
                <Clock size={16} className="text-[#2F7D4E]" />
                TODAY'S FARM TASKS
              </h3>
              <p className="text-xs text-[#8E8E93] font-semibold">Perform checkouts for best crop productivity</p>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleTaskToggle(task.id, task.text)}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                  task.done 
                    ? "bg-[#E8F5EC]/50 dark:bg-[#153B22]/10 border-[#c4e5cf] dark:border-[#1e4e2f] opacity-80" 
                    : "bg-[#F6F4F0]/60 dark:bg-[#1E1E20] border-[#D4CFC7]/50 dark:border-[#2C2C2E] hover:border-[#2F7D4E]"
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  task.done 
                    ? "bg-[#2F7D4E] border-[#2F7D4E]" 
                    : "border-[#8E8E93]"
                }`}>
                  {task.done && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className={`text-xs font-semibold leading-relaxed ${task.done ? "line-through text-[#8E8E93]" : "text-[#1C1C1E] dark:text-[#F5F5F7]"}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 text-center">
            <button
              id="nav-to-activity-btn"
              onClick={() => onNavigateTab("activity")}
              className="text-xs font-bold text-[#2F7D4E] dark:text-[#4ADE80] hover:underline flex items-center gap-1 mx-auto"
            >
              <span>{t.recentActivities}</span>
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Animated Outlook Visualization Card */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#2F7D4E]" />
                {t.trends7Days}
              </h3>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded-md">AI PROJECTED</span>
            </div>
            <p className="text-xs text-[#8E8E93] font-semibold mb-4 leading-relaxed">
              Based on historical data from {profile.district} county matching {profile.cropType} cultivation patterns during early rainy season.
            </p>

            {/* Simulated bar chart for 7 day predictions */}
            <div className="h-32 w-full flex items-end justify-between gap-1 mt-2 mb-2 select-none" aria-hidden="true">
              {[
                { day: "Mon", val: 82, text: "Ideal" },
                { day: "Tue", val: 84, text: "Ideal" },
                { day: "Wed", val: 81, text: "Ideal" },
                { day: "Thu", val: 78, text: "Cooling" },
                { day: "Fri", val: 85, text: "Ideal" },
                { day: "Sat", val: 88, text: "Peak" },
                { day: "Sun", val: 84, text: "Ideal" }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[10px] font-bold text-[#8E8E93]">{item.val}%</div>
                  <div className="w-full relative rounded-t-md overflow-hidden bg-[#F6F4F0] dark:bg-[#2C2C2E]" style={{ height: "70px" }}>
                    <motion.div
                      style={{ height: "100%" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: item.val / 100 }}
                      originY={1}
                      transition={{ type: "spring", stiffness: 100, delay: idx * 0.05 }}
                      className={`w-full rounded-t-md ${
                        item.val >= 85 
                          ? "bg-[#2F7D4E]" 
                          : item.val >= 80 
                          ? "bg-emerald-500" 
                          : "bg-[#D96C3B]"
                      }`}
                    />
                  </div>
                  <div className="text-[10px] font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] font-mono">{item.day}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#D4CFC7]/30 dark:border-white/5 flex items-center justify-between text-xs text-[#5A5A5F] dark:text-[#A1A1A6]">
            <span className="font-semibold flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F7D4E]" /> Vitality Target Range
            </span>
            <button
              id="explain-trends-btn"
              onClick={() => onNavigateTab("ai")}
              className="text-[#2F7D4E] dark:text-[#4ADE80] font-extrabold flex items-center gap-0.5 hover:underline"
            >
              <span>Analyze with Kisan AI</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
