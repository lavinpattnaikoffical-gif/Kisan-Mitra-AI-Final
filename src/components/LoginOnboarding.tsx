/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Phone, CheckCircle, Shield, Compass, Sprout, Landmark, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";
import { TRANSLATIONS, LANGUAGES, LanguageCode } from "../translations";

interface LoginOnboardingProps {
  onComplete: (profile: UserProfile) => void;
  selectedLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

export default function LoginOnboarding({ onComplete, selectedLanguage, setLanguage }: LoginOnboardingProps) {
  const t = TRANSLATIONS[selectedLanguage];
  
  const [step, setStep] = useState<"language" | "phone" | "otp" | "setup">("language");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);
  
  // Onboarding parameters
  const [crop, setCrop] = useState("Cotton");
  const [farmSize, setFarmSize] = useState("2.5");
  const [farmUnit, setFarmUnit] = useState<"Acres" | "Bigha" | "Hectares">("Acres");
  const [farmState, setFarmState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Nashik");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((v) => v - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sanitized = phone.replace(/\D/g, "");
    if (sanitized.length !== 10) {
      setError(selectedLanguage === "Hindi" ? "कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें!" : "Please enter a valid 10-digit mobile number!");
      return;
    }
    // Simulate real OTP delivery
    setOtpSent(true);
    setTimer(30);
    setStep("otp");
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp !== "1234" && otp.length !== 4) {
      setError(selectedLanguage === "Hindi" ? "गलत ओटीपी। परीक्षण के लिए '1234' का उपयोग करें।" : "Invalid verification code. Enter '1234' to test.");
      return;
    }
    setStep("setup");
  };

  const handleCompleteSetup = () => {
    if (!district.trim()) {
      setError(selectedLanguage === "Hindi" ? "कृपया अपना जिला दर्ज करें!" : "Please enter your district name!");
      return;
    }
    const profile: UserProfile = {
      name: `Rajesh`, // Standard default name for farmer
      phone: phone || "9876543210",
      language: selectedLanguage,
      cropType: crop,
      farmSize: parseFloat(farmSize) || 2.5,
      farmSizeUnit: farmUnit,
      state: farmState,
      district: district,
      temperatureUnit: "C"
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0] dark:bg-[#0F0F10] flex flex-col justify-between p-4 sm:p-6 select-none font-sans transition-colors duration-normal">
      {/* Top Brand Block */}
      <header className="w-full max-w-md mx-auto pt-6 flex flex-col items-center">
        <div className="flex items-center gap-2 text-[#2F7D4E] dark:text-[#4ADE80] mb-2 scale-110">
          <Sprout size={36} className="animate-spin-slow" />
          <h1 className="text-2xl font-bold tracking-tight font-display">{t.appName}</h1>
        </div>
        <p className="text-sm text-[#5A5A5F] dark:text-[#A1A1A6] font-medium text-center">{t.tagline}</p>
      </header>

      {/* Center Dynamic Onboarding Workspace */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        <AnimatePresence mode="wait">
          {step === "language" && (
            <motion.div
              key="language-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-md border border-[#D4CFC7] dark:border-[#2C2C2E]"
            >
              <div className="flex items-center gap-2 text-[#5A5A5F] dark:text-[#F5F5F7] mb-6">
                <Globe size={20} className="text-[#2F7D4E] dark:text-[#4ADE80]" />
                <h2 className="text-lg font-bold">Select App Language / भाषा चुनें</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-btn-${lang.code}`}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setStep("phone");
                    }}
                    className={`h-14 w-full rounded-2xl flex items-center justify-between px-5 font-semibold transition-all duration-fast ${
                      selectedLanguage === lang.code
                        ? "bg-[#2F7D4E] text-white shadow-sm ring-2 ring-[#2F7D4E]/30"
                        : "bg-[#EDE8E0] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-[#D4CFC7]/80 dark:hover:bg-[#3A3A3D]/80"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {selectedLanguage === lang.code && <CheckCircle size={18} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "phone" && (
            <motion.div
              key="phone-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-md border border-[#D4CFC7] dark:border-[#2C2C2E]"
            >
              <h2 className="text-xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-4 flex items-center gap-2">
                <Phone size={20} className="text-[#2F7D4E] dark:text-[#4ADE80]" />
                {t.contPhone}
              </h2>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-base font-semibold text-[#5A5A5F] dark:text-[#8E8E93] border-r border-[#D4CFC7] pr-3 dark:border-[#3A3A3C]">
                      +91
                    </span>
                    <input
                      id="phone-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      placeholder={t.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-14 bg-[#F6F4F0] dark:bg-[#2C2C2E] border border-[#D4CFC7] dark:border-[#3A3A3C] rounded-2xl pl-18 pr-4 text-base font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F7D4E]/30 focus:border-[#2F7D4E] transition-all"
                    />
                  </div>
                  {error && <p className="text-xs font-semibold text-red-500 pl-1" role="alert">{error}</p>}
                </div>

                <button
                  id="send-otp-btn"
                  type="submit"
                  className="w-full h-14 bg-[#2F7D4E] hover:bg-[#256B3F] text-white font-bold rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield size={18} />
                  {t.sendOTP}
                </button>
              </form>

              <div className="relative my-6 flex items-center justify-center">
                <span className="absolute w-full border-t border-[#D4CFC7] dark:border-[#2C2C2E]" />
                <span className="relative bg-white dark:bg-[#1C1C1E] px-3 text-xs text-[#8E8E93] dark:text-[#A1A1A6] font-semibold">OR</span>
              </div>

              <button
                id="google-signin"
                onClick={() => setStep("setup")}
                className="w-full h-12 bg-[#EDE8E0] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-[#D4CFC7] dark:hover:bg-[#3A3A3C] font-semibold rounded-2xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass size={16} />
                {t.continueGoogle}
              </button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-md border border-[#D4CFC7] dark:border-[#2C2C2E]"
            >
              <h2 className="text-xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-2">{t.verifyOTP}</h2>
              <p className="text-xs text-[#5A5A5F] dark:text-[#a1a1a6] leading-relaxed mb-6">
                {t.otpSentMsg} <span className="font-bold text-[#1C1C1E] dark:text-[#F5F5F7] font-mono">+91 {phone}</span>.
                <br />
                <span className="text-[#2F7D4E] dark:text-[#4ADE80] font-bold">Use test OTP: 1234</span>
              </p>

              <form onSubmit={handleOtpVerify} className="space-y-5">
                <div className="space-y-2">
                  <div 
                    className="flex gap-2 justify-center relative select-none cursor-pointer"
                    onClick={() => otpInputRef.current?.focus()}
                  >
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-extrabold font-mono transition-all duration-fast ${
                          otp.length === idx
                            ? "border-[#2F7D4E] bg-white dark:bg-[#2C2C2E] shadow-sm animate-pulse"
                            : otp[idx]
                            ? "border-[#D4CFC7] dark:border-[#3A3A3C] bg-[#EDE8E0] dark:bg-[#2C2C2E] text-[#2F7D4E] dark:text-[#4ADE80]"
                            : "border-[#D4CFC7] dark:border-[#2C2C2E] bg-[#F6F4F0] dark:bg-[#1C1C1E]"
                        }`}
                      >
                        {otp[idx] || ""}
                      </div>
                    ))}
                    <input
                      ref={otpInputRef}
                      id="hidden-otp-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={4}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-transparent border-none outline-none focus:ring-0 z-10 cursor-text"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 font-semibold text-center mt-2" role="alert">{error}</p>}
                </div>

                <button
                  id="confirm-otp-btn"
                  type="submit"
                  className="w-full h-14 bg-[#2F7D4E] hover:bg-[#256B3F] text-white font-bold rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  {t.confirmBtn}
                </button>

                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-xs text-[#8E8E93] font-semibold">
                      {t.resendOTP} <span className="font-bold text-[#1C1C1E] dark:text-[#F5F5F7] font-mono">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      id="resend-otp-btn"
                      type="button"
                      onClick={() => {
                        setTimer(30);
                        setError("");
                      }}
                      className="text-xs font-bold text-[#2F7D4E] dark:text-[#4ADE80] hover:underline"
                    >
                      Resend SMS Code
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {step === "setup" && (
            <motion.div
              key="setup-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-md border border-[#D4CFC7] dark:border-[#2C2C2E] max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-2 flex items-center gap-2">
                <Landmark size={20} className="text-[#2F7D4E] dark:text-[#4ADE80]" />
                {t.onbTitle}
              </h2>
              <p className="text-xs text-[#5A5A5F] dark:text-[#A1A1A6] mb-5 font-semibold">Customize localized agroclimate parameters</p>

              <div className="space-y-4">
                {/* Crop Option */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5A5A5F] dark:text-[#A1A1A6] select-none block">
                    {t.onbCrop}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Cotton", "Tomato", "Wheat", "Soybean", "Sugarcane", "Onion"].map((cOption) => (
                      <button
                        key={cOption}
                        type="button"
                        onClick={() => {
                          setCrop(cOption);
                          // Suggest district by default to save farmers effort
                          if (cOption === "Cotton") setDistrict("Nashik");
                          else if (cOption === "Wheat") setDistrict("Amritsar");
                          else if (cOption === "Soybean") setDistrict("Indore");
                          else if (cOption === "Sugarcane") setDistrict("Mandya");
                        }}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          crop === cOption
                            ? "bg-[#E8F5EC] border-[#2F7D4E] text-[#2F7D4E]"
                            : "bg-[#F6F4F0] dark:bg-[#2C2C2E] border-transparent text-[#1C1C1E] dark:text-[#F5F5F7]"
                        }`}
                      >
                        {cOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Farm Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A5A5F] dark:text-[#A1A1A6] block" htmlFor="farm-size-input">
                      {t.onbSize}
                    </label>
                    <input
                      id="farm-size-input"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      className="w-full h-12 bg-[#F6F4F0] dark:bg-[#2C2C2E] border border-[#D4CFC7] dark:border-[#3A3A3C] rounded-xl px-4 text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F7D4E]/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A5A5F] dark:text-[#A1A1A6] block" htmlFor="farm-unit-select">
                      Unit
                    </label>
                    <select
                      id="farm-unit-select"
                      value={farmUnit}
                      onChange={(e: any) => setFarmUnit(e.target.value)}
                      className="w-full h-12 bg-[#F6F4F0] dark:bg-[#2C2C2E] border border-[#D4CFC7] dark:border-[#3A3A3C] rounded-xl px-4 text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F7D4E]/30"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Bigha">Bigha</option>
                      <option value="Hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                {/* State / Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A5A5F] dark:text-[#A1A1A6] block" htmlFor="farm-state-select">
                      {t.onbState}
                    </label>
                    <select
                      id="farm-state-select"
                      value={farmState}
                      onChange={(e) => {
                        const s = e.target.value;
                        setFarmState(s);
                        // Sensible defaults for states
                        if (s === "Maharashtra") setDistrict("Nashik");
                        else if (s === "Punjab") setDistrict("Amritsar");
                        else if (s === "Gujarat") setDistrict("Gondal");
                        else if (s === "Karnataka") setDistrict("Mandya");
                      }}
                      className="w-full h-12 bg-[#F6F4F0] dark:bg-[#2C2C2E] border border-[#D4CFC7] dark:border-[#3A3A3C] rounded-xl px-4 text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F7D4E]/30"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5A5A5F] dark:text-[#A1A1A6] block" htmlFor="district-input">
                      {t.onbDistrict}
                    </label>
                    <input
                      id="district-input"
                      type="text"
                      placeholder="e.g. Nashik"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-12 bg-[#F6F4F0] dark:bg-[#2C2C2E] border border-[#D4CFC7] dark:border-[#3A3A3C] rounded-xl px-4 text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F7D4E]/30"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-500 font-semibold" role="alert">{error}</p>}

                <button
                  id="complete-onboard-btn"
                  onClick={handleCompleteSetup}
                  className="w-full h-14 bg-[#2F7D4E] hover:bg-[#256B3F] text-white font-bold rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <CheckCircle size={18} />
                  {t.completeOnb}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Credentials */}
      <footer className="w-full border-t border-[#D4CFC7]/50 dark:border-white/10 pt-4 pb-2 text-center text-xs text-[#8E8E93] dark:text-neutral-500 font-medium select-none flex items-center justify-center gap-2">
        <span>Protected and Verified by e-NAM & PM-Kisan Portals</span>
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </footer>
    </div>
  );
}
