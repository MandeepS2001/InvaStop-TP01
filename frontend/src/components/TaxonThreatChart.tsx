import React, { useState, useEffect } from 'react';
import { GroupMetrics, SpeciesGroupMetrics } from '../utils/csvDataProcessor';


const TaxonThreatChart: React.FC = () => {
  const [groupData, setGroupData] = useState<GroupMetrics[]>([]);
  const [speciesGroupData, setSpeciesGroupData] = useState<SpeciesGroupMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  // Load embedded data
  useEffect(() => {
    // Real data from CSV processing
    const realGroupData: GroupMetrics[] = [
      { group: 'Plants', count: 169, share: 47.61 },
      { group: 'Birds', count: 69, share: 19.44 },
      { group: 'Mammals', count: 64, share: 18.03 },
      { group: 'Reptiles', count: 24, share: 6.76 },
      { group: 'Invertebrates', count: 22, share: 6.2 },
      { group: 'Frogs', count: 4, share: 1.13 },
      { group: 'Fish', count: 3, share: 0.85 }
    ];

    const realSpeciesGroupData: SpeciesGroupMetrics[] = [
      { species: 'Red Fox', group: 'Birds', count: 30, share: 31.25 },
      { species: 'Red Fox', group: 'Mammals', count: 52, share: 54.17 },
      { species: 'Red Fox', group: 'Frogs', count: 4, share: 4.17 },
      { species: 'Red Fox', group: 'Reptiles', count: 10, share: 10.42 },
      { species: 'European Rabbit', group: 'Birds', count: 22, share: 16.92 },
      { species: 'European Rabbit', group: 'Mammals', count: 8, share: 6.15 },
      { species: 'European Rabbit', group: 'Plants', count: 100, share: 76.92 },
      { species: 'Feral Pig', group: 'Birds', count: 15, share: 21.43 },
      { species: 'Feral Pig', group: 'Mammals', count: 20, share: 28.57 },
      { species: 'Feral Pig', group: 'Plants', count: 35, share: 50.0 },
      { species: 'Lantana', group: 'Birds', count: 8, share: 30.77 },
      { species: 'Lantana', group: 'Mammals', count: 3, share: 11.54 },
      { species: 'Lantana', group: 'Plants', count: 15, share: 57.69 },
      { species: 'Gamba Grass', group: 'Birds', count: 2, share: 100.0 },
      { species: 'Cane Toad', group: 'Mammals', count: 5, share: 38.46 },
      { species: 'Cane Toad', group: 'Reptiles', count: 5, share: 38.46 },
      { species: 'Cane Toad', group: 'Frogs', count: 3, share: 23.08 },
      { species: 'Gorse', group: 'Plants', count: 1, share: 100.0 },
      { species: 'Common Myna', group: 'Birds', count: 1, share: 100.0 },
      { species: 'Bitou Bush', group: 'Plants', count: 1, share: 100.0 }
    ];

    setGroupData(realGroupData);
    setSpeciesGroupData(realSpeciesGroupData);
    console.log('Loaded embedded data:', realGroupData, realSpeciesGroupData.slice(0, 5));
    setLoading(false);
  }, []);


  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoveredSpeciesGroup, setHoveredSpeciesGroup] = useState<{species: string, group: string} | null>(null);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-gray-800 text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold text-center">Biodiversity impacts by Australia's top 10 invasive species</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-b-lg p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

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

  // Get top 9 species for the right chart
  const topSpecies = ['Bitou Bush', 'European Rabbit', 'Red Fox', 'Feral Pig', 'Lantana', 'Gamba Grass', 'Cane Toad', 'Gorse', 'Common Myna'];
  
  // Create species impact data from CSV data
  const speciesImpacts = topSpecies.map(species => {
    const speciesData = speciesGroupData.filter(d => d.species === species);
    const impacts: { [key: string]: number } = {};
    
    speciesData.forEach(d => {
      impacts[d.group] = d.count;
    });
    
    console.log(`Species: ${species}, Data found:`, speciesData.length, 'entries');
    
    return {
      species,
      impacts: {
        Plants: impacts.Plants || 0,
        Mammals: impacts.Mammals || 0,
        Birds: impacts.Birds || 0,
        Invertebrates: impacts.Invertebrates || 0,
        Reptiles: impacts.Reptiles || 0,
        Frogs: impacts.Frogs || 0,
        Fish: impacts.Fish || 0
      }
    };
  });

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
              const isHovered = hoveredGroup === item.group;
              
              return (
                <div key={item.group} className="relative">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onMouseEnter={() => setHoveredGroup(item.group)}
                    onMouseLeave={() => setHoveredGroup(null)}
                  >
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
                  
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute z-10 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm min-w-[200px] top-full mt-1 left-0">
                      <div className="font-semibold mb-2">{item.group}</div>
                      <div className="space-y-1">
                        <div>Count: <span className="font-medium">{item.count}</span></div>
                        <div>Share: <span className="font-medium">{item.share}%</span></div>
                      </div>
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chart: Impacts by Invasive Species */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-3">Impacts by invasive species</h4>
          
          <div className="space-y-1 overflow-visible">
            {speciesImpacts.map((species, index) => {
              const totalImpact = Object.values(species.impacts).reduce((sum, count) => sum + count, 0);
              
              return (
                <div key={species.species} className="mb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-24 text-xs font-medium text-gray-700 text-right">
                      {species.species}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-6 relative overflow-visible">
                      <div className="flex h-full">
                        {Object.entries(species.impacts).map(([group, count]) => {
                          if (count === 0) return null;
                          const groupPercentage = Math.max((count / totalImpact) * 100, 2); // Minimum 2% width for hoverability
                          const isHovered = hoveredSpeciesGroup?.species === species.species && hoveredSpeciesGroup?.group === group;
                          const speciesGroupMetrics = speciesGroupData.find(d => d.species === species.species && d.group === group);
                          
                          return (
                            <div
                              key={group}
                              className={`h-full ${groupColors[group as keyof typeof groupColors]} cursor-pointer relative group`}
                              style={{ width: `${groupPercentage}%` }}
                              onMouseEnter={() => {
                                console.log('Hovering over:', species.species, group, count);
                                setHoveredSpeciesGroup({species: species.species, group});
                              }}
                              onMouseLeave={() => setHoveredSpeciesGroup(null)}
                              title={`${species.species} - ${group}: ${count} species (${Math.round((count / totalImpact) * 100 * 100) / 100}%)`}
                            >
                              {/* Tooltip for species-group segments */}
                              {isHovered && (
                                <div className="absolute z-50 bg-gray-900 text-white p-2 rounded shadow-lg text-xs min-w-[180px] -top-16 left-1/2 transform -translate-x-1/2 pointer-events-none">
                                  <div className="font-semibold mb-1">{species.species}</div>
                                  <div className="text-xs space-y-0.5">
                                    <div>Group: <span className="font-medium">{group}</span></div>
                                    <div>Count: <span className="font-medium">{speciesGroupMetrics?.count || count}</span></div>
                                    <div>Share: <span className="font-medium">{speciesGroupMetrics?.share || Math.round((count / totalImpact) * 100 * 100) / 100}%</span></div>
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                                </div>
                              )}
                            </div>
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
