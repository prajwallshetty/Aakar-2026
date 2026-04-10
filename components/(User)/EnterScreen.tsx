import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function EnterScreen({ onEnter }: { onEnter: () => void }) {
  const [clicked, setClicked] = useState(false);
  const [boom, setBoom] = useState(false);

  const handleClick = () => {
    setClicked(true);
    // After 2 seconds of 'synchronizing', trigger the flash
    setTimeout(() => {
      setBoom(true);
    }, 2000);
    // After flash completes, enter
    setTimeout(() => {
      onEnter();
    }, 2500);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center text-white font-sans select-none">
      
      {/* Dynamic Background Image */}
      <motion.div
        className="absolute inset-0 z-0 origin-center pointer-events-none"
        animate={
          boom 
            ? { scale: 3, filter: "blur(20px) brightness(3)", opacity: 0 } 
            : clicked 
              ? { scale: 1.1, filter: "blur(2px) brightness(1.5)" } 
              : { scale: 1, filter: "blur(6px) brightness(0.4)" }
        }
        transition={{ duration: boom ? 0.5 : 2, ease: "easeInOut" }}
      >
        <img src="/enterscreen.jpg" className="w-full h-full object-cover" alt="Background Space" />
      </motion.div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,transparent_10%,#000_100%)] pointer-events-none opacity-90" />

      {/* Epic Central Geometry / Hologram (Disappears on Boom) */}
      <AnimatePresence>
        {!boom && (
          <motion.div
            className="absolute z-2 flex items-center justify-center pointer-events-none"
            animate={clicked ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "anticipate" }}
          >
            {/* Outer Slow Ring */}
            <motion.div
              className="absolute w-75 h-75 md:w-150 md:h-150 rounded-full border border-white/5 border-t-white/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            {/* Mid Ring */}
            <motion.div
              className="absolute w-55 h-55 md:w-112.5 md:h-112.5 rounded-full border border-blue-500/10 border-b-cyan-400/50"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner Fast Ring */}
            <motion.div
              className="absolute w-37.5 h-37.5 md:w-75 md:h-75 rounded-full border border-dashed border-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Core Ethereal Glow */}
            <motion.div
              className="absolute w-25 h-25 md:w-37.5 md:h-37.5 rounded-full bg-cyan-500/20 blur-2xl md:blur-[60px]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Letterbox Lines (Top & Bottom borders for a movie feel) */}
      <motion.div 
        className="absolute top-12 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent z-5"
        animate={clicked ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute bottom-12 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent z-5"
        animate={clicked ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Supernova Flash (The Transition) */}
      <AnimatePresence>
        {boom && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 30, opacity: 1 }}
            className="absolute z-50 w-32 h-32 bg-white rounded-full mix-blend-screen pointer-events-none blur-[2px]"
            transition={{ duration: 0.5, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      {/* Final Whiteout to cover screen before next component loads */}
      <AnimatePresence>
        {boom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-100 bg-white pointer-events-none"
            transition={{ delay: 0.3, duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* UI Content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence>
          {!clicked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", y: -20 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none"
            >
              {/* Main Logo perfectly centered precisely on the rings */}
              <motion.img 
                src="/aklogo.png" 
                alt="AAKAR Logo"
                className="w-50 sm:w-70 md:w-125 object-contain drop-shadow-2xl opacity-90 transition-all duration-700 pointer-events-auto"
                style={{ filter: "drop-shadow(0 0 24px rgba(255,255,255,0.25))" }}
              />
              
              <p className="absolute bottom-[28%] md:bottom-[22%] tracking-[0.4em] md:tracking-[0.6em] text-cyan-200/60 text-[10px] md:text-sm font-light uppercase drop-shadow-md pointer-events-auto px-4 text-center w-full">
                The Universe Awaits
              </p>

              {/* Minimalist Glass Button - Pinned gracefully near bottom */}
              <div className="absolute bottom-16 md:bottom-24 w-full flex justify-center pointer-events-auto px-4">
                <motion.button
                  onClick={handleClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative px-6 py-3 md:px-12 md:py-5 overflow-hidden rounded-sm bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-500"
                >
                  {/* Button Glow on Hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Tech Corners */}
                  <div className="absolute top-0 left-0 w-3 h-px bg-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute top-0 left-0 w-px h-3 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-px bg-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute bottom-0 right-0 w-px h-3 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  <span className="relative z-10 tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs font-semibold uppercase text-gray-300 group-hover:text-white transition-colors duration-300 drop-shadow-md">
                    Initiate Sequence
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transitioning / Synchronizing State */}
        <AnimatePresence>
          {clicked && !boom && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="absolute flex flex-col items-center"
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-xl md:text-3xl tracking-[0.5em] font-light uppercase text-cyan-100 shadow-cyan-500 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
              >
                Synchronizing
              </motion.div>
              
              {/* Sci-Fi Loading Dots/Bars */}
              <div className="mt-8 flex gap-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-12 h-px bg-cyan-200"
                    initial={{ opacity: 0.1, scaleX: 0 }}
                    animate={{ opacity: [0.1, 1, 0.1], scaleX: [0, 1, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}