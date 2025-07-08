import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react';

// Mock data for the knowledge graph
const mockNodes = [
  { id: 1, label: 'Meeting Notes', x: 200, y: 150, size: 20, color: '#3B82F6' },
  { id: 2, label: 'Project Ideas', x: 400, y: 100, size: 15, color: '#10B981' },
  { id: 3, label: 'Research', x: 300, y: 300, size: 18, color: '#F59E0B' },
  { id: 4, label: 'Todo List', x: 500, y: 250, size: 12, color: '#EF4444' },
  { id: 5, label: 'Brain Dump', x: 150, y: 350, size: 16, color: '#8B5CF6' },
  { id: 6, label: 'Innovation', x: 450, y: 400, size: 14, color: '#EC4899' },
];

const mockLinks = [
  { source: 1, target: 2 },
  { source: 1, target: 3 },
  { source: 2, target: 4 },
  { source: 3, target: 5 },
  { source: 4, target: 6 },
  { source: 2, target: 6 },
];

export default function KnowledgeGraph() {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw links
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    
    mockLinks.forEach(link => {
      const sourceNode = mockNodes.find(n => n.id === link.source);
      const targetNode = mockNodes.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    ctx.globalAlpha = 1;
    mockNodes.forEach(node => {
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Node glow
      if (selectedNode?.id === node.id) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.size + 20);
    });

    ctx.restore();
  }, [zoom, pan, selectedNode]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Check if click is on a node
    const clickedNode = mockNodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
      );
      return distance <= node.size;
    });

    setSelectedNode(clickedNode);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <section id="graph" className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Graph</span>
          </h2>
          <p className="text-xl text-white/60">
            Visualize connections between your ideas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graph Canvas */}
          <motion.div
            className="lg:col-span-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-96 cursor-pointer"
              onClick={handleCanvasClick}
              style={{ background: 'transparent' }}
            />
            
            {/* Controls */}
            <div className="absolute top-6 right-6 flex space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </motion.div>

          {/* Node Details */}
          <motion.div
            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Eye className="mr-2" size={20} />
              Node Details
            </h3>
            
            {selectedNode ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {selectedNode.label}
                  </h4>
                  <div 
                    className="w-4 h-4 rounded-full inline-block mr-2"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <span className="text-white/60 text-sm">
                    Node ID: {selectedNode.id}
                  </span>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-white/70 text-sm">
                    This node represents a collection of related ideas and concepts. 
                    Click on connected nodes to explore relationships.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-white font-medium mb-2">Connections</h5>
                  <div className="space-y-1">
                    {mockLinks
                      .filter(link => link.source === selectedNode.id || link.target === selectedNode.id)
                      .map((link, index) => {
                        const connectedId = link.source === selectedNode.id ? link.target : link.source;
                        const connectedNode = mockNodes.find(n => n.id === connectedId);
                        return (
                          <div key={index} className="text-white/60 text-sm">
                            → {connectedNode?.label}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/40">
                  Click on a node to view details
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}