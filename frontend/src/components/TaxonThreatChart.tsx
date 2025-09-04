import React from 'react';

interface GroupData {
  group: string;
  count: number;
}

interface SpeciesImpact {
  species: string;
  impacts: {
    Plants: number;
    Mammals: number;
    Birds: number;
    Invertebrates: number;
    Reptiles: number;
    Frogs: number;
    Fish: number;
  };
}

const TaxonThreatChart: React.FC = () => {
  // Data based on the visualization shown
  const groupData: GroupData[] = [
    { group: 'Plants', count: 165 },
    { group: 'Mammals', count: 55 },
    { group: 'Birds', count: 50 },
    { group: 'Invertebrates', count: 20 },
    { group: 'Reptiles', count: 20 },
    { group: 'Frogs', count: 5 },
    { group: 'Fish', count: 5 }
  ];

  const speciesImpacts: SpeciesImpact[] = [
    {
      species: 'Bitou Bush',
      impacts: { Plants: 120, Mammals: 15, Birds: 10, Invertebrates: 5, Reptiles: 8, Frogs: 2, Fish: 0 }
    },
    {
      species: 'European Rabbit',
      impacts: { Plants: 100, Mammals: 25, Birds: 15, Invertebrates: 8, Reptiles: 10, Frogs: 3, Fish: 1 }
    },
    {
      species: 'Red Fox',
      impacts: { Plants: 20, Mammals: 40, Birds: 35, Invertebrates: 5, Reptiles: 8, Frogs: 2, Fish: 0 }
    },
    {
      species: 'Feral Pig',
      impacts: { Plants: 80, Mammals: 30, Birds: 20, Invertebrates: 10, Reptiles: 12, Frogs: 3, Fish: 2 }
    },
    {
      species: 'Lantana',
      impacts: { Plants: 110, Mammals: 12, Birds: 8, Invertebrates: 6, Reptiles: 7, Frogs: 1, Fish: 0 }
    },
    {
      species: 'Gamba Grass',
      impacts: { Plants: 95, Mammals: 10, Birds: 6, Invertebrates: 4, Reptiles: 5, Frogs: 1, Fish: 0 }
    },
    {
      species: 'Cane Toad',
      impacts: { Plants: 15, Mammals: 20, Birds: 25, Invertebrates: 30, Reptiles: 35, Frogs: 15, Fish: 10 }
    },
    {
      species: 'Gorse',
      impacts: { Plants: 85, Mammals: 8, Birds: 5, Invertebrates: 3, Reptiles: 4, Frogs: 1, Fish: 0 }
    },
    {
      species: 'Common Myna',
      impacts: { Plants: 10, Mammals: 15, Birds: 40, Invertebrates: 5, Reptiles: 8, Frogs: 2, Fish: 0 }
    }
  ];

  const maxGroupCount = Math.max(...groupData.map(d => d.count));
  const groupColors = {
    'Plants': 'bg-yellow-400',
    'Mammals': 'bg-green-500',
    'Birds': 'bg-blue-500',
    'Invertebrates': 'bg-teal-500',
    'Reptiles': 'bg-purple-500',
    'Frogs': 'bg-red-500',
    'Fish': 'bg-orange-500'
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gray-800 text-white p-3 rounded-t-lg">
        <h3 className="text-lg font-bold text-center">Biodiversity impacts by Australia's top 10 invasive species</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-white border border-gray-200 rounded-b-lg">
        {/* Left Chart: Groups Impacted */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-3">Groups impacted</h4>
          
          <div className="space-y-2">
            {groupData.map((item, index) => {
              const percentage = (item.count / maxGroupCount) * 100;
              const isPlants = item.group === 'Plants';
              
              return (
                <div key={item.group} className="flex items-center space-x-3">
                  <div className="w-20 text-sm font-medium text-gray-700 text-right">
                    {item.group}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded h-8 relative overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {item.count}
                      </span>
                    </div>
                  </div>
                  {isPlants && (
                    <span className="text-xs text-green-600 font-medium">the most threatened</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chart: Impacts by Invasive Species */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-3">Impacts by invasive species</h4>
          
          <div className="space-y-1">
            {speciesImpacts.map((species, index) => {
              const totalImpact = Object.values(species.impacts).reduce((sum, count) => sum + count, 0);
              const maxTotal = Math.max(...speciesImpacts.map(s => Object.values(s.impacts).reduce((sum, count) => sum + count, 0)));
              const barWidth = (totalImpact / maxTotal) * 100;
              
              return (
                <div key={species.species} className="mb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-24 text-xs font-medium text-gray-700 text-right">
                      {species.species}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-6 relative overflow-hidden">
                      <div className="flex h-full">
                        {Object.entries(species.impacts).map(([group, count]) => {
                          if (count === 0) return null;
                          const groupPercentage = (count / totalImpact) * 100;
                          return (
                            <div
                              key={group}
                              className={`h-full ${groupColors[group as keyof typeof groupColors]}`}
                              style={{ width: `${groupPercentage}%` }}
                              title={`${group}: ${count}`}
                            />
                          );
                        })}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {totalImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-1 text-xs">
            {Object.entries(groupColors).map(([group, color]) => (
              <div key={group} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded ${color}`}></div>
                <span className="text-gray-700">{group}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonThreatChart;
