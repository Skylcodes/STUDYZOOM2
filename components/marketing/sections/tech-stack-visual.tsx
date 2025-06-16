'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Cpu, 
  Network, 
  Layers, 
  BrainCircuit, 
  Bot, 
  MessageSquare, 
  BookOpen, 
  GraduationCap,
  FileText,
  MessageCircle,
  Sparkles,
  BrainCog,
  CircuitBoard,
  BotMessageSquare
} from 'lucide-react';

// AI Learning Technologies
interface Technology {
  name: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  active: boolean;
  color?: string;
}

const technologies: Technology[] = [
  {
    name: 'OpenAI',
    icon: <Bot size={24} className="text-blue-400" />,
    position: { x: 25, y: 50 },
    active: true,
    color: 'text-blue-400',
  },
  {
    name: 'LangChain',
    icon: <Network size={24} className="text-purple-400" />,
    position: { x: 75, y: 50 },
    active: true,
    color: 'text-purple-400',
  },
  {
    name: 'NLP Engine',
    icon: <MessageSquare size={24} className="text-green-400" />,
    position: { x: 25, y: 20 },
    active: true,
    color: 'text-green-400',
  },
  {
    name: 'Neural Networks',
    icon: <BrainCircuit size={24} className="text-pink-400" />,
    position: { x: 75, y: 20 },
    active: true,
    color: 'text-pink-400',
  },
  {
    name: 'Pinecone',
    icon: <Layers size={24} className="text-yellow-400" />,
    position: { x: 25, y: 80 },
    active: true,
    color: 'text-yellow-400',
  },
  {
    name: 'Adaptive Learning',
    icon: <BrainCog size={24} className="text-indigo-400" />,
    position: { x: 75, y: 80 },
    active: true,
    color: 'text-indigo-400',
  },
  {
    name: 'GPT-4',
    icon: <Sparkles size={24} className="text-blue-300" />,
    position: { x: 50, y: 10 },
    active: true,
    color: 'text-blue-300',
  },
  {
    name: 'Speech Synthesis',
    icon: <MessageCircle size={24} className="text-teal-400" />,
    position: { x: 50, y: 85 },
    active: true,
    color: 'text-teal-400',
  },
  {
    name: 'StudyZoom AI',
    icon: <GraduationCap size={24} className="text-white" />,
    position: { x: 50, y: 50 },
    active: true,
    color: 'text-white',
  },
];

interface LineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  active: boolean;
}

// Simplified line component
const ConnectionLine: React.FC<LineProps> = ({ start, end }) => {
  const path = `M${start.x},${start.y} L${end.x},${end.y}`;
  
  return (
    <path
      d={path}
      stroke="url(#activeGradient)"
      strokeWidth={1.5}
      strokeLinecap="round"
      fill="none"
      opacity="0.3"
      className="transition-opacity duration-300 hover:opacity-70"
    />
  );
};

export function TechStackVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  // Set initial dimensions and handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate node positions based on container dimensions
  const getNodePosition = (position: { x: number; y: number }) => {
    return {
      x: (position.x * dimensions.width) / 100,
      y: (position.y * dimensions.height) / 100,
    };
  };

  // AI Learning Technology Connections
  const connections = [
    // Core AI connections
    { from: 'NLP Engine', to: 'OpenAI' },
    { from: 'OpenAI', to: 'Pinecone' },
    { from: 'Neural Networks', to: 'LangChain' },
    { from: 'LangChain', to: 'Adaptive Learning' },

    // Knowledge graph connections
    { from: 'NLP Engine', to: 'Neural Networks' },
    { from: 'Neural Networks', to: 'Adaptive Learning' },
    { from: 'Adaptive Learning', to: 'Pinecone' },
    { from: 'Pinecone', to: 'NLP Engine' },

    // Center connections (StudyZoom AI)
    { from: 'NLP Engine', to: 'StudyZoom AI' },
    { from: 'Neural Networks', to: 'StudyZoom AI' },
    { from: 'Pinecone', to: 'StudyZoom AI' },
    { from: 'Adaptive Learning', to: 'StudyZoom AI' },
    { from: 'GPT-4', to: 'StudyZoom AI' },
    { from: 'Speech Synthesis', to: 'StudyZoom AI' },
    { from: 'OpenAI', to: 'StudyZoom AI' },
    { from: 'LangChain', to: 'StudyZoom AI' },

    // Additional connections
    { from: 'GPT-4', to: 'NLP Engine' },
    { from: 'GPT-4', to: 'Neural Networks' },
    { from: 'Speech Synthesis', to: 'Pinecone' },
    { from: 'Speech Synthesis', to: 'Adaptive Learning' }
  ];

  return (
    <section className="w-full py-12 relative overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Explanation block - now centered above */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="py-10 md:py-16">
            {/* Badge */}
            <div className="inline-flex mb-4">
              <div className="rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 px-4 py-1.5 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">
                AI-Powered Learning Engine
              </div>
            </div>

            {/* Title with galaxy gradient for last word */}
            <h2 className="text-3xl sm:text-4xl font-bold">
              <span className="text-white">The Intelligent Core Behind Your </span>
              <span className="bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#c084fc] bg-clip-text text-transparent">
                Higher Scores
              </span>
            </h2>

            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-6">
              Built on cutting-edge AI technology used by top universities—our platform is engineered to boost your GPA, improve test scores, and accelerate learning faster than traditional methods.
            </p>
            
            <div className="mt-8">
              <a href="#" className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 group">
                Start Boosting Your Grades
                <svg className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Tech stack visualization - slightly larger size */}
        <div ref={containerRef} className="relative w-full max-w-[56rem] mx-auto aspect-[16/9] bg-slate-950/60 rounded-2xl overflow-hidden backdrop-blur-sm border border-slate-900">
          {/* Background grid with subtle pulse animation */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-50">
            {Array.from({ length: 13 }).map((_, i) => (
              <div 
                key={`v-${i}`} 
                className="absolute left-0 right-0 h-px bg-slate-900" 
                style={{ top: `${(i * 100) / 12}%` }} 
              />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <div 
                key={`h-${i}`} 
                className="absolute top-0 bottom-0 w-px bg-slate-900" 
                style={{ left: `${(i * 100) / 12}%` }} 
              />
            ))}
          </div>

          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent opacity-70"></div>

          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connection lines */}
            {connections.map((connection, index) => {
              const fromNode = technologies.find(t => t.name === connection.from);
              const toNode = technologies.find(t => t.name === connection.to);

              if (!fromNode || !toNode) return null;

              const start = getNodePosition(fromNode.position);
              const end = getNodePosition(toNode.position);

              return (
                <ConnectionLine
                  key={`line-${index}`}
                  start={start}
                  end={end}
                  active={true}
                />
              );
            })}
          </svg>

          {/* Tech nodes with hover effect */}
          {technologies.map((tech, index) => {
            const position = getNodePosition(tech.position);
            const isHovered = hoveredTech === tech.name;

            return (
              <div
                key={tech.name}
                className="absolute rounded-full overflow-visible backdrop-blur-[2px] border bg-white/[0.02] border-blue-500/20"
                style={{
                  left: `${position.x - 28}px`,
                  top: `${position.y - 28}px`,
                  width: '56px',
                  height: '56px',
                  zIndex: isHovered ? 40 : 1
                }}
                onMouseEnter={() => setHoveredTech(tech.name)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                <div 
                  className={`flex items-center justify-center w-full h-full p-3 relative rounded-full transition-all duration-300 ${isHovered ? 'bg-white/5' : 'bg-white/5'}`}
                  style={{
                    boxShadow: isHovered ? `0 0 20px ${tech.color?.replace('text-', '')}80` : 'none',
                    border: `1px solid ${isHovered ? tech.color?.replace('text-', 'text-').replace('400', '500').replace('300', '400') + '80' : 'rgba(255, 255, 255, 0.05)'}`
                  }}
                >
                  <div className={`transition-all duration-300 ${tech.color}`}>
                    {tech.icon}
                  </div>

                  {/* Technology name tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 40 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs font-medium py-1.5 px-3 rounded-md whitespace-nowrap shadow-lg border border-blue-500/30 backdrop-blur-sm"
                        style={{ zIndex: 50 }}
                      >
                        {tech.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TechStackVisual; 