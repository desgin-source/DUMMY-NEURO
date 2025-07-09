import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageSquare, Mic, FileText, Network } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home', path: '/' },
  { id: 'chat', icon: MessageSquare, label: 'Chat', path: '/chat' },
  { id: 'audio', icon: Mic, label: 'Audio', path: '/audio' },
  { id: 'summary', icon: FileText, label: 'Summary', path: '/summary' },
  { id: 'graph', icon: Network, label: 'Graph', path: '/graph' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 shadow-2xl">
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative p-3 rounded-full transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotateY: isActive ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon size={20} />
                </motion.div>
                
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20"
                    layoutId="activeBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {isActive && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                    layoutId="activeIndicator"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}