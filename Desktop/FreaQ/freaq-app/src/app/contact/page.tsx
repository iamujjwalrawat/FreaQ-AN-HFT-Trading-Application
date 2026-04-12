'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Instagram, Twitter, Linkedin, Building2, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-red/10 rounded-full blur-[100px] pointer-events-none" />
            
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center space-x-3 mb-6">
            <Logo width={48} height={48} />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Freaq <span className="gradient-text">HFT</span>
            </h1>
          </div>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-light">
            Award-winning high-frequency trading infrastructure. Connect with our team to upgrade your trading operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* About / Info Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <div className="glass p-8 space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <Building2 className="text-accent-cyan" /> 
                About Freaq
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Freaq HFT is redefining market accessibility with ultra-low latency infrastructure. Our platform blends Bloomberg-level data density with Apple-inspired architectural design, creating a "Mission Control" experience for elite traders worldwide.
              </p>
            </div>

            <div className="glass p-8 space-y-8">
              <h3 className="text-xl font-semibold border-b border-border pb-4">Global Headquarters</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 glass rounded-lg text-accent-cyan">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">Freaq Capital LLC</h4>
                    <p className="text-text-secondary mt-1">100 Wall Street<br/>New York, NY 10005</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 glass rounded-lg text-accent-cyan">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">Direct Inquiry</h4>
                    <p className="text-text-secondary mt-1">hello@freaq.tech</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Connect With Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="p-3 glass hover:border-accent-cyan hover:text-accent-cyan transition-all rounded-xl group relative overflow-hidden">
                    <Instagram className="w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 bg-accent-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </a>
                  <a href="#" className="p-3 glass hover:border-accent-cyan hover:text-accent-cyan transition-all rounded-xl group relative overflow-hidden">
                    <Twitter className="w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 bg-accent-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </a>
                  <a href="#" className="p-3 glass hover:border-accent-cyan hover:text-accent-cyan transition-all rounded-xl group relative overflow-hidden">
                    <Linkedin className="w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 bg-accent-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass p-8 lg:p-12 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                  <Mail className="text-accent-cyan" />
                  Send us a transmission
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Operation Alias (Name)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Secure Comm Channel (Email)</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Encrypted Payload (Message)</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all outline-none resize-none"
                      placeholder="How can we assist your frequency?"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full relative group overflow-hidden bg-surface-elevated hover:bg-accent-cyan/10 border border-border hover:border-accent-cyan text-text-primary font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 w-0 bg-accent-cyan/20 group-hover:w-full transition-all duration-500 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    {status === 'loading' ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-text-primary" />
                    ) : (
                      <>Initialize Protocol <Send size={18} /></>
                    )}
                  </span>
                </button>

                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green flex items-center gap-3"
                  >
                    <CheckCircle className="shrink-0" />
                    <p className="text-sm">Transmission successful. Our operatives will respond shortly.</p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red flex items-center gap-3"
                  >
                    <AlertCircle className="shrink-0" />
                    <p className="text-sm">Transmission failed. Please check your connection and try again.</p>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
