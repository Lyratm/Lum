import React from 'react';
import { motion } from 'motion/react';
import { LogoPrincipalAnimated } from './LogoPrincipalAnimated';
import { getBrowserLanguage, TRANSLATIONS } from '../utils/i18n';

const LoadingScreen: React.FC = () => {
  const lang = getBrowserLanguage();
  const localizedAmoledText = TRANSLATIONS[lang]?.amoledOptimization || "Optimisation AMOLED";

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,35,234,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <div className="w-[109px] p-2 relative group">
          {/* Animated rings around the logo */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] rounded-full border border-white/5 border-t-[#9B23EA]/30 border-r-[#9B23EA]/10"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border border-white/5 border-b-[#9B23EA]/20 border-l-[#9B23EA]/5"
          />
          
          <LogoPrincipalAnimated 
            className="w-full h-auto relative z-10 filter brightness-110 contrast-110 drop-shadow-[0_0_20px_rgba(155,35,234,0.3)]"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl font-bold font-display tracking-[0.2em] text-white/90 uppercase"
          >
            Lum
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "circIn" }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-[#9B23EA]/50 to-transparent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-light"
          >
            Always On Identity
          </motion.p>
        </div>
      </motion.div>

      {/* Subtle loader footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 flex items-center gap-3"
      >
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{localizedAmoledText}</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-1 h-1 rounded-full bg-[#9B23EA]/40"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
