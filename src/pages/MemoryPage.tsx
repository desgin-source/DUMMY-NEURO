import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Archive, 
  Search, 
  Clock, 
  Calendar, 
  Play, 
  Trash2, 
  Edit3, 
  Filter,
  BarChart3,
  FileText,
  Mic
} from 'lucide-react';
import { memoryDB, ConversationRecord } from '../utils/database';

export default function MemoryPage() {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalConversations: 0, totalDuration: 0, recentConversations: 0 });
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'long'>('all');

  useEffect(() => {
    loadConversations();
    loadStats();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = memoryDB.getAllConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = memoryDB.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = memoryDB.searchConversations(query);
      setConversations(results);
    } else {
      loadConversations();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      const success = memoryDB.deleteConversation(id);
      if (success) {
        loadConversations();
        loadStats();
        if (selectedConversation?.id === id) {
          setSelectedConversation(null);
        }
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredConversations = conversations.filter(conv => {
    if (filterBy === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(conv.created_at) >= weekAgo;
    }
    if (filterBy === 'long') {
      return conv.duration > 300; // 5+ minutes
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0C10] via-[#0B0E11] to-[#000000]">
      <div className="pt-20 pb-32">
        {/* Header */}
        <motion.div
          className="px-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Conversation Memory
              </h1>
              <p className="text-xl text-white/60">
                Your stored conversations and transcriptions
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                    <Archive className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalConversations}</p>
                    <p className="text-white/60 text-sm">Total Conversations</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{formatDuration(stats.totalDuration)}</p>
                    <p className="text-white/60 text-sm">Total Duration</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.recentConversations}</p>
                    <p className="text-white/60 text-sm">This Week</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-12 pr-4 py-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors duration-300"
                />
              </div>
              
              <div className="flex space-x-2">
                {['all', 'recent', 'long'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterBy(filter as any)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      filterBy === filter
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-black/20 text-white/60 border border-white/10 hover:bg-white/5'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'recent' ? 'Recent' : 'Long'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Conversations List */}
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <motion.div
                      className="text-center py-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Archive className="mx-auto mb-4 text-white/40" size={48} />
                      <p className="text-white/60 text-lg">
                        {searchQuery ? 'No conversations found' : 'No conversations stored yet'}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {filteredConversations.map((conversation, index) => (
                        <motion.div
                          key={conversation.id}
                          className={`bg-black/20 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                            selectedConversation?.id === conversation.id
                              ? 'border-cyan-400/50 bg-cyan-400/5'
                              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {conversation.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-white/60 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Calendar size={14} />
                                  <span>{formatDate(conversation.created_at)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>{formatDuration(conversation.duration)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(conversation.id);
                                }}
                                className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-white/70 text-sm line-clamp-2">
                            {conversation.transcription.substring(0, 150)}...
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Conversation Detail */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <AnimatePresence>
                    {selectedConversation ? (
                      <motion.div
                        className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-white">
                            Conversation Details
                          </h3>
                          <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300">
                            <Edit3 size={16} />
                          </button>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-medium text-white mb-2">
                              {selectedConversation.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-white/60 text-sm mb-4">
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{formatDate(selectedConversation.created_at)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{formatDuration(selectedConversation.duration)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-white font-medium mb-3 flex items-center">
                              <FileText className="mr-2" size={16} />
                              Transcription
                            </h5>
                            <div className="bg-black/20 rounded-xl p-4 max-h-96 overflow-y-auto">
                              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedConversation.transcription}
                              </p>
                            </div>
                          </div>

                          {selectedConversation.summary && (
                            <div>
                              <h5 className="text-white font-medium mb-3">Summary</h5>
                              <div className="bg-black/20 rounded-xl p-4">
                                <p className="text-white/80 text-sm leading-relaxed">
                                  {selectedConversation.summary}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedConversation.audio_file_name && (
                            <div>
                              <h5 className="text-white font-medium mb-3 flex items-center">
                                <Mic className="mr-2" size={16} />
                                Audio File
                              </h5>
                              <div className="bg-black/20 rounded-xl p-4">
                                <p className="text-white/60 text-sm">
                                  {selectedConversation.audio_file_name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Archive className="mx-auto mb-4 text-white/40" size={48} />
                        <p className="text-white/60">
                          Select a conversation to view details
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}