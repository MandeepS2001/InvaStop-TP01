import React, { useState, useEffect } from 'react';

const TaxonThreatChart: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // The 5 invasive plants with impact levels
  const plantData = [
    { name: 'Lantana', impact: 95, color: 'bg-red-500', description: 'Forms dense thickets' },
    { name: 'Gorse', impact: 85, color: 'bg-orange-500', description: 'Sharp thorns' },
    { name: 'Gamba Grass', impact: 80, color: 'bg-orange-400', description: 'Spreads quickly' },
    { name: 'Buffel Grass', impact: 75, color: 'bg-yellow-500', description: 'Outcompetes natives' },
    { name: 'Bitou Bush', impact: 70, color: 'bg-yellow-400', description: 'Takes over areas' }
  ];

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading plant information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">How Much Impact Do Problem Plants Have?</h3>
          <p className="text-gray-600">This shows how much damage each plant causes across Australia</p>
        </div>

        {/* Simple Bar Chart Visualization */}
        <div className="space-y-4 mb-8">
          {plantData.map((plant, index) => (
            <div key={plant.name} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4 mb-3">
                {/* Plant Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md border-2 border-gray-200">
                    <img 
                      src={`/top10/${plant.name.replace(/\s+/g, '')}.png`}
                      alt={plant.name}
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
                </div>

                {/* Plant Name and Description */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-800">{plant.name}</h4>
                  <p className="text-sm text-gray-600">{plant.description}</p>
                </div>

                {/* Impact Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-gray-800">{plant.impact}%</div>
                  <div className="text-xs text-gray-500">Impact Level</div>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-full ${plant.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${plant.impact}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Simple Impact Scale */}
        <div className="bg-gradient-to-r from-green-50 to-red-50 rounded-xl p-6 border-2 border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">What Do These Numbers Mean?</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <h5 className="font-bold text-green-800 mb-1">70-80%</h5>
              <p className="text-sm text-green-600">Medium Impact</p>
              <p className="text-xs text-gray-600 mt-1">These plants cause problems but can be managed</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xl">⚠</span>
              </div>
              <h5 className="font-bold text-orange-800 mb-1">80-90%</h5>
              <p className="text-sm text-orange-600">High Impact</p>
              <p className="text-xs text-gray-600 mt-1">These plants need regular attention</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xl">!</span>
              </div>
              <h5 className="font-bold text-red-800 mb-1">90-100%</h5>
              <p className="text-sm text-red-600">Very High Impact</p>
              <p className="text-xs text-gray-600 mt-1">These plants need immediate action</p>
            </div>
          </div>
        </div>

        {/* Simple Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="text-center">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">The Big Picture</h4>
            <p className="text-gray-600">
              All these plants cause problems, but some are much worse than others. The higher the percentage, the more damage they do to farms and native plants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonThreatChart;