/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  Database, 
  RefreshCw, 
  Globe, 
  Sliders, 
  Compass, 
  Trash2,
  FileDown,
  Lock,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { TRANSLATIONS, LanguageCode, LANGUAGES } from "../translations";

interface SettingsProps {
  profile: UserProfile;
  selectedLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetData: () => void;
}

export default function Settings({
  profile,
  selectedLanguage,
  setLanguage,
  onUpdateProfile,
  onResetData
}: SettingsProps) {
  const t = TRANSLATIONS[selectedLanguage];

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [crop, setCrop] = useState(profile.cropType);
  const [size, setSize] = useState(profile.farmSize.toString());
  const [farmUnit, setFarmUnit] = useState(profile.farmSizeUnit);
  const [farmState, setFarmState] = useState(profile.state);
  const [district, setDistrict] = useState(profile.district);
  
  // Settings configs
  const [cloudSync, setCloudSync] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !district.trim()) return;

    const updatedProfile: UserProfile = {
      name,
      phone,
      cropType: crop,
      farmSize: parseFloat(size) || 1.0,
      farmSizeUnit: farmUnit,
      state: farmState,
      district,
      language: selectedLanguage,
      temperatureUnit: tempUnit
    };

    onUpdateProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Farmer record exporter
  const handleExportDataSubmit = () => {
    const backupObj = {
      app: "KisanMitr AI Backup",
      timestamp: new Date().toISOString(),
      profile: {
        name,
        phone,
        crop,
        size,
        farmUnit,
        farmState,
        district,
        selectedLanguage
      },
      exportVersion: "2.1-AA"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `KisanMitr_Records_${profile.name}_${new Date().getDate()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none font-sans">
      {/* Settings Forms - 7 cols */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSave} className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4CFC7]/30 pb-3">
            <User size={16} className="text-[#2F7D4E]" />
            {t.profileTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Form */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="farmer-name-input">Farmer Name</label>
              <input
                id="farmer-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              />
            </div>

            {/* Mobile Contact Form */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="farmer-phone-input">Mobile Contact (+91)</label>
              <input
                id="farmer-phone-input"
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              />
            </div>

            {/* Profile State selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="state-select">{t.onbState}</label>
              <select
                id="state-select"
                value={farmState}
                onChange={(e) => setFarmState(e.target.value)}
                className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Punjab">Punjab</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>

            {/* Profile District details */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="district-select-input">{t.onbDistrict}</label>
              <input
                id="district-select-input"
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              />
            </div>

            {/* Profile Crop selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="crop-select">Primary Cultivated Crop</label>
              <select
                id="crop-select"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              >
                <option value="Cotton">Cotton / कपास</option>
                <option value="Tomato">Tomato / टमाटर</option>
                <option value="Wheat">Wheat / गेहूं</option>
                <option value="Paddy">Rice Paddy / धान</option>
                <option value="Onion">Onion / प्याज</option>
                <option value="Soybean">Soybean / सोयाबीन</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Farm size details */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="farm-size-select">{t.cropSize}</label>
                <input
                  id="farm-size-select"
                  type="number"
                  step="0.1"
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-2 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
                />
              </div>

              {/* Farm units select */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="unit-select">Farm Unit</label>
                <select
                  id="unit-select"
                  value={farmUnit}
                  onChange={(e: any) => setFarmUnit(e.target.value)}
                  className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-2 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
                >
                  <option value="Acres">Acres</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Hectares">Hectares</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick inline language changer inside form parameters */}
          <div className="py-2.5 border-t border-[#D4CFC7]/30 dark:border-white/5 space-y-2">
            <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block">Application Language</span>
            <div className="flex flex-wrap gap-2 select-none">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  id={`config-lang-btn-${lang.code}`}
                  type="button"
                  onClick={() => setLanguage(lang.code as LanguageCode)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedLanguage === lang.code
                      ? "bg-[#2F7D4E] border-[#2F7D4E] text-white"
                      : "bg-[#F6F4F0] border-transparent dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F5F5F7]"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="save-changes-btn"
            type="submit"
            className="w-full h-11 bg-[#2F7D4E] hover:bg-[#256B3F] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            {t.saveChanges}
          </button>

          {saveSuccess && (
            <div className="text-center p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-emerald-800 font-bold">✓ {t.savedMsg}</p>
            </div>
          )}
        </form>
      </div>

      {/* Settings Options sidebar & diagnostic parameters - 5 cols */}
      <div className="lg:col-span-5 space-y-6">
        {/* Agricultural AI System parameters */}
        <section className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-[#8E8E93] uppercase tracking-widest">{t.apiConfigTitle}</h3>

          <div className="space-y-4 select-none">
            {/* Preferred Model Choice */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block" htmlFor="model-select">{t.modelChoice}</label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-10 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7]/40 dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
              </select>
            </div>

            {/* Cloud Synchronization toggles */}
            <div className="flex items-center justify-between py-2 border-b border-[#D4CFC7]/30 dark:border-white/5">
              <div>
                <p className="text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">{t.cloudSync}</p>
                <p className="text-[10px] text-[#8E8E93] font-semibold">Continuous backup of local logs & scan histories</p>
              </div>

              <button
                id="cloud-sync-toggle"
                onClick={() => setCloudSync(!cloudSync)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                  cloudSync ? "bg-[#2F7D4E]" : "bg-[#EDE8E0] dark:bg-[#2C2C2E]"
                }`}
              >
                <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  cloudSync ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>

            {/* Units standard preference toggles (temp standard C vs F) */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">Telemetry Temperature Metric</p>
                <p className="text-[10px] text-[#8E8E93] font-semibold">Prefer weather data listed in Celsius units</p>
              </div>

              <div className="flex bg-[#EDE8E0] dark:bg-[#121214] rounded-lg p-0.5 border border-[#D4CFC7]/30 shadow-inner">
                {["C", "F"].map((u) => (
                  <button
                    key={u}
                    id={`temp-unit-btn-${u}`}
                    onClick={() => setTempUnit(u as any)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      tempUnit === u ? "bg-[#2F7D4E] text-white" : "text-[#5A5A5F]"
                    }`}
                  >
                    °{u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portability Backups and Security Hardening section */}
        <section className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-[#8E8E93] uppercase tracking-widest">DATA PORTABILITY & BACKUP</h3>

          <div className="space-y-2.5">
            {/* Export data button */}
            <button
              id="export-data-btn"
              onClick={handleExportDataSubmit}
              type="button"
              className="w-full h-11 bg-transparent hover:bg-[#F6F4F0] text-[#1C1C1E] dark:text-[#F5F5F7] text-xs font-extrabold rounded-xl border border-[#D4CFC7] dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileDown size={14} />
              <span>{t.exportData}</span>
            </button>

            {/* Clear database reset button */}
            <button
              id="reset-data-btn"
              onClick={() => {
                const confirmed = window.confirm(selectedLanguage === "Hindi" ? "क्या आप सचमुच सारा डेटा हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।" : "Are you sure you want to delete all cached farm logs, profiles, and scan records? This action cannot be undone.");
                if (confirmed) {
                  onResetData();
                }
              }}
              type="button"
              className="w-full h-11 bg-transparent hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/15 text-xs font-extrabold rounded-xl border border-rose-200 hover:border-rose-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>{t.deleteAccount}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
