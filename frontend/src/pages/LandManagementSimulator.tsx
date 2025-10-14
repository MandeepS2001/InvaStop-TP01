import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther';
import SimpleHeader from '../components/SimpleHeader';
import AICaptureModal from '../components/AICaptureModal';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Scenario data type
interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  riskChange: 'increase' | 'decrease';
  riskPercentage: number;
  explanation: string;
  details: string[];
  cost: string;
  timeline: string;
  bestSeason: string;
  affectedSpecies: string[];
}

// Preset scenario packages
interface PresetPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  scenarios: string[];
  recommendedFor: string;
}

const presetPackages: PresetPackage[] = [
  {
    id: 'beginner',
    name: 'Beginner Friendly',
    description: 'Low-cost, easy-to-implement practices for new hobby farmers',
    icon: '🌱',
    scenarios: ['planting', 'mulching', 'fencing'],
    recommendedFor: 'New to farming and want quick, affordable wins'
  },
  {
    id: 'sustainable',
    name: 'Sustainable Manager',
    description: 'Eco-friendly practices that reduce risk without chemicals',
    icon: '♻️',
    scenarios: ['planting', 'mulching', 'fencing'],
    recommendedFor: 'Environmentally conscious land management'
  },
  {
    id: 'intensive',
    name: 'Intensive Farming',
    description: 'Maximum productivity with managed risk',
    icon: '🚜',
    scenarios: ['clearing', 'irrigation', 'planting', 'mulching'],
    recommendedFor: 'High-yield farming with risk mitigation strategies'
  },
  {
    id: 'conversion',
    name: 'Bush to Farm Conversion',
    description: 'Converting natural land while minimizing invasive risk',
    icon: '🌳',
    scenarios: ['clearing', 'planting', 'mulching', 'fencing'],
    recommendedFor: 'Converting bushland to productive farmland'
  }
];

// Scenario data with enhanced information
const scenarios: Scenario[] = [
  {
    id: 'irrigation',
    name: 'Add Irrigation',
    icon: '💧',
    description: 'Install irrigation system for crops',
    riskChange: 'increase',
    riskPercentage: 25,
    explanation: 'Extra irrigation creates moist conditions that many invasive weeds thrive in, especially during dry periods when native plants struggle.',
    details: [
      'Increases soil moisture levels',
      'Creates ideal conditions for water-loving weeds',
      'May disrupt natural plant competition',
      'Can lead to overwatering issues'
    ],
    cost: '$2,000 - $8,000',
    timeline: '3-6 months to see effects',
    bestSeason: 'Spring/Summer',
    affectedSpecies: ['Gamba Grass', 'Lantana', 'Bitou Bush']
  },
  {
    id: 'clearing',
    name: 'Clear Bush',
    icon: '🪓',
    description: 'Remove native vegetation for farming',
    riskChange: 'increase',
    riskPercentage: 40,
    explanation: 'Clearing native bush removes natural competition and creates open spaces where invasive plants can quickly establish and spread.',
    details: [
      'Removes natural weed competition',
      'Creates disturbed soil conditions',
      'Eliminates native plant barriers',
      'Opens areas for weed colonization'
    ],
    cost: '$500 - $3,000',
    timeline: 'Immediate impact',
    bestSeason: 'Autumn/Winter',
    affectedSpecies: ['Lantana', 'Gorse', 'Buffel Grass', 'Gamba Grass']
  },
  {
    id: 'planting',
    name: 'Plant Crops',
    icon: '🌾',
    description: 'Establish crop fields on cleared land',
    riskChange: 'decrease',
    riskPercentage: 15,
    explanation: 'Well-managed crop fields can actually reduce invasive plant risk by creating competition and regular soil disturbance that prevents weed establishment.',
    details: [
      'Crops compete with invasive plants',
      'Regular cultivation disrupts weeds',
      'Proper crop rotation prevents buildup',
      'Managed fields reduce open spaces'
    ],
    cost: '$1,000 - $5,000',
    timeline: '6-12 months for full effect',
    bestSeason: 'Spring',
    affectedSpecies: ['Buffel Grass', 'Gamba Grass', 'Lantana']
  },
  {
    id: 'fencing',
    name: 'Install Fencing',
    icon: '🚧',
    description: 'Add perimeter fencing to property',
    riskChange: 'decrease',
    riskPercentage: 10,
    explanation: 'Fencing helps control livestock movement and can prevent invasive seeds from being spread by animals, reducing overall risk.',
    details: [
      'Controls animal movement patterns',
      'Prevents seed spread by livestock',
      'Creates defined property boundaries',
      'Reduces trampling damage'
    ],
    cost: '$3,000 - $10,000',
    timeline: '3-6 months to see effects',
    bestSeason: 'Any season',
    affectedSpecies: ['All species benefit from controlled livestock']
  },
  {
    id: 'mulching',
    name: 'Add Mulch',
    icon: '🍂',
    description: 'Apply organic mulch to garden areas',
    riskChange: 'decrease',
    riskPercentage: 20,
    explanation: 'Mulching suppresses weed growth by blocking sunlight and creating a barrier that prevents invasive seeds from germinating.',
    details: [
      'Blocks sunlight from weed seeds',
      'Creates physical barrier to germination',
      'Improves soil health',
      'Reduces need for herbicides'
    ],
    cost: '$500 - $2,000',
    timeline: '1-3 months to see effects',
    bestSeason: 'Spring/Autumn',
    affectedSpecies: ['Gorse', 'Lantana', 'Bitou Bush']
  },
  {
    id: 'burning',
    name: 'Controlled Burn',
    icon: '🔥',
    description: 'Use fire to manage vegetation',
    riskChange: 'increase',
    riskPercentage: 30,
    explanation: 'While controlled burns can help with some weeds, they may also stimulate the growth of fire-adapted invasive species and create disturbed conditions.',
    details: [
      'May stimulate fire-adapted weeds',
      'Creates disturbed soil conditions',
      'Can spread weed seeds via wind',
      'May damage beneficial soil organisms'
    ],
    cost: '$200 - $1,000',
    timeline: 'Immediate impact',
    bestSeason: 'Autumn/Winter (with permits)',
    affectedSpecies: ['Gamba Grass', 'Buffel Grass', 'Gorse']
  }
];

// Smart recommendation engine
const getRecommendations = (selectedIds: string[]): Scenario[] => {
  if (selectedIds.length === 0) {
    // No selection - recommend starting scenarios
    return scenarios.filter(s => ['planting', 'mulching'].includes(s.id));
  }

  const selected = scenarios.filter(s => selectedIds.includes(s.id));
  const hasHighRiskScenario = selected.some(s => s.riskPercentage >= 30 && s.riskChange === 'increase');
  const hasClearing = selectedIds.includes('clearing');
  const hasIrrigation = selectedIds.includes('irrigation');
  
  const recommendations: Scenario[] = [];
  
  // If they have high-risk scenarios, recommend mitigation
  if (hasHighRiskScenario) {
    const mitigationScenarios = scenarios.filter(
      s => s.riskChange === 'decrease' && !selectedIds.includes(s.id)
    );
    recommendations.push(...mitigationScenarios.slice(0, 2));
  }
  
  // If they cleared bush, recommend planting and mulching
  if (hasClearing && !selectedIds.includes('planting')) {
    const planting = scenarios.find(s => s.id === 'planting');
    if (planting) recommendations.push(planting);
  }
  
  if (hasClearing && !selectedIds.includes('mulching')) {
    const mulching = scenarios.find(s => s.id === 'mulching');
    if (mulching) recommendations.push(mulching);
  }
  
  // If they have irrigation, recommend crops to use the water
  if (hasIrrigation && !selectedIds.includes('planting')) {
    const planting = scenarios.find(s => s.id === 'planting');
    if (planting) recommendations.push(planting);
  }
  
  // Remove duplicates using filter
  const uniqueRecommendations = recommendations.filter((scenario, index, self) =>
    index === self.findIndex((s) => s.id === scenario.id)
  );
  
  return uniqueRecommendations.slice(0, 3);
};

// Risk Meter Component
const RiskMeter: React.FC<{ risk: number }> = ({ risk }) => {
  const getRiskLevel = (risk: number): { label: string; color: string; emoji: string } => {
    if (risk <= -20) return { label: 'Very Low Risk', color: '#10b981', emoji: '🌟' };
    if (risk <= -10) return { label: 'Low Risk', color: '#34d399', emoji: '✅' };
    if (risk < 0) return { label: 'Reduced Risk', color: '#6ee7b7', emoji: '👍' };
    if (risk === 0) return { label: 'Neutral', color: '#94a3b8', emoji: '➖' };
    if (risk <= 10) return { label: 'Slight Risk', color: '#fbbf24', emoji: '⚡' };
    if (risk <= 25) return { label: 'Moderate Risk', color: '#f59e0b', emoji: '⚠️' };
    if (risk <= 40) return { label: 'High Risk', color: '#f97316', emoji: '🔶' };
    return { label: 'Very High Risk', color: '#ef4444', emoji: '🚨' };
  };

  const riskLevel = getRiskLevel(risk);
  const normalizedRisk = Math.max(-50, Math.min(50, risk)); // Clamp between -50 and 50
  const rotation = ((normalizedRisk + 50) / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Circular background */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeDasharray="251.2 251.2"
          strokeDashoffset="62.8"
        />
        {/* Colored arc based on risk */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={riskLevel.color}
          strokeWidth="20"
          strokeDasharray="251.2 251.2"
          strokeDashoffset={251.2 - ((normalizedRisk + 50) / 100) * 125.6 + 62.8}
          className="transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl mb-1">{riskLevel.emoji}</div>
        <div className="text-3xl font-bold" style={{ color: riskLevel.color }}>
          {risk > 0 ? '+' : ''}{risk}%
        </div>
        <div className="text-sm font-medium text-gray-600 mt-1">{riskLevel.label}</div>
      </div>
    </div>
  );
};

const LandManagementSimulator: React.FC = () => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [draggedScenario, setDraggedScenario] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPresets, setShowPresets] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, scenarioId: string) => {
    setDraggedScenario(scenarioId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedScenario(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (draggedScenario && !selectedScenarios.includes(draggedScenario)) {
      setSelectedScenarios([...selectedScenarios, draggedScenario]);
      setShowPresets(false);
    }
  };

  // Mobile-friendly tap-to-add
  const handleScenarioTap = (scenarioId: string) => {
    if (isMobile || true) { // Always enable tap functionality
      if (selectedScenarios.includes(scenarioId)) {
        removeScenario(scenarioId);
      } else {
        setSelectedScenarios([...selectedScenarios, scenarioId]);
        setShowPresets(false);
      }
    }
  };

  const removeScenario = (scenarioId: string) => {
    setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
  };

  const clearAllScenarios = () => {
    setSelectedScenarios([]);
    setShowPresets(true);
    scrollToTop();
  };

  const loadPreset = (presetId: string) => {
    const preset = presetPackages.find(p => p.id === presetId);
    if (preset) {
      setSelectedScenarios(preset.scenarios);
      setShowPresets(false);
      scrollToTop();
    }
  };

  // Calculate combined risk
  const calculateCombinedRisk = () => {
    let totalRisk = 0;
    selectedScenarios.forEach(id => {
      const scenario = scenarios.find(s => s.id === id);
      if (scenario) {
        const change = scenario.riskChange === 'increase' ? scenario.riskPercentage : -scenario.riskPercentage;
        totalRisk += change;
      }
    });
    return totalRisk;
  };

  // Calculate total cost range
  const calculateTotalCost = (): string => {
    const selectedScenariosData = selectedScenarios.map(id => scenarios.find(s => s.id === id)).filter(Boolean) as Scenario[];
    if (selectedScenariosData.length === 0) return '$0';
    
    let minTotal = 0;
    let maxTotal = 0;
    
    selectedScenariosData.forEach(scenario => {
      const costs = scenario.cost.replace(/\$/g, '').replace(/,/g, '').split(' - ').map(c => parseInt(c));
      minTotal += costs[0];
      maxTotal += costs[1];
    });
    
    return `$${minTotal.toLocaleString()} - $${maxTotal.toLocaleString()}`;
  };

  const combinedRisk = calculateCombinedRisk();
  const selectedScenariosData = selectedScenarios.map(id => scenarios.find(s => s.id === id)).filter(Boolean) as Scenario[];
  const recommendations = getRecommendations(selectedScenarios);
  const totalCost = calculateTotalCost();

  return (
    <div className="min-h-screen">
      {/* Simple Header */}
      <SimpleHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <LiquidEther
            colors={['#22c55e', '#16a34a', '#15803d', '#166534']}
            mouseForce={16}
            cursorSize={130}
            isViscous={false}
            viscous={20}
            iterationsViscous={16}
            iterationsPoisson={16}
            dt={0.016}
            BFECC={true}
            resolution={0.6}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.8}
            takeoverDuration={0.3}
            autoResumeDelay={2000}
            autoRampDuration={0.8}
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="inline-block">
              Patch Planner
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto mb-2">
            {isMobile ? 'Tap scenarios to combine them' : 'Drag and drop scenarios to combine them'} and see their combined impact on invasive plant risk.
          </p>
          <p className="text-base sm:text-lg text-green-200 max-w-3xl mx-auto">
            💡 Get cost estimates, timelines, and smart recommendations for your land
          </p>
        </div>
      </section>

      <main className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Information Section */}
          <div className="mb-16 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How Patch Planner Works</h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Our planner uses environmental science data and agricultural research to estimate how different land management practices might affect invasive plant risk on your property. Combine scenarios to model real-world farming decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🔬</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Science-Based</h4>
                <p className="text-gray-600">
                  Based on real environmental research and agricultural studies
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">🎯</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Combine Scenarios</h4>
                <p className="text-gray-600">
                  Mix and match different practices to see their combined impact
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">🌱</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Make Better Decisions</h4>
                <p className="text-gray-600">
                  Understand consequences before making changes to your land
                </p>
              </div>
            </div>
          </div>

          {/* Preset Packages - Show when no scenarios selected */}
          {showPresets && selectedScenarios.length === 0 && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start with Preset Packages</h2>
                <p className="text-lg text-gray-600">Choose a pre-configured package based on your farming goals, or build your own below</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {presetPackages.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-green-400 p-6 text-left transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="text-5xl mb-4">{preset.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {preset.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
                    <div className="bg-green-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-green-800">
                        <span className="font-bold">Best for:</span> {preset.recommendedFor}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <span>Load this package</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setShowPresets(false)}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Or build your own custom plan below ↓
                </button>
              </div>
            </div>
          )}

          {/* Available Scenarios */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Scenarios</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {isMobile 
                ? 'Tap any scenario to add it to your plan. Tap again to remove it.'
                : 'Drag any scenario to the drop zone below to add it to your plan, or simply tap to add.'
              }
            </p>
            {selectedScenarios.length > 0 && (
              <p className="text-sm text-green-600 font-medium mt-2">
                {selectedScenarios.length} of {scenarios.length} scenarios selected
              </p>
            )}
          </div>

          {/* Scenario Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {scenarios.map((scenario) => {
              const isSelected = selectedScenarios.includes(scenario.id);
              return (
                <div
                  key={scenario.id}
                  draggable={!isSelected && !isMobile}
                  onDragStart={(e) => !isMobile && handleDragStart(e, scenario.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleScenarioTap(scenario.id)}
                  className={`group bg-white rounded-2xl shadow-lg border-2 p-6 text-left transition-all duration-300 ${
                    isMobile ? 'cursor-pointer active:scale-95' : 'cursor-grab active:cursor-grabbing'
                  } ${
                    isSelected 
                      ? 'border-green-400 ring-4 ring-green-200' 
                      : 'border-gray-200 hover:border-green-300 hover:shadow-xl hover:-translate-y-1'
                  } ${draggedScenario === scenario.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{scenario.icon}</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      scenario.riskChange === 'increase' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {scenario.riskChange === 'increase' ? '⚠️ +' : '✅ -'}{scenario.riskPercentage}%
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {scenario.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{scenario.description}</p>
                  
                  {/* Cost & Timeline */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-600">
                      <span className="mr-2">💰</span>
                      <span className="font-medium">Cost:</span>
                      <span className="ml-1">{scenario.cost}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <span className="mr-2">⏱️</span>
                      <span className="font-medium">Timeline:</span>
                      <span className="ml-1">{scenario.timeline}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <span className="mr-2">🌤️</span>
                      <span className="font-medium">Best season:</span>
                      <span className="ml-1">{scenario.bestSeason}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 flex items-center justify-between bg-green-50 rounded-lg p-2">
                      <span className="text-sm text-green-700 font-medium">✓ Added to plan</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScenario(scenario.id);
                        }}
                        className="text-red-600 hover:text-red-700 font-bold text-lg"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {!isSelected && (
                    <div className="mt-3 flex items-center text-sm text-gray-500 font-medium">
                      <span>{isMobile ? 'Tap to add' : 'Drag or tap to add'}</span>
                      <span className="ml-2">↗️</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Smart Recommendations */}
          {selectedScenarios.length > 0 && recommendations.length > 0 && (
            <div className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-200 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                  <span className="text-white text-2xl">💡</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Recommendations</h3>
                <p className="text-gray-600">Based on your current selection, we recommend considering these scenarios:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioTap(scenario.id)}
                    className="group bg-white rounded-xl shadow hover:shadow-lg border-2 border-blue-200 hover:border-blue-400 p-4 text-left transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">{scenario.icon}</div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        scenario.riskChange === 'increase' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {scenario.riskChange === 'increase' ? '+' : '-'}{scenario.riskPercentage}%
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-700">{scenario.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                    <div className="text-xs text-blue-600 font-medium">
                      Tap to add →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drop Zone / Your Plan */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Combined Plan</h2>
              <p className="text-lg text-gray-600">
                {selectedScenarios.length === 0 
                  ? isMobile ? 'Tap scenarios above to add them to your plan' : 'Drag scenarios here or tap them above to see their combined effect'
                  : 'Here\'s your custom patch plan'
                }
              </p>
            </div>
            
            <div
              onDragOver={!isMobile ? handleDragOver : undefined}
              onDragLeave={!isMobile ? handleDragLeave : undefined}
              onDrop={!isMobile ? handleDrop : undefined}
              className={`min-h-[200px] border-4 border-dashed rounded-2xl transition-all duration-300 ${
                isDraggingOver 
                  ? 'border-green-500 bg-green-50' 
                  : selectedScenarios.length > 0 
                    ? 'border-gray-300 bg-white' 
                    : 'border-gray-300 bg-gray-50'
              }`}
            >
              {selectedScenarios.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {isMobile ? 'Tap scenarios above' : 'Drag scenarios here'}
                  </p>
                  <p className="text-gray-500">
                    {isMobile ? 'Tap any scenario card to add it' : 'Drag and drop from the options above'}
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  {/* Risk Meter */}
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Combined Risk Level</h3>
                    <RiskMeter risk={combinedRisk} />
                    
                    {/* Cost and Timeline Summary */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                        <div className="text-3xl mb-2">💰</div>
                        <div className="text-sm text-gray-600 mb-1">Total Estimated Cost</div>
                        <div className="text-xl font-bold text-gray-900">{totalCost}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <div className="text-3xl mb-2">📊</div>
                        <div className="text-sm text-gray-600 mb-1">Scenarios Combined</div>
                        <div className="text-xl font-bold text-gray-900">{selectedScenarios.length} practices</div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Scenarios */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Your Selected Scenarios:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedScenariosData.map((scenario) => (
                        <div
                          key={scenario.id}
                          className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 relative group"
                        >
                          <button
                            onClick={() => removeScenario(scenario.id)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-colors duration-200 z-10"
                            title="Remove"
                          >
                            ×
                          </button>
                          <div className="text-3xl mb-2">{scenario.icon}</div>
                          <h4 className="font-bold text-gray-900 mb-1">{scenario.name}</h4>
                          <p className={`text-sm font-medium mb-2 ${
                            scenario.riskChange === 'increase' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {scenario.riskChange === 'increase' ? '+' : '-'}{scenario.riskPercentage}% risk
                          </p>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>💰 {scenario.cost}</div>
                            <div>⏱️ {scenario.timeline}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scenario Breakdown */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Breakdown</h3>
                      
                      <div className="text-left">
                        <div className="space-y-4">
                          {selectedScenariosData.map((scenario) => (
                            <div key={scenario.id} className="bg-white rounded-xl p-6 border border-gray-200">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                  <span className="text-3xl mr-3">{scenario.icon}</span>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-lg">{scenario.name}</h5>
                                    <p className={`text-sm font-medium ${
                                      scenario.riskChange === 'increase' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {scenario.riskChange === 'increase' ? 'Increases' : 'Decreases'} risk by {scenario.riskPercentage}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg mb-4">
                                {scenario.explanation}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <div className="text-xs font-semibold text-gray-700 mb-2">💰 Cost & Timeline:</div>
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <div>Cost: {scenario.cost}</div>
                                    <div>Timeline: {scenario.timeline}</div>
                                    <div>Best season: {scenario.bestSeason}</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                  <div className="text-xs font-semibold text-gray-700 mb-2">🌱 Affected Species:</div>
                                  <div className="text-xs text-gray-600">
                                    {scenario.affectedSpecies.join(', ')}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-2">Key Effects:</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {scenario.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-green-600 mr-2">•</span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6 space-x-4">
                      <button
                        onClick={clearAllScenarios}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-300"
                      >
                        Clear All & Start Over
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* CTA to Close the Loop */}
      <section className="relative py-16 bg-gradient-to-br from-green-800 via-green-700 to-green-900 overflow-hidden">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <LiquidEther
            colors={['#22c55e', '#16a34a', '#15803d', '#166534']}
            mouseForce={16}
            cursorSize={130}
            isViscous={false}
            viscous={20}
            iterationsViscous={16}
            iterationsPoisson={16}
            dt={0.016}
            BFECC={true}
            resolution={0.6}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.8}
            takeoverDuration={0.3}
            autoResumeDelay={2000}
            autoRampDuration={0.8}
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Take Action?
            </h2>
            <p className="text-lg text-green-100 max-w-3xl mx-auto mb-8">
              Now that you've planned your land management approach, discover what invasive plants are actually in your area and identify any suspicious plants you encounter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-white mb-3">Check Your Area</h3>
              <p className="text-green-100 mb-4">
                See what invasive plants are found near your property and plan accordingly.
              </p>
              <Link
                to="/map"
                onClick={scrollToTop}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-bold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                <span>View Interactive Map</span>
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-3">Identify Plants</h3>
              <p className="text-green-100 mb-4">
                Use Spot & Stop to quickly identify any suspicious plants you find.
              </p>
              <button
                onClick={() => setAiOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-bold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                <span>Spot & Stop</span>
                <span className="ml-2">→</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-green-200 text-sm">
              Complete your invasive plant management journey with real-time data and instant identification
            </p>
          </div>
        </div>
      </section>

      <AICaptureModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
};

export default LandManagementSimulator;
