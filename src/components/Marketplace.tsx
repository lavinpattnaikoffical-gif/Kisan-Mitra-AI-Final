/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Store, 
  Tag, 
  Trash2, 
  ShoppingBag, 
  CheckCircle, 
  Share2, 
  ChevronRight, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  MapPin,
  Flame,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, MarketProduct, MandiRate } from "../types";
import { TRANSLATIONS, LanguageCode } from "../translations";

interface MarketplaceProps {
  profile: UserProfile;
  selectedLanguage: LanguageCode;
  onNavigateTab: (tab: any) => void;
  products: MarketProduct[];
  userListings: any[];
  onAddListing: (listing: any) => void;
}

export default function Marketplace({
  profile,
  selectedLanguage,
  onNavigateTab,
  products,
  userListings,
  onAddListing
}: MarketplaceProps) {
  const t = TRANSLATIONS[selectedLanguage];

  const [activeSegment, setActiveSegment] = useState<"buy" | "sell" | "rates">("rates");
  const [mandiState, setMandiState] = useState(profile.state);
  const [mandiRates, setMandiRates] = useState<MandiRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);

  // Cart system
  const [cart, setCart] = useState<{ product: MarketProduct; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Listing fields
  const [selectedCrop, setSelectedCrop] = useState("Cotton");
  const [commodityWeight, setCommodityWeight] = useState("20");
  const [askingPrice, setAskingPrice] = useState("6500");
  const [selectedQuality, setSelectedQuality] = useState<"A" | "B" | "C">("A");
  const [listingSuccess, setListingSuccess] = useState(false);

  // Fetch Mandi Rates Based on State Selection
  const fetchRates = async (stateVal: string) => {
    setRatesLoading(true);
    try {
      const response = await fetch(`/api/mandi-rates?state=${encodeURIComponent(stateVal)}`);
      const body = await response.json();
      setMandiRates(body.rates || []);
    } catch (err) {
      console.warn("Unable to get real rates:", err);
      // fallback rates
      setMandiRates([
        { crop: "Cotton", price: 6850, prevPrice: 6710, unit: "Qtl", arrivals: "Medium", quality: "A", lastUpdated: "Today", aiSuggestedRange: { min: 6900, max: 7300 }, source: "Mandi" },
        { crop: "Wheat", price: 2275, prevPrice: 2250, unit: "Qtl", arrivals: "High", quality: "A", lastUpdated: "Today", aiSuggestedRange: { min: 2310, max: 2400 }, source: "Mandi" },
      ]);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(mandiState);
  }, [mandiState]);

  // Handle Cart Operations
  const addToCart = (product: MarketProduct) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (pId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== pId));
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setCart([]);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setCartOpen(false);
    }, 4500);
  };

  // List product
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodityWeight || !askingPrice) return;

    const newPr = {
      id: `user-list-${Date.now()}`,
      crop: selectedCrop,
      weight: parseFloat(commodityWeight),
      price: parseFloat(askingPrice),
      quality: selectedQuality,
      location: `${profile.district}, ${mandiState}`,
      timestamp: "Just now",
      isSold: false
    };

    onAddListing(newPr);
    setListingSuccess(true);
    setCommodityWeight("");
    setTimeout(() => setListingSuccess(false), 3000);
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => {
      const actualPrice = item.product.price;
      return acc + (actualPrice * item.quantity);
    }, 0);
  };

  // Mandi Rate helper lookup
  const cropPriceFactor = mandiRates.find(r => r.crop === selectedCrop);

  return (
    <div className="space-y-6 select-none font-sans relative">
      {/* 🧭 Horizontal segment switches */}
      <div className="flex border-b border-[#D4CFC7] dark:border-[#2C2C2E] select-none gap-4">
        {[
          { id: "rates", label: t.liveMandiRates, icon: TrendingUp },
          { id: "buy", label: t.buyInputs, icon: ShoppingBag },
          { id: "sell", label: t.sellProduce, icon: Tag }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`mkt-segment-btn-${tab.id}`}
            onClick={() => setActiveSegment(tab.id as any)}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeSegment === tab.id
                ? "border-[#2F7D4E] text-[#2F7D4E] dark:text-[#4ADE80]"
                : "border-transparent text-[#5A5A5F] dark:text-[#A1A1A6] hover:text-[#1C1C1E]"
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Segment 1 — Mandi rates list */}
      <AnimatePresence mode="wait">
        {activeSegment === "rates" && (
          <motion.div
            key="rates-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Rates State drop control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-4 shadow-xs">
              <div className="flex items-center gap-1.5">
                <Globe size={18} className="text-[#2F7D4E]" />
                <span className="text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">{t.selectState}:</span>
                <select
                  id="mandi-state-select"
                  value={mandiState}
                  onChange={(e) => setMandiState(e.target.value)}
                  className="bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-widest">Powered by Agmarknet portal sync</span>
            </div>

            {/* Rates Grid */}
            {ratesLoading ? (
              <div className="text-center py-12 bg-white dark:bg-[#1C1C1E] rounded-3xl border border-[#D4CFC7] dark:border-[#2C2C2E]">
                <div className="w-8 h-8 border-4 border-[#2F7D4E] border-t-transparent rounded-full animate-spin mx-auto pb-2" />
                <p className="text-xs text-[#8E8E93] font-bold mt-2">Loading live market intelligence rates...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mandiRates.map((rate, idx) => {
                  const priceDiff = rate.price - rate.prevPrice;
                  const isUp = priceDiff >= 0;
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-xs flex justify-between gap-4"
                    >
                      <div className="space-y-3 flex-1">
                        <div>
                          <span className="text-[10px] font-extrabold text-orange-700 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">{rate.arrivals}</span>
                          <h4 className="text-base font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] mt-1">{rate.crop}</h4>
                        </div>

                        {/* Current Price and indicator */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold font-mono text-[#1C1C1E] dark:text-[#F5F5F7]">₹{rate.price}</span>
                          <span className="text-[10px] font-semibold text-[#8E8E93]">per {rate.unit}</span>
                          
                          <span className={`text-xs font-bold flex items-center ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
                            {isUp ? "▲" : "▼"} ₹{Math.abs(priceDiff)}
                          </span>
                        </div>

                        <div className="bg-[#E8F5EC] dark:bg-[#153B22]/10 p-3 rounded-2xl border border-[#2F7D4E]/20 space-y-0.5">
                          <span className="text-[10px] font-extrabold text-[#2F7D4E] dark:text-[#4ADE80] uppercase tracking-wide flex items-center gap-1">
                            <Sparkles size={11} /> {t.suggestedAiPrice}
                          </span>
                          <p className="text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">₹{rate.aiSuggestedRange.min} - ₹{rate.aiSuggestedRange.max}</p>
                          <p className="text-[9px] text-[#8E8E93] font-medium leading-tight">Optimized for A-Grade moisture index</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end text-right">
                        <div>
                          <p className="text-[10px] text-[#8E8E93] font-bold">Mandi Grade</p>
                          <p className="text-sm font-extrabold text-[#2F7D4E] dark:text-[#4ADE80] font-mono">{rate.quality}-Grade</p>
                        </div>
                        <span className="text-[9px] font-semibold text-[#8E8E93] leading-none">eNAM Live</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Segment 2 — Buy Farming inputs */}
        {activeSegment === "buy" && (
          <motion.div
            key="buy-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Subsidy Info Callout Banner */}
            <div className="bg-emerald-50 dark:bg-[#153B22]/15 border border-[#2F7D4E]/30 p-4 rounded-3xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#2F7D4E] dark:text-[#4ADE80] flex items-center gap-1">
                  <Flame size={14} className="animate-pulse" />
                  PM-Kisan Input Subsidies Activated
                </h4>
                <p className="text-xs text-[#5A5A5F] dark:text-[#A1A1A6] font-semibold">
                  Govt. subsidized inputs listed below are verified under PM-KVK direct-benefit guidelines.
                </p>
              </div>

              {/* Cart Drawer activator widget */}
              <button
                id="cart-toggle-btn"
                onClick={() => setCartOpen(true)}
                className="relative bg-[#2F7D4E] text-white flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold focus:outline-none cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>{cart.length} Products</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Products catalog list with subsidy percentages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-4 shadow-sm flex flex-col justify-between hover:border-[#2F7D4E]/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-[#F6F4F0]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover pointer-events-none" />
                      {item.subsidyPercent && (
                        <span className="absolute top-2 left-2 bg-orange-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                          {t.governmentSubsidy} {item.subsidyPercent}%
                        </span>
                      )}
                      {item.isVerified && (
                        <span className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm shadow-xs select-none">Govt. Certified</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[9px] font-extrabold text-[#8E8E93] uppercase tracking-widest">{item.category}</span>
                      <h4 className="text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mt-0.5 line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-[#8E8E93] font-semibold mt-0.5">Seller: {item.seller} · Nashik Depot</p>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold font-mono text-[#10B981] dark:text-emerald-400">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-[#8E8E93] line-through font-mono">₹{item.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <button
                    id={`add-to-cart-btn-${item.id}`}
                    onClick={() => addToCart(item)}
                    className="w-full h-10 mt-3 bg-[#EDE8E0] hover:bg-[#D4CFC7] dark:bg-[#2C2C2E] dark:hover:bg-[#3A3A3C] text-[#1C1C1E] dark:text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={13} />
                    <span>{t.buyNow}</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Segment 3 — Sell produce form */}
        {activeSegment === "sell" && (
          <motion.div
            key="sell-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Listing Creator Form - 5 cols */}
            <form onSubmit={handleCreateListing} className="lg:col-span-5 bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] uppercase tracking-wider">{t.sellProduce}</h3>

              <div className="space-y-4">
                {/* Crop selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider" htmlFor="crop-sell-select">{t.cropToSell}</label>
                  <select
                    id="crop-sell-select"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
                  >
                    <option value="Cotton">Cotton / कपास</option>
                    <option value="Soybean">Soybean / सोयाबीन</option>
                    <option value="Wheat">Wheat / गेहूं</option>
                    <option value="Paddy">Rice Paddy / धान</option>
                    <option value="Onion">Onion / प्याज</option>
                    <option value="Tomato">Tomato / टमाटर</option>
                  </select>
                </div>

                {/* Weight Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider" htmlFor="weight-input">{t.addWeight}</label>
                  <input
                    id="weight-input"
                    type="number"
                    required
                    placeholder="e.g. 25"
                    value={commodityWeight}
                    onChange={(e) => setCommodityWeight(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] text-xs font-bold border border-[#D4CFC7] dark:border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
                  />
                </div>

                {/* Asking Target Price Input with currency fix (pl-12) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider" htmlFor="price-input">{t.askingPrice}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E93]">₹</span>
                    <input
                      id="price-input"
                      type="number"
                      required
                      placeholder="e.g. 6800"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-11 bg-[#F6F4F0] dark:bg-[#2C2C2E] border border-[#D4CFC7] dark:border-white/10 rounded-xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2F7D4E]"
                    />
                  </div>
                  <p className="text-[10px] text-[#8E8E93] font-semibold mt-0.5">{t.fixedPaddingFix}</p>
                </div>

                {/* Quality options */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider">Quality Grade (Moisture verified)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["A", "B", "C"].map((grade) => (
                      <button
                        key={grade}
                        id={`grade-btn-${grade}`}
                        type="button"
                        onClick={() => setSelectedQuality(grade as any)}
                        className={`py-2 text-xs font-bold rounded-xl border ${
                          selectedQuality === grade
                            ? "bg-[#E8F5EC] border-[#2F7D4E] text-[#2F7D4E]"
                            : "bg-[#F6F4F0] border-transparent dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F5F5F7]"
                        }`}
                      >
                        {grade}-Grade
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI pricing helper box */}
                {cropPriceFactor && (
                  <div className="bg-[#E8F5EC] dark:bg-[#153B22]/10 p-3 rounded-2xl border border-[#2F7D4E]/20 space-y-1 select-none">
                    <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#2F7D4E] dark:text-[#4ADE80] uppercase">
                      <Sparkles size={12} /> Target suggestions
                    </div>
                    <p className="text-xs font-semibold text-[#5A5A5F] dark:text-[#A1A1A6]">
                      Current Mandi: <span className="font-bold text-[#1C1C1E] dark:text-white">₹{cropPriceFactor.price}/qtl</span>
                    </p>
                    <p className="text-xs font-semibold text-[#5A5A5F] dark:text-[#A1A1A6]">
                      FPO AI target recommendation: <span className="font-bold text-emerald-600">₹{cropPriceFactor.aiSuggestedRange.min} - ₹{cropPriceFactor.aiSuggestedRange.max}</span>
                    </p>
                  </div>
                )}

                <button
                  id="list-produce-btn"
                  type="submit"
                  className="w-full h-11 bg-[#2F7D4E] hover:bg-[#256B3F] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {t.listProduceBtn}
                </button>
              </div>

              {listingSuccess && (
                <div className="text-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-xs text-emerald-800 font-bold">✓ Listing published live to local buyers and FPOs!</p>
                </div>
              )}
            </form>

            {/* Active Listings list - 7 cols */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1C1C1E] border border-[#D4CFC7] dark:border-[#2C2C2E] rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] uppercase tracking-wider">{t.myActiveListings}</h3>

              <div className="space-y-3 max-h-[360px] overflow-y-auto">
                {userListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Store className="text-[#8E8E93] mx-auto pb-2" size={28} />
                    <p className="text-xs text-[#8E8E93] font-bold">No active produce listings found.</p>
                  </div>
                ) : (
                  userListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="p-4 bg-[#F6F4F0]/60 dark:bg-[#121214] border border-[#D4CFC7]/40 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-[#2F7D4E] bg-[#E8F5EC] dark:bg-[#153B22]/10 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                            {listing.crop}
                          </span>
                          <span className="text-[10px] font-bold text-[#8E8E93]">{listing.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">{listing.weight} Quintals · {listing.quality}-Grade</h4>
                        <p className="text-xs font-extrabold text-emerald-600">Asking target: ₹{listing.price}/qtl</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id={`whatsapp-btn-${listing.id}`}
                          onClick={() => {
                            // Mock sharing details
                            navigator.clipboard.writeText(`Selling cotton: ${listing.weight} Qtl, target ${listing.price}/qtl. Location: ${listing.location}`);
                            alert("Listing copied to clipboard! Ready to share directly via WhatsApp.");
                          }}
                          className="flex items-center gap-1 px-3 py-2 border border-[#D4CFC7] dark:border-white/10 rounded-xl text-xs font-bold text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition-all cursor-pointer"
                        >
                          <Share2 size={13} />
                          <span>{t.whatsappShare}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛒 Shopping Cart drawer bottom sheet */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex justify-end select-none"
          >
            <motion.div
              key="cart-drawer-content"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-sm bg-white dark:bg-[#1C1C1E] h-full shadow-2xl p-5 flex flex-col justify-between"
            >
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#D4CFC7]/40 pb-3">
                  <h4 className="text-base font-extrabold text-[#1C1C1E] dark:text-[#F5F5F7] uppercase tracking-wide flex items-center gap-1.5">
                    <ShoppingBag size={18} className="text-[#2F7D4E]" />
                    {t.cartTitle}
                  </h4>
                  <button
                    id="close-cart-btn"
                    onClick={() => setCartOpen(false)}
                    className="text-xs font-extrabold text-[#8E8E93] hover:text-[#1C1C1E]"
                  >
                    Close
                  </button>
                </div>

                {checkoutSuccess ? (
                  <div className="py-12 text-center space-y-3">
                    <CheckCircle className="text-emerald-500 w-12 h-12 mx-auto animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#1C1C1E] dark:text-white">Order Placed Successfully!</h4>
                      <p className="text-xs text-[#8E8E93] leading-relaxed max-w-xs mx-auto">{t.orderSavedSuccess}</p>
                    </div>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-16 space-y-2">
                    <ShoppingBag className="text-[#8E8E93] mx-auto pb-1" size={32} />
                    <p className="text-xs text-[#8E8E93] font-bold">{t.emptyCart}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 bg-[#F6F4F0]/40 dark:bg-[#121214] border border-[#D4CFC7]/30 dark:border-white/5 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7] truncate">{item.product.name}</h5>
                          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">₹{item.product.price} · Qty: {item.quantity}</p>
                        </div>
                        <button
                          id={`remove-cart-item-btn-${item.product.id}`}
                          aria-label="Remove item"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!checkoutSuccess && cart.length > 0 && (
                <div className="border-t border-[#D4CFC7]/40 dark:border-white/10 pt-4 space-y-4">
                  <div className="flex justify-between text-xs font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">
                    <span>Invoice Subtotal:</span>
                    <span className="font-mono text-base text-[#2F7D4E]">₹{calculateSubtotal()}</span>
                  </div>

                  <button
                    id="checkout-cart-btn"
                    onClick={handleCheckout}
                    className="w-full h-12 bg-[#2F7D4E] hover:bg-[#256B3F] text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{t.processPayment}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
