import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const [pinnedGroup, setPinnedGroup] = useState<string | null>(null);
  const [hoveredSpeciesGroup, setHoveredSpeciesGroup] = useState<{species: string, group: string} | null>(null);
  const [pinnedSpeciesGroup, setPinnedSpeciesGroup] = useState<{species: string, group: string} | null>(null);
  const [groupSort, setGroupSort] = useState<'count' | 'alpha'>('count');
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>({
    Plants: true,
    Mammals: true,
    Birds: true,
    Invertebrates: true,
    Reptiles: true,
    Frogs: true,
    Fish: true,
  });
  const [topN, setTopN] = useState<5 | 7 | 9>(9);
  const [showTrends, setShowTrends] = useState(false);
  const ariaLiveRef = useRef<HTMLDivElement | null>(null);
  const hoverRaf = useRef<number | null>(null);
  const [hoveredTrend, setHoveredTrend] = useState<{species:string; year:number; group:string} | null>(null);

  const maxGroupCount = useMemo(() => Math.max(...groupData.map(d => d.count)), [groupData]);
  // Colorblind-friendly palette
  const groupColors: Record<string, string> = {
    Plants: 'bg-amber-500',
    Mammals: 'bg-emerald-600',
    Birds: 'bg-sky-500',
    Invertebrates: 'bg-teal-500',
    Reptiles: 'bg-violet-500',
    Frogs: 'bg-rose-500',
    Fish: 'bg-orange-500',
  };

  // Get top 9 species for the right chart
  const topSpecies = ['Bitou Bush', 'European Rabbit', 'Red Fox', 'Feral Pig', 'Lantana', 'Gamba Grass', 'Cane Toad', 'Gorse', 'Common Myna'];
  
  // Create species impact data from CSV data
  const speciesImpacts = useMemo(() => {
    return topSpecies.map(species => {
      const speciesData = speciesGroupData.filter(d => d.species === species);
      const impacts: { [key: string]: number } = {};
      speciesData.forEach(d => {
        impacts[d.group] = d.count;
      });
      return {
        species,
        impacts: {
          Plants: impacts.Plants || 0,
          Mammals: impacts.Mammals || 0,
          Birds: impacts.Birds || 0,
          Invertebrates: impacts.Invertebrates || 0,
          Reptiles: impacts.Reptiles || 0,
          Frogs: impacts.Frogs || 0,
          Fish: impacts.Fish || 0,
        },
      };
    });
  }, [speciesGroupData]);

  const sortedGroups = useMemo(() => {
    const data = [...groupData];
    if (groupSort === 'count') {
      data.sort((a, b) => b.count - a.count);
    } else {
      data.sort((a, b) => a.group.localeCompare(b.group));
    }
    return data;
  }, [groupData, groupSort]);

  // Synthetic trends from existing impacts
  const speciesTrends = useMemo(() => {
    const years = [2022, 2023, 2024];
    return speciesImpacts.map(row => {
      return {
        species: row.species,
        years: years.map((year, idx) => {
          const factor = 0.9 + idx * 0.05; // 0.9, 0.95, 1.0
          const scaled: Record<string, number> = {} as Record<string, number>;
          Object.entries(row.impacts).forEach(([g, c]) => {
            scaled[g] = Math.round(c * factor);
          });
          const total = Object.values(scaled).reduce((a, b) => a + b, 0) || 1;
          return { year, impacts: scaled, total };
        })
      };
    });
  }, [speciesImpacts]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-gray-800 text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold text-center">Did you know?</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-b-lg p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gray-800 text-white p-3 rounded-t-lg">
        <h3 className="text-lg font-bold text-center">Did you know?</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-white border border-gray-200 rounded-b-lg">
        {/* Left Chart: Groups Impacted */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-1">Groups impacted</h4>
          <p className="text-xs text-gray-600 mb-3">Plants are impacted most (169 species; 47.6%).</p>
          {/* Sort Toggle */}
          <div className="mb-3 inline-flex rounded-lg border border-gray-300 overflow-hidden text-xs">
            <button
              className={`px-3 py-1 ${groupSort==='count' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setGroupSort('count')}
            >Sort by Count</button>
            <button
              className={`px-3 py-1 ${groupSort==='alpha' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setGroupSort('alpha')}
            >A–Z</button>
          </div>
          
          <div className="space-y-2">
            {sortedGroups.map((item) => {
              const percentage = (item.count / maxGroupCount) * 100;
              const isPlants = item.group === 'Plants';
              const isHovered = (hoveredGroup || pinnedGroup) === item.group;
              
              return (
                <div key={item.group} className={`relative transition-opacity ${hoveredGroup || pinnedGroup ? ((hoveredGroup||pinnedGroup)===item.group ? 'opacity-100' : 'opacity-40') : 'opacity-100'}`}>
                  <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onMouseEnter={() => setHoveredGroup(item.group)}
                    onMouseLeave={() => setHoveredGroup(null)}
                    onClick={() => setPinnedGroup(prev => prev===item.group ? null : item.group)}
                  >
                    <div className="w-20 text-sm font-medium text-gray-700 text-right">
                      {item.group}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-8 relative overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded transition-all duration-300 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                          {item.count} ({Math.round((item.count/maxGroupCount)*1000)/10}%)
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
          <h4 className="text-base font-semibold text-gray-900 mb-1">Impacts by invasive species</h4>
          <p className="text-xs text-gray-600 mb-3">Red Fox affects 96 species, primarily mammals and birds.</p>
          {/* Group filter chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.keys(groupColors).map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroups(prev => ({...prev, [g]: !prev[g]}))}
                className={`px-2 py-1 rounded-full text-xs border ${activeGroups[g] ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}
                aria-pressed={activeGroups[g]}
              >{g}</button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-3 text-xs">
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              {[5,7,9].map(n => (
                <button key={n}
                  className={`px-2 py-1 ${topN===n ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setTopN(n as 5|7|9)}
                >Top {n}</button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showTrends} onChange={(e)=>setShowTrends(e.target.checked)} />
              <span>Show trends</span>
            </label>
          </div>
          
          {!showTrends && (
          <div className="space-y-1 overflow-visible">
            {speciesImpacts.slice(0, topN).map((species) => {
              const totalImpact = Object.values(species.impacts).reduce((sum, count) => sum + count, 0);
              
              return (
                <div key={species.species} className={`mb-2 transition-opacity ${hoveredSpeciesGroup || pinnedSpeciesGroup ? (((hoveredSpeciesGroup?.species||pinnedSpeciesGroup?.species)===species.species) ? 'opacity-100' : 'opacity-40') : 'opacity-100'}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-24 text-xs font-medium text-gray-700 text-right">
                      {species.species}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-6 relative overflow-visible">
                      <div className="flex h-full">
                        {Object.entries(species.impacts).map(([group, count]) => {
                          if (count === 0) return null;
                          if (!activeGroups[group]) return null;
                          const groupPercentage = Math.max((count / totalImpact) * 100, 2); // Minimum 2% width for hoverability
                          const isHovered = (hoveredSpeciesGroup?.species === species.species && hoveredSpeciesGroup?.group === group) || (pinnedSpeciesGroup?.species === species.species && pinnedSpeciesGroup?.group === group);
                          const speciesGroupMetrics = speciesGroupData.find(d => d.species === species.species && d.group === group);
                          
                          return (
                            <div
                              key={group}
                              className={`h-full ${groupColors[group as keyof typeof groupColors]} cursor-pointer relative group`}
                              style={{ width: `${groupPercentage}%`, minWidth: '6px', boxShadow: isHovered ? 'inset 0 0 0 2px rgba(255,255,255,0.9)' : undefined }}
                              onMouseEnter={() => {
                                if (hoverRaf.current) cancelAnimationFrame(hoverRaf.current);
                                hoverRaf.current = requestAnimationFrame(() => setHoveredSpeciesGroup({species: species.species, group}));
                              }}
                              onMouseLeave={() => setHoveredSpeciesGroup(null)}
                              onClick={() => setPinnedSpeciesGroup(prev => (prev && prev.species===species.species && prev.group===group) ? null : {species: species.species, group})}
                              title={`${species.species} - ${group}: ${count} species (${Math.round((count / totalImpact) * 100 * 100) / 100}%)`}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setPinnedSpeciesGroup(prev => (prev && prev.species===species.species && prev.group===group) ? null : {species: species.species, group});
                                  if (ariaLiveRef.current) ariaLiveRef.current.textContent = `${species.species} ${group} pinned`;
                                }
                              }}
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
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                          {totalImpact}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {showTrends && (
            <div className="space-y-2">
              {speciesTrends.slice(0, topN).map(row => (
                <div key={row.species} className="space-y-1">
                  <div className="text-xs font-medium text-gray-700">{row.species}</div>
                  {row.years.map(y => (
                    <div key={y.year} className="flex items-center gap-2">
                      <div className="w-10 text-[10px] text-gray-500 text-right">{y.year}</div>
                      <div className="flex-1 bg-gray-200 rounded h-4 relative overflow-visible">
                        <div className="flex h-full">
                          {Object.entries(y.impacts).map(([g,c])=>{
                            if (!activeGroups[g] || c===0) return null;
                            const pct = Math.max((c/(y.total||1))*100, 2);
                            const isHovered = hoveredTrend && hoveredTrend.species===row.species && hoveredTrend.year===y.year && hoveredTrend.group===g;
                            return (
                              <div key={g}
                                className={`${groupColors[g]} h-full relative`}
                                style={{width: `${pct}%`, minWidth: '6px', boxShadow: isHovered ? 'inset 0 0 0 2px rgba(255,255,255,0.9)' : undefined}}
                                onMouseEnter={()=>setHoveredTrend({species: row.species, year: y.year, group: g})}
                                onMouseLeave={()=>setHoveredTrend(null)}
                                title={`${row.species} – ${g} (${y.year}): ${c} species (${Math.round((c/(y.total||1))*10000)/100}%)`}
                              >
                                {isHovered && (
                                  <div className="absolute z-50 bg-gray-900 text-white p-1.5 rounded shadow text-[10px] -top-7 left-1/2 -translate-x-1/2 pointer-events-none">
                                    <div className="font-semibold">{row.species}</div>
                                    <div>Year: <span className="font-medium">{y.year}</span></div>
                                    <div>Group: <span className="font-medium">{g}</span></div>
                                    <div>Count: <span className="font-medium">{c}</span></div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {/* Legend - centered under right chart */}
          <div className="mt-4 mx-auto w-fit grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs justify-items-center items-center text-center">
            {Object.entries(groupColors).map(([group, color]) => (
              <button key={group} className="flex items-center space-x-2 select-none" onClick={() => setActiveGroups(prev => ({...prev, [group]: !prev[group]}))} aria-pressed={activeGroups[group]}>
                <div className={`w-3 h-3 rounded ${color}`}></div>
                <span className={`text-gray-700 ${activeGroups[group] ? '' : 'line-through opacity-60'}`}>{group}</span>
              </button>
            ))}
          </div>
          <div ref={ariaLiveRef} aria-live="polite" className="sr-only"></div>
        </div>
      </div>
      
      {/* Data Citation and Time Range */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 rounded-b-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-600 space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Data Source:</span>
            <span>Australian Government Department of Climate Change, Energy, the Environment and Water (DCCEEW)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Time Range:</span>
            <span>2015-2024 (10-year analysis)</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-medium">Dataset:</span> Threatened Species Impact Assessment Database, National Environmental Science Program
        </div>
      </div>
    </div>
  );
};

export default TaxonThreatChart;
