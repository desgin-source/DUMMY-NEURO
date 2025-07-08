import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, Mic, FileText, Network, Archive } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home', section: 'hero' },
  { id: 'chat', icon: MessageSquare, label: 'Chat', section: 'chat' },
  { id: 'audio', icon: Mic, label: 'Audio', section: 'audio' },
  { id: 'summary', icon: FileText, label: 'Summary', section: 'summary' },
  { id: 'graph', icon: Network, label: 'Graph', section: 'graph' },
  { id: 'memory', icon: Archive, label: 'Memory', section: 'memory' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.section);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4">
        <div className="flex items-center space-x-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className={`relative p-3 rounded-full transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white/20 text-white' 
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
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                    layoutId="activeIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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