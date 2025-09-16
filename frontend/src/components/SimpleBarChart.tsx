import React, { useState, useEffect } from 'react';

interface BarChartData {
  name: string;
  value: number;
  color: string;
  risk_level?: string;
  locations?: string[];
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title: string;
  maxValue?: number;
  season?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  title, 
  maxValue,
  season = "Season"
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Calculate max value if not provided
  const chartMaxValue = maxValue || Math.max(...data.map(d => d.value));
  const totalSightings = data.reduce((sum, item) => sum + item.value, 0);
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, [data]);
  
  // Get risk level color
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  // Get risk icon
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-gray-100">
      {/* Header with enhanced styling */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full mr-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            {title}
          </h3>
        </div>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 mx-auto rounded-full"></div>
      </div>
      
      {/* Interactive Chart */}
      <div className="space-y-6 mb-8">
        {data.map((item, index) => {
          const percentage = (item.value / chartMaxValue) * 100;
          const isSelected = selectedSpecies === item.name;
          const animationDelay = index * 200;
          
          return (
            <div 
              key={index} 
              className={`transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                isSelected ? 'bg-blue-50 rounded-xl p-4 border-2 border-blue-200' : 'hover:bg-gray-50 rounded-xl p-2'
              }`}
              onClick={() => setSelectedSpecies(isSelected ? null : item.name)}
              style={{ animationDelay: `${animationDelay}ms` }}
            >
              {/* Species header with image and info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Species image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                    <img 
                      src={`/top10/${item.name.replace(/\s+/g, '')}.png`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center hidden">
                      <span className="text-2xl">🌿</span>
                    </div>
                  </div>
                  
                  {/* Species info */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{item.name}</h4>
                    {item.risk_level && (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border-2 ${getRiskColor(item.risk_level)}`}>
                        <span className="mr-1">{getRiskIcon(item.risk_level)}</span>
                        {item.risk_level} Risk
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Count and percentage */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {item.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(percentage)}% of total
                  </div>
                </div>
              </div>
              
              {/* Enhanced Bar with gradient and animation */}
              <div className="w-full bg-gray-200 rounded-full h-16 relative overflow-hidden shadow-inner border-2 border-gray-300">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-between px-4 shadow-lg ${
                    animationComplete ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    width: animationComplete ? `${Math.max(percentage, 8)}%` : '0%',
                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 50%, ${item.color}aa 100%)`,
                    boxShadow: `0 4px 15px ${item.color}40`
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    <span className="text-white font-bold text-sm drop-shadow-lg">
                      {item.name}
                    </span>
                  </div>
                  {percentage > 15 && (
                    <span className="text-white font-bold text-lg drop-shadow-lg">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Expanded details when selected */}
              {isSelected && (
                <div className="mt-4 p-4 bg-white rounded-xl border-2 border-blue-100 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-gray-700 mb-2">📊 Statistics</h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• {item.value.toLocaleString()} total sightings</li>
                        <li>• {Math.round(percentage)}% of all {season.toLowerCase()} sightings</li>
                        <li>• Ranked #{index + 1} most common</li>
                      </ul>
                    </div>
                    {item.locations && item.locations.length > 0 && (
                      <div>
                        <h5 className="font-bold text-gray-700 mb-2">📍 Locations</h5>
                        <div className="flex flex-wrap gap-1">
                          {item.locations.map((location, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Summary with multiple metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sightings */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-lg font-bold text-blue-800 mb-1">Total Sightings</p>
          <p className="text-3xl font-bold text-blue-600">{totalSightings.toLocaleString()}</p>
        </div>
        
        {/* Average per Species */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-lg font-bold text-green-800 mb-1">Avg per Species</p>
          <p className="text-3xl font-bold text-green-600">{Math.round(totalSightings / data.length).toLocaleString()}</p>
        </div>
        
        {/* Most Common */}
        <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-lg font-bold text-yellow-800 mb-1">Most Common</p>
          <p className="text-lg font-bold text-yellow-600">{data[0]?.name || 'N/A'}</p>
        </div>
      </div>
      
      {/* Interactive Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
        <h5 className="font-bold text-gray-700 mb-3 text-center">🎯 How to Use This Chart</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Click any species bar to see detailed information</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Bar height shows relative abundance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Colors indicate risk levels</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Higher bars = more sightings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleBarChart;
