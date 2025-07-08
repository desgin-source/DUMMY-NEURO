import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Upload, Play, Square, FileText, Loader2 } from 'lucide-react';

export default function PremiumAudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioFile(audioBlob as File);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const processAudio = async () => {
    if (!audioFile) return;
    
    setIsProcessing(true);
    setTranscription('');
    
    setTimeout(() => {
      setTranscription(
        "This is a sophisticated transcription of your audio content. In a production environment, this would utilize advanced AI models like Whisper or similar speech-to-text services to provide accurate, contextual transcription with speaker identification and semantic understanding."
      );
      setIsProcessing(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="audio" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Audio Intelligence
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Advanced speech recognition with contextual understanding
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recording Section */}
          <motion.div
            className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-white mb-8">Capture</h3>
            
            <div className="space-y-8">
              <div className="text-center">
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500/20 border-2 border-red-500' 
                      : 'bg-white/5 border-2 border-white/20 hover:border-cyan-400/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? <Square size={28} /> : <Mic size={28} />}
                </motion.button>
                
                <p className="text-white/60 mt-4 font-medium">
                  {isRecording ? `Recording: ${formatTime(recordingTime)}` : 'Click to record'}
                </p>
              </div>

              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-2xl transition-all duration-300 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload size={20} />
                  <span className="font-medium">Upload Audio</span>
                </motion.button>
              </div>

              {audioUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-black/20 rounded-2xl p-6"
                >
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/wav" />
                  </audio>
                </motion.div>
              )}

              {audioFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <motion.button
                    onClick={processAudio}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-[#0B1D35] to-[#2C0B35] hover:from-[#0F2142] hover:to-[#341242] text-white px-10 py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-white/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="inline mr-3 animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="inline mr-3" size={20} />
                        Analyze Audio
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-white mb-8">Intelligence</h3>
            
            <div className="min-h-[400px] bg-black/20 rounded-2xl p-8 border border-white/5">
              {isProcessing ? (
                <motion.div
                  className="flex items-center justify-center h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-6 animate-spin text-cyan-400" size={48} />
                    <p className="text-white/60 font-medium">Analyzing audio content...</p>
                  </div>
                </motion.div>
              ) : transcription ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-white leading-relaxed font-light text-lg">{transcription}</p>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-white/40 text-center font-medium">
                    Upload or record audio to see intelligent analysis
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}