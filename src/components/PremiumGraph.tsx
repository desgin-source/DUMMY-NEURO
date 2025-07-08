import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Search } from 'lucide-react';

const mockNodes = [
  { id: 1, label: 'Product Strategy', x: 300, y: 200, size: 25, color: '#00F0FF', connections: 4 },
  { id: 2, label: 'AI Integration', x: 500, y: 150, size: 20, color: '#0B1D35', connections: 3 },
  { id: 3, label: 'User Research', x: 200, y: 350, size: 18, color: '#2C0B35', connections: 2 },
  { id: 4, label: 'Q4 Planning', x: 450, y: 300, size: 22, color: '#00F0FF', connections: 5 },
  { id: 5, label: 'Budget Allocation', x: 150, y: 250, size: 16, color: '#0B1D35', connections: 2 },
  { id: 6, label: 'Partnership', x: 400, y: 400, size: 19, color: '#2C0B35', connections: 3 },
  { id: 7, label: 'Engineering', x: 600, y: 250, size: 17, color: '#00F0FF', connections: 2 },
];

const mockLinks = [
  { source: 1, target: 2 },
  { source: 1, target: 3 },
  { source: 1, target: 4 },
  { source: 2, target: 4 },
  { source: 2, target: 7 },
  { source: 3, target: 5 },
  { source: 4, target: 6 },
  { source: 4, target: 7 },
  { source: 5, target: 1 },
  { source: 6, target: 4 },
];

export default function PremiumGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<typeof mockNodes[0] | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    
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
    mockNodes.forEach(node => {
      // Node glow
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size + 10);
      gradient.addColorStop(0, node.color + '40');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size + 10, 0, 2 * Math.PI);
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color + '80';
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Selection highlight
      if (selectedNode?.id === node.id) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 8, 0, 2 * Math.PI);
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.size + 25);
    });

    ctx.restore();
  }, [zoom, pan, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const clickedNode = mockNodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
      );
      return distance <= node.size;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <section id="graph" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Knowledge Graph
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Visualize connections and relationships in your content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Graph Canvas */}
          <motion.div
            className="lg:col-span-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-96 cursor-pointer rounded-2xl"
              onClick={handleCanvasClick}
            />
            
            {/* Controls */}
            <div className="absolute top-8 right-8 flex space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors duration-300"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors duration-300"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={handleReset}
                className="p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors duration-300"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </motion.div>

          {/* Node Details */}
          <motion.div
            className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Search className="mr-2" size={20} />
              Node Details
            </h3>
            
            {selectedNode ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {selectedNode.label}
                  </h4>
                  <div 
                    className="w-6 h-6 rounded-full inline-block mr-3"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <span className="text-white/60 text-sm font-medium">
                    {selectedNode.connections} connections
                  </span>
                </div>
                
                <div className="bg-black/20 rounded-2xl p-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    This concept appears frequently in your content and has strong relationships with related topics. Click connected nodes to explore the knowledge network.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-white font-medium mb-3">Related Concepts</h5>
                  <div className="space-y-2">
                    {mockLinks
                      .filter(link => link.source === selectedNode.id || link.target === selectedNode.id)
                      .slice(0, 3)
                      .map((link, index) => {
                        const connectedId = link.source === selectedNode.id ? link.target : link.source;
                        const connectedNode = mockNodes.find(n => n.id === connectedId);
                        return (
                          <div key={index} className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: connectedNode?.color }}
                            />
                            <span className="text-white/60 text-sm">
                              {connectedNode?.label}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/40 font-medium">
                  Click on a node to explore details
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}