/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Droplet, 
  Thermometer, 
  Leaf, 
  PlusCircle, 
  FileText, 
  Calendar, 
  Database, 
  TrendingUp, 
  Sliders, 
  Layers,
  Sparkles,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, FarmActivityLog, MetricItem } from "../types";
import { TRANSLATIONS, LanguageCode } from "../translations";

interface TelemetryProps {
  profile: UserProfile;
  selectedLanguage: LanguageCode;
  onNavigateTab: (tab: any) => void;
  logs: FarmActivityLog[];
  onAddLog: (log: FarmActivityLog) => void;
  metrics: MetricItem[];
  onTriggerIrrigation: (zone: string) => void;
}

export default function Telemetry({
  profile,
  selectedLanguage,
  onNavigateTab,
  logs,
  onAddLog,
  metrics,
  onTriggerIrrigation
}: TelemetryProps) {
  const t = TRANSLATIONS[selectedLanguage];

  const [activeZone, setActiveZone] = useState("Zone B");
  const [logType, setLogType] = useState<"Irrigation" | "Fertilizing" | "Spraying" | "Harvesting" | "Sowing">("Irrigation");
  const [logAmount, setLogAmount] = useState("10 Liters/emitter");
  const [logNotes, setLogNotes] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);

  // Irrigation hydration valve state trigger
  const [irrigateInProg, setIrrigateInProg] = useState(false);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logAmount) return;

    const newLog: FarmActivityLog = {
      id: `log-${Date.now()}`,
      activityType: logType,
      cropName: profile.cropType,
      amount: logAmount,
      notes: logNotes || "Scheduled manual field observation run completed.",
      timestamp: new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ", " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    onAddLog(newLog);
    setLogSuccess(true);
    setLogNotes("");
    setTimeout(() => setLogSuccess(false), 3000);
  };

  const executeHydrateTrigger = () => {
    setIrrigateInProg(true);
    setTimeout(() => {
      onTriggerIrrigation(activeZone);
      setIrrigateInProg(false);
      
      // Auto commit log as a smart action!
      const autoLog: FarmActivityLog = {
        id: `log-auto-${Date.now()}`,
        activityType: "Irrigation",
        cropName: profile.cropType,
        amount: "15 Liters/min",
        notes: `Smart action triggered: Hydration executed for ${activeZone} sensor zone grid.`,
        timestamp: "Just now"
      };
      onAddLog(autoLog);
    }, 1500);
  };

  // Historic data points for structured SVGs
  const historicTelemetryData = [
    { label: "Mon", moisture: 64, temp: 29 },
    { label: "Tue", moisture: 58, temp: 31 },
    { label: "Wed", moisture: 52, temp: 32 },
    { label: "Thu", moisture: 48, temp: 30 },
    { label: "Fri", moisture: 43, temp: 33 },
    { label: "Sat", moisture: 42, temp: 34 },
    { label: "Sun (Today)", moisture: 65, temp: 28 }, // Recovered moisture due to simulation trigger!
  ];

  const currentSoilMoistureMetric = metrics.find(m => m.id === "soil-moisture")?.value || "42%";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none font-sans">
      {/* Soil telemetry line charts - 7 cols */}
      <div className="lg:col-span-7 space-y-6">
        <section className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D4CFC7]/30 dark:border-white/5">
            <div>
              <h2 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] tracking-wider uppercase flex items-center gap-1.5">
                <Database size={16} className="text-[#2F7D4E]" />
                IoT SENSOR METRIC TRENDS
              </h2>
              <p className="text-xs text-[#8E8E93] font-semibold">Real-time parameters plotted over 7 tracking cycles</p>
            </div>
            
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Zap size={11} className="animate-pulse" /> Live Feed Link
            </span>
          </div>

          {/* Interactive Line Chart utilizing pure inline SVGs (fully customized, reliable, responsive, styling-centric) */}
          <div className="bg-[#F6F4F0] dark:bg-[#121214] p-4 rounded-2xl relative select-none">
            <h4 className="text-xs font-bold text-[#1C1C1E] dark:text-white mb-4">Soil Moisture % vs Ambient Weather temp (°C)</h4>

            <div className="relative h-44 w-full select-none" aria-hidden="true">
              {/* SVG representation with plotted circles & indicators */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Grid backdrop */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.2" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.2" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.2" />

                {/* Plotting points - line 1 (Moisture %) */}
                {/* Values: mon:64, tue:58, wed:52, thu:48, fri:43, sat:42, sun:65. Mapping Y to: 120 - val */}
                <path
                  d="M 10 56 Q 73 62 136 68 T 262 77 T 325 78 T 390 55"
                  fill="none"
                  stroke="#2F7D4E"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                
                {/* Dots along paths */}
                <circle cx="10" cy="56" r="3.5" fill="#2F7D4E" />
                <circle cx="73" cy="62" r="3.5" fill="#2F7D4E" />
                <circle cx="136" cy="68" r="3.5" fill="#2F7D4E" />
                <circle cx="199" cy="72" r="3.5" fill="#2F7D4E" />
                <circle cx="262" cy="77" r="3.5" fill="#2F7D4E" />
                <circle cx="325" cy="78" r="3.5" fill="#E11D48" className="animate-ping" />
                <circle cx="10" cy="56" r="3.5" fill="#2F7D4E" />
                <circle cx="390" cy="55" r="4.5" fill="#10B981" />

                {/* Line 2 (Temperature °C) */}
                {/* Values: mon:29, tue:31, wed:32, thu:30, fri:33, sat:34, sun:28. Mapping Y to: 120 - val*2 */}
                <path
                  d="M 10 62 L 73 58 L 136 56 L 199 60 L 262 54 L 325 52 L 390 64"
                  fill="none"
                  stroke="#D96C3B"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
              </svg>

              {/* Day Labels positioned horizontally */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] font-extrabold text-[#8E8E93] font-mono">
                <span>MON (64%)</span>
                <span>WED (52%)</span>
                <span>FRI (43%)</span>
                <span>SAT (42%)</span>
                <span>TODAY ({currentSoilMoistureMetric})</span>
              </div>
            </div>

            {/* Custom interactive tooltip simulation mapping current status */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#D4CFC7]/30 pt-3 text-[10px]">
              <span className="font-semibold text-[#5A5A5F] dark:text-[#A1A1A6] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F7D4E]" /> Soil Moisture % (Ideal: 50% - 70%)
              </span>
              <span className="font-semibold text-[#5A5A5F] dark:text-[#A1A1A6] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#D96C3B]" /> Temperature °C (Ideal: 25 - 32°C)
              </span>
            </div>
          </div>
        </section>

        {/* Dynamic Zone Boundaries breakdown */}
        <section className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] uppercase tracking-wider flex items-center gap-1">{t.activeZones}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "Zone A", label: "Zone A - North (Tomato)", value: "68% - Good", status: "success" },
              { id: "Zone B", label: "Zone B - Core (Cotton)", value: `${currentSoilMoistureMetric} - Dry Alert`, status: currentSoilMoistureMetric === "65%" ? "success" : "danger" },
              { id: "Zone C", label: "Zone C - South (Sowing)", value: "54% - Stable", status: "neutral" },
            ].map((zone) => (
              <div
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeZone === zone.id
                    ? "bg-[#E8F5EC] border-[#2F7D4E] dark:bg-[#153B22]/10"
                    : "bg-[#F6F4F0]/60 border-[#D4CFC7]/40 dark:bg-[#121214] hover:bg-[#EDE8E0]"
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">{zone.id}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    zone.status === "success" ? "bg-emerald-500" :
                    zone.status === "danger" ? "bg-rose-500 animate-ping" : "bg-sky-500"
                  }`} />
                </div>
                <p className="text-[10px] text-[#8E8E93] truncate mt-1">{zone.label}</p>
                <p className={`text-xs font-extrabold mt-1 ${
                  zone.status === "danger" ? "text-rose-600" : "text-[#1C1C1E] dark:text-neutral-400"
                }`}>
                  {zone.value}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Hydrator trigger action specific to selected zone */}
          <div className="bg-[#F6F4F0]/50 dark:bg-[#121214] p-4 rounded-2xl border border-[#D4CFC7]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 dark:bg-orange-950/20 px-2 py-0.5 rounded-sm">SMART IRRIGATION SYSTEM</span>
              <p className="text-xs font-bold text-[#1C1C1E] dark:text-white mt-1">Control active valves for {activeZone}</p>
              <p className="text-[10px] text-[#8E8E93] font-semibold">WebUSB communication link matches real moisture telemetry parameters</p>
            </div>

            <button
              id="telemetry-valve-btn"
              disabled={irrigateInProg}
              onClick={executeHydrateTrigger}
              className={`h-11 px-5 rounded-xl font-bold text-xs text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeZone === "Zone B" && currentSoilMoistureMetric !== "65%"
                  ? "bg-[#2F7D4E] hover:bg-[#256B3F] animate-pulse"
                  : "bg-neutral-500 hover:bg-neutral-600"
              }`}
            >
              {irrigateInProg ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Solenite Valve...</span>
                </>
              ) : (
                <>
                  <Zap size={14} />
                  <span>Execute hydration for {activeZone}</span>
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* Manual activity Logger Form - 5 cols */}
      <div className="lg:col-span-5 space-y-6">
        <section className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="border-b border-[#D4CFC7]/30 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] tracking-wider uppercase flex items-center gap-1.5">
              <PlusCircle size={16} className="text-[#2F7D4E]" />
              {t.recentActivities}
            </h3>
            
            <span className="text-[10px] font-bold text-[#8E8E93] bg-[#F6F4F0] px-2 py-0.5 rounded-md">LOG WORK</span>
          </div>

          <form onSubmit={handleCreateLog} className="space-y-4">
            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider" htmlFor="activity-type-select">{t.activityType}</label>
              <select
                id="activity-type-select"
                value={logType}
                onChange={(e: any) => {
                  const s = e.target.value;
                  setLogType(s);
                  // Provide sensible smart defaults to save clicking time
                  if (s === "Irrigation") setLogAmount("10 Liters/emitter");
                  else if (s === "Fertilizing") setLogAmount("2.5 kg organic NPK");
                  else if (s === "Spraying") setLogAmount("500ml Neem spray");
                  else if (s === "Harvesting") setLogAmount("12 Quintals total cargo");
                  else if (s === "Sowing") setLogAmount("2kg seeds");
                }}
                className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              >
                <option value="Irrigation">Irrigation / सिंचाई</option>
                <option value="Fertilizing">Fertilizing / खत व्यवस्थापन</option>
                <option value="Spraying">Spraying / छिड़काव</option>
                <option value="Harvesting">Harvesting / कटाई</option>
                <option value="Sowing">Sowing / बुवाई</option>
              </select>
            </div>

            {/* Amount / Weight text */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider" htmlFor="amount-input">Resource Volume / Dosage</label>
              <input
                id="amount-input"
                type="text"
                required
                placeholder="e.g. 500ml or 2 kg"
                value={logAmount}
                onChange={(e) => setLogAmount(e.target.value)}
                className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              />
            </div>

            {/* Detailed notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider" htmlFor="notes-textarea">Observation Notes</label>
              <textarea
                id="notes-textarea"
                placeholder={t.notesPlaceholder}
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-semibold border border-[#D4CFC7] dark:border-white/10 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E] resize-none"
              />
            </div>

            <button
              id="add-log-btn"
              type="submit"
              className="w-full h-11 bg-[#2F7D4E] hover:bg-[#256B3F] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <PlusCircle size={14} />
              <span>{t.addLog}</span>
            </button>
          </form>

          {logSuccess && (
            <div className="text-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-xs text-emerald-800 font-bold">✓ Log registered to offline SQLite sync database.</p>
            </div>
          )}
        </section>

        {/* List historic items committed */}
        <section className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-[#8E8E93] tracking-widest uppercase">{t.historyLogs}</h3>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
            {logs.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#F6F4F0]/60 dark:bg-[#121214] border-l-2 border-[#2F7D4E] rounded-xl text-left"
              >
                <div className="flex items-center justify-between gap-2 border-b border-dashed border-[#D4CFC7]/20 pb-1">
                  <span className="text-xs font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] uppercase tracking-wide">
                    {item.activityType}
                  </span>
                  <span className="text-[9px] text-[#8E8E93] font-semibold">{item.timestamp}</span>
                </div>
                <p className="text-xs font-bold text-[#202022] dark:text-[#A1A1A6] mt-1.5">Cargo Dosage: {item.amount}</p>
                <p className="text-[10px] text-[#8E8E93] font-semibold leading-relaxed mt-0.5">{item.notes}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
