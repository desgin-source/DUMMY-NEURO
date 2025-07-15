import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';

interface AvatarState {
  isListening: boolean;
  isResponding: boolean;
  isIdle: boolean;
}

export default function VoiceCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isListening: false,
    isResponding: false,
    isIdle: true
  });

  const avatarRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);

  // Avatar animations
  useEffect(() => {
    if (!avatarRef.current) return;

    // Idle breathing animation
    const idleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    idleAnimation.to(avatarRef.current, {
      scale: 1.02,
      duration: 2,
      ease: "power2.inOut"
    });

    // Eye blink animation
    if (eyesRef.current) {
      gsap.to(eyesRef.current, {
        scaleY: 0.1,
        duration: 0.1,
        repeat: -1,
        repeatDelay: 3,
        yoyo: true
      });
    }

    return () => {
      idleAnimation.kill();
    };
  }, []);

  // Listening state animation
  useEffect(() => {
    if (!glowRingRef.current) return;

    if (avatarState.isListening) {
      gsap.to(glowRingRef.current, {
        scale: 1.2,
        opacity: 0.8,
        duration: 0.5,
        ease: "power2.out"
      });
    } else {
      gsap.to(glowRingRef.current, {
        scale: 1,
        opacity: 0.3,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, [avatarState.isListening]);

  // Responding state animation
  useEffect(() => {
    if (!waveformRef.current) return;

    if (avatarState.isResponding) {
      const bars = waveformRef.current.children;
      Array.from(bars).forEach((bar, index) => {
        gsap.to(bar, {
          scaleY: Math.random() * 2 + 0.5,
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          delay: index * 0.1
        });
      });
    } else {
      const bars = waveformRef.current.children;
      Array.from(bars).forEach((bar) => {
        gsap.to(bar, {
          scaleY: 0.2,
          duration: 0.3
        });
      });
    }
  }, [avatarState.isResponding]);

  const startCall = () => {
    setIsCallActive(true);
    setAvatarState({ isListening: false, isResponding: false, isIdle: true });
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsMicOn(false);
    setIsCameraOn(false);
    setAvatarState({ isListening: false, isResponding: false, isIdle: true });
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (!isMicOn) {
      setAvatarState({ isListening: true, isResponding: false, isIdle: false });
      // Simulate response after 3 seconds
      setTimeout(() => {
        setAvatarState({ isListening: false, isResponding: true, isIdle: false });
        setTimeout(() => {
          setAvatarState({ isListening: false, isResponding: false, isIdle: true });
        }, 4000);
      }, 3000);
    } else {
      setAvatarState({ isListening: false, isResponding: false, isIdle: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0C10] via-[#0B0E11] to-[#000000] relative overflow-hidden">
      {/* Neural Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className="pt-20 pb-8 px-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            AI Voice Assistant
          </h1>
          <p className="text-xl text-white/60">
            Experience the future of AI conversation
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* User Video */}
              <motion.div
                className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 aspect-video relative overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
                {isCameraOn ? (
                  <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                    <div className="text-white/60">Your Camera Feed</div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">You</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Avatar Container */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Holographic Frame */}
                <div className="relative bg-black/20 backdrop-blur-xl border border-cyan-400/30 rounded-full p-8 aspect-square">
                  {/* Glow Ring */}
                  <div
                    ref={glowRingRef}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl opacity-30"
                  />
                  
                  {/* Pulse Rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-500/20"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  />

                  {/* Avatar */}
                  <div
                    ref={avatarRef}
                    className="relative w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center"
                  >
                    {/* Avatar Face */}
                    <div className="relative">
                      {/* Eyes */}
                      <div ref={eyesRef} className="flex space-x-4 mb-4">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                        <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                      </div>
                      
                      {/* Mouth/Waveform */}
                      <div
                        ref={waveformRef}
                        className="flex items-end justify-center space-x-1 h-8"
                      >
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full"
                            style={{ height: '20%' }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <AnimatePresence>
                        {avatarState.isListening && (
                          <motion.div
                            className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            Listening...
                          </motion.div>
                        )}
                        {avatarState.isResponding && (
                          <motion.div
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            Speaking...
                          </motion.div>
                        )}
                        {avatarState.isIdle && isCallActive && (
                          <motion.div
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/60 text-xs font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            Ready
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Controls Panel */}
              <motion.div
                className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">Controls</h3>
                
                <div className="space-y-4">
                  {/* Call Control */}
                  <div className="text-center">
                    {!isCallActive ? (
                      <motion.button
                        onClick={startCall}
                        className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-green-500/25"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Phone size={24} />
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={endCall}
                        className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-red-500/25"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <PhoneOff size={24} />
                      </motion.button>
                    )}
                  </div>

                  {/* Media Controls */}
                  <AnimatePresence>
                    {isCallActive && (
                      <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <button
                          onClick={toggleMic}
                          className={`p-4 rounded-2xl border transition-all duration-300 ${
                            isMicOn
                              ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                              : 'bg-red-500/20 border-red-500/30 text-red-400'
                          }`}
                        >
                          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                        </button>

                        <button
                          onClick={() => setIsCameraOn(!isCameraOn)}
                          className={`p-4 rounded-2xl border transition-all duration-300 ${
                            isCameraOn
                              ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                              : 'bg-red-500/20 border-red-500/30 text-red-400'
                          }`}
                        >
                          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                        </button>

                        <button
                          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                          className={`p-4 rounded-2xl border transition-all duration-300 ${
                            isSpeakerOn
                              ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                              : 'bg-red-500/20 border-red-500/30 text-red-400'
                          }`}
                        >
                          {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>

                        <button className="p-4 rounded-2xl border border-white/10 text-white/60 hover:bg-white/5 transition-all duration-300">
                          <Settings size={20} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}