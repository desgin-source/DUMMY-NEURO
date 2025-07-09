import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Monitor, RefreshCw } from 'lucide-react';

interface WebGLErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
}

export default function WebGLErrorFallback({ error, onRetry }: WebGLErrorFallbackProps) {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#081F5C] via-[#0B0E11] to-[#000000] flex items-center justify-center">
      <motion.div
        className="text-center max-w-md mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/30"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <AlertTriangle size={32} className="text-yellow-500" />
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-4">
          3D Graphics Unavailable
        </h3>
        
        <p className="text-white/70 mb-6 leading-relaxed">
          WebGL is not supported or enabled in your browser. The visual effects have been disabled, but all functionality remains available.
        </p>

        {error && (
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
            <p className="text-white/50 text-sm font-mono">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {onRetry && (
            <motion.button
              onClick={onRetry}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-cyan-500/30 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </motion.button>
          )}

          <div className="text-white/40 text-sm space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Monitor size={14} />
              <span>Try updating your browser or enabling hardware acceleration</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fallback animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}