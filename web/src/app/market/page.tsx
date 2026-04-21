'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Star,
  Package,
  X,
  ChevronRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Camera
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const products = [
  { id: 1, name: 'Premium Organic Seeds', price: '₹450', unit: 'per kg', category: 'Seeds', rating: 4.8, image: '🌱', seller: 'Krishi Store', desc: 'High-yield organic seeds treated with natural bio-stimulants. Ideal for summer sowing.' },
  { id: 2, name: 'Natural Fertilizer', price: '₹890', unit: 'per 5L', category: 'Fertilizers', rating: 4.5, image: '🧪', seller: 'EcoFarm', desc: 'Cold-pressed seaweed extract enriched with micro-nutrients. Promotes healthy root development.' },
  { id: 3, name: 'Smart Drip Kit', price: '₹2,400', unit: 'set', category: 'Tools', rating: 4.9, image: '💧', seller: 'TechAgri', desc: 'Precision irrigation kit with automated valves and moisture sensors integration.' },
  { id: 4, name: 'Neem Oil Spray', price: '₹320', unit: '500ml', category: 'Pest Control', rating: 4.2, image: '🌿', seller: 'NatureGuard', desc: '100% cold-pressed neem oil. Natural pest repellent for organic farming.' },
];

import { staggerContainer, staggerItem, cardHover } from '@/lib/animations';

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{product: typeof products[0], count: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const filteredProducts = activeTab === 'buy' 
    ? products.filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    : [];

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, count: item.count + 1 } : item);
      }
      return [...prev, { product, count: 1 }];
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = parseInt(item.product.price.replace(/[₹,]/g, ''));
    return acc + (price * item.count);
  }, 0);

  return (
    <div className="py-6 space-y-10 pb-32 max-w-5xl mx-auto px-4 overflow-x-hidden">
      {/* Header & Toggle */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-display font-medium text-brown font-serif tracking-tight">Marketplace</h1>
            <p className="text-lg text-brown-muted font-medium">Find quality inputs or sell your fresh produce.</p>
          </div>
          
          <div className="flex bg-card p-1.5 rounded-pill w-fit border border-brown-muted/10 shadow-premium self-start sm:self-auto">
            <button 
              onClick={() => setActiveTab('buy')}
              className={cn(
                "px-6 sm:px-8 py-2.5 rounded-pill text-sm font-bold transition-all relative overflow-hidden",
                activeTab === 'buy' ? "text-white" : "text-brown-muted hover:text-brown"
              )}
            >
              {activeTab === 'buy' && (
                <motion.div layoutId="marketTab" className="absolute inset-0 bg-primary shadow-md" transition={{ type: 'spring', bounce: 0, duration: 0.4 }} />
              )}
              <span className="relative z-10">Buy Inputs</span>
            </button>
            <button 
              onClick={() => setActiveTab('sell')}
              className={cn(
                "px-6 sm:px-8 py-2.5 rounded-pill text-sm font-bold transition-all relative overflow-hidden",
                activeTab === 'sell' ? "text-white" : "text-brown-muted hover:text-brown"
              )}
            >
              {activeTab === 'sell' && (
                <motion.div layoutId="marketTab" className="absolute inset-0 bg-primary shadow-md" transition={{ type: 'spring', bounce: 0, duration: 0.4 }} />
              )}
              <span className="relative z-10">Sell Produce</span>
            </button>
          </div>
        </div>

        <div className="relative group shadow-premium rounded-pill overflow-hidden">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brown-muted group-focus-within:text-primary transition-colors" size={24} />
          <input 
            placeholder="Search seeds, tools, or machinery..."
            className="w-full pl-16 pr-6 h-14 sm:h-16 bg-card border border-card focus:bg-sand rounded-pill shadow-inner focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50 transition-all text-base sm:text-lg font-medium text-brown placeholder:text-brown-muted"
          />
        </div>
      </section>

      {activeTab === 'buy' ? (
        <div className="space-y-10">
          {/* Categories */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-brown-muted uppercase tracking-widest ml-1">Categories</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-fade-right">
              {['All', 'Seeds', 'Fertilizers', 'Tools', 'Irrigation'].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-6 py-3 rounded-pill text-sm font-bold border transition-all shadow-sm",
                    selectedCategory === cat 
                      ? "bg-brown text-sand border-brown" 
                      : "bg-card text-brown border-brown-muted/10 hover:border-primary/30"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Product Grid */}
          <motion.section 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  layoutId={`product-${product.id}`}
                  onClick={() => setSelectedProduct(product)}
                  className="cursor-pointer"
                >
                  <Card className="p-0 overflow-hidden group shadow-premium hover:shadow-lift transition-all duration-500 rounded-[32px]">
                    <div className="aspect-[4/3] bg-sand flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-700">
                      {product.image}
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-lg border border-primary/10">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-clay font-bold text-sm">
                          <Star size={14} fill="currentColor" />
                          {product.rating}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-brown text-xl leading-tight mb-1">
                          {product.name}
                        </h4>
                        <p className="text-sm text-brown-muted font-medium">by {product.seller}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-brown-muted/10">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-brown">{product.price}</span>
                          <span className="text-[10px] text-brown-muted font-bold uppercase tracking-widest">{product.unit}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-12 h-12 p-0 rounded-full bg-primary hover:bg-primary-hover transition-colors shadow-lift text-white"
                        >
                          <Plus size={24} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center mx-auto text-brown-muted">
                  <Package size={40} />
                </div>
                <p className="text-xl text-brown-muted font-medium">No products found in this category.</p>
              </div>
            )}
          </motion.section>
        </div>
      ) : (
        /* Sell Mode */
        <section className="max-w-2xl mx-auto space-y-10">
          <motion.div variants={staggerItem} initial="initial" animate="animate">
            <Card className="bg-primary text-white border-0 shadow-premium p-8 overflow-hidden relative rounded-[40px] group">
              <TrendingUp className="absolute -bottom-8 -right-8 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl font-serif font-medium leading-tight">Connect directly with wholesalers.</h2>
                <p className="text-primary-50 text-xl opacity-90 max-w-md font-medium">List your harvest and get fair prices from verified institutional buyers.</p>
                <Button 
                  onClick={() => setIsSellModalOpen(true)}
                  className="bg-sand text-primary hover:bg-white px-8 py-6 rounded-pill h-auto font-bold text-lg shadow-lift transition-all"
                >
                  Create New Listing
                </Button>
              </div>
            </Card>
          </motion.div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-brown-muted uppercase tracking-widest ml-1 px-1">Your Inventory</h3>
            <div className="space-y-4">
              {[
                { name: 'Thompson Grapes', qty: '500 kg', status: 'Active', views: 24, price: '₹85/kg', img: '🍇' },
                { name: 'Roma Tomatoes', qty: '200 kg', status: 'Reviewing', views: 0, price: '₹45/kg', img: '🍅' }
              ].map((item, i) => (
                <motion.div key={i} variants={staggerItem} initial="initial" animate="animate" transition={{ delay: i * 0.1 }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-card border border-brown-muted/10 rounded-[32px] shadow-sm hover:shadow-premium transition-all cursor-pointer group gap-4">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-sand rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {item.img}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-brown leading-tight">{item.name}</h4>
                        <p className="text-base text-brown-muted font-medium">{item.qty} • <span className={cn("font-bold", item.status === 'Active' ? "text-primary" : "text-clay")}>{item.status}</span></p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-brown-muted/10 gap-1">
                      <span className="text-2xl font-black text-brown">{item.price}</span>
                      <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{item.views} views</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-brown/40 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, bounce: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-sand z-[70] rounded-t-[48px] shadow-2xl overflow-hidden max-h-[95vh]"
            >
              <div className="p-6 sm:p-10 pb-12 space-y-8 max-w-4xl mx-auto overflow-y-auto">
                <div className="flex justify-center -mt-2">
                  <div className="w-12 h-1.5 bg-brown-muted/20 rounded-full" />
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
                  <div className="w-full md:w-80 aspect-square bg-card rounded-[40px] flex items-center justify-center text-8xl sm:text-9xl shadow-inner border border-brown-muted/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse" />
                    <span className="relative z-10">{selectedProduct.image}</span>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary-50 border border-primary/10 px-4 py-1.5 rounded-pill">
                          {selectedProduct.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-clay font-bold">
                          <Star size={18} fill="currentColor" />
                          {selectedProduct.rating}
                        </div>
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-medium font-serif text-brown leading-[1.1]">
                        {selectedProduct.name}
                      </h2>
                      <div className="flex items-center gap-2 text-brown-muted font-medium text-lg">
                        <MapPin size={20} className="text-primary" />
                        Available at {selectedProduct.seller} • 2.4km away
                      </div>
                    </div>

                    <p className="text-xl text-brown-muted font-medium leading-relaxed">
                      {selectedProduct.desc}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 py-8 border-y border-brown-muted/10">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-brown-muted uppercase tracking-[0.2em]">Current Price</span>
                        <span className="text-4xl font-black text-brown">{selectedProduct.price} <span className="text-xl text-brown-muted font-medium">/{selectedProduct.unit.replace('per ', '')}</span></span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-brown-muted uppercase tracking-[0.2em]">Vendor Trust</span>
                        <div className="flex items-center gap-2 text-primary font-bold text-xl">
                          <ShieldCheck size={24} />
                          Verified Partner
                        </div>
                      </div>
                    </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button 
                          onClick={() => {
                            addToCart(selectedProduct);
                            setSelectedProduct(null);
                            setIsCartOpen(true);
                          }}
                          className="flex-1 py-7 rounded-[32px] text-xl font-bold gap-3 shadow-lift bg-primary hover:bg-primary-hover text-white transition-all"
                        >
                          <ShoppingCart size={24} />
                          Add to Cart
                        </Button>
                        <Button variant="outline" className="px-10 py-7 rounded-[32px] border-2 border-primary/20 text-primary hover:bg-primary-50 transition-all font-bold text-xl">
                          Inquiry
                        </Button>
                      </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

       <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-28 right-6 w-20 h-20 bg-brown text-sand rounded-[24px] shadow-premium flex flex-col items-center justify-center z-40 border-4 border-sand group"
      >
        <div className="relative">
          <ShoppingCart size={32} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-clay text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-sand">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Cart</span>
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brown/40 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, bounce: 0 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-sand z-[90] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-brown-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-medium text-brown">Your Cart</h2>
                    <p className="text-sm text-brown-muted font-medium">{cartCount} items selected</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-12 h-12 rounded-full hover:bg-card flex items-center justify-center text-brown-muted transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length > 0 ? (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-card rounded-2xl border border-brown-muted/5 group">
                      <div className="w-20 h-20 bg-sand rounded-xl flex items-center justify-center text-4xl shrink-0">
                        {item.product.image}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-bold text-brown truncate">{item.product.name}</h4>
                        <p className="text-xs text-brown-muted mb-2">{item.product.seller}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-brown">{item.product.price}</span>
                          <div className="flex items-center gap-3 bg-sand px-3 py-1 rounded-pill">
                            <button 
                              onClick={() => {
                                setCart(prev => prev.map(it => it.product.id === item.product.id ? { ...it, count: Math.max(0, it.count - 1) } : it).filter(it => it.count > 0));
                              }}
                              className="text-brown-muted hover:text-brown font-black"
                            >-</button>
                            <span className="text-sm font-black text-brown w-4 text-center">{item.count}</span>
                            <button 
                              onClick={() => {
                                addToCart(item.product);
                              }}
                              className="text-brown-muted hover:text-brown font-black"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center text-brown-muted">
                      <ShoppingCart size={40} />
                    </div>
                    <p className="text-xl text-brown-muted font-medium">Your cart is empty.</p>
                    <Button onClick={() => setIsCartOpen(false)} variant="ghost" className="text-primary font-bold">
                      Start Shopping
                    </Button>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-card border-t border-brown-muted/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-brown-muted font-medium">Subtotal</span>
                    <span className="text-3xl font-black text-brown">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <Button className="w-full py-7 rounded-[28px] text-xl font-bold bg-primary hover:bg-primary-hover text-white shadow-lift transition-all">
                    Checkout Now
                  </Button>
                  <p className="text-center text-xs text-brown-muted font-medium italic">
                    Free doorstep delivery for verified farmers.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sell Listing Modal */}
      <AnimatePresence>
        {isSellModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSellModalOpen(false)}
              className="fixed inset-0 bg-brown/40 backdrop-blur-md z-[70]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-sand rounded-t-[40px] z-[80] overflow-hidden max-h-[90vh] shadow-2xl border-t border-white/20"
            >
               <div className="p-8 pb-32 space-y-8 overflow-y-auto max-h-[90vh]">
                  <header className="flex items-center justify-between">
                     <h2 className="text-3xl font-serif font-medium text-brown">Create New Listing</h2>
                     <button onClick={() => setIsSellModalOpen(false)} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brown shadow-sm">
                        <X size={24} />
                     </button>
                  </header>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="aspect-square bg-card border-2 border-dashed border-brown-muted/20 rounded-[32px] flex flex-col items-center justify-center text-brown-muted gap-4 group hover:border-primary/50 transition-all cursor-pointer">
                           <Camera size={48} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                           <p className="font-bold">Tap to upload produce image</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-4">
                           <label className="text-xs font-bold text-brown-muted uppercase tracking-widest ml-1">Produce Name</label>
                           <input placeholder="e.g. Alphonso Mangoes" className="w-full h-14 bg-white border border-brown-muted/10 rounded-2xl px-6 font-bold text-brown outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary/20 transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-4">
                              <label className="text-xs font-bold text-brown-muted uppercase tracking-widest ml-1">Total Quantity</label>
                              <div className="relative">
                                 <input placeholder="500" className="w-full h-14 bg-white border border-brown-muted/10 rounded-2xl px-6 font-bold text-brown outline-none focus:ring-4 focus:ring-primary-50" />
                                 <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-brown-muted">Kg</span>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-xs font-bold text-brown-muted uppercase tracking-widest ml-1">Asking Price</label>
                              <div className="relative">
                                 <input placeholder="85" className="w-full h-14 bg-white border border-brown-muted/10 rounded-2xl px-6 font-bold text-brown outline-none focus:ring-4 focus:ring-primary-50" />
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brown-muted">₹</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
                           <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                              <TrendingUp size={16} />
                              AI Recommended Price
                           </div>
                           <p className="text-2xl font-black text-brown">₹78 - ₹92 <span className="text-sm font-medium text-brown-muted">per kg</span></p>
                           <p className="text-xs text-brown-muted font-medium">Based on current market demand in Mumbai & Nashik.</p>
                        </div>

                        <Button className="w-full h-16 text-lg font-bold rounded-pill bg-primary hover:bg-primary-hover text-white shadow-premium">
                           Publish Listing
                        </Button>
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
