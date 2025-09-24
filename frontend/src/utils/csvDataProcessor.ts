// Utility to process CSV data for the visualization
export interface CSVRow {
  speciesNameAdjusted: string;
  speciesName: string;
  group: string;
  broadLevelThreat: string;
  scope: number;
  severity: number;
  timingScore: number;
  sumOfTimingScopeSeverity: number;
  impactScore: string;
  invSpName: string;
}

export interface GroupMetrics {
  group: string;
  count: number;
  share: number; // percentage of total
}

export interface SpeciesGroupMetrics {
  species: string;
  group: string;
  count: number;
  share: number; // percentage within that species
}

// Process the CSV data to get group counts
export function processGroupData(csvData: CSVRow[]): GroupMetrics[] {
  const groupCounts: { [key: string]: number } = {};
  
  csvData.forEach(row => {
    if (row.group && row.group.trim()) {
      groupCounts[row.group] = (groupCounts[row.group] || 0) + 1;
    }
  });
  
  const total = Object.values(groupCounts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(groupCounts)
    .map(([group, count]) => ({
      group,
      count,
      share: Math.round((count / total) * 100 * 100) / 100 // Round to 2 decimal places
    }))
    .sort((a, b) => b.count - a.count);
}

// Process the CSV data to get species-group impact data
export function processSpeciesGroupData(csvData: CSVRow[]): SpeciesGroupMetrics[] {
  const speciesGroupCounts: { [key: string]: { [key: string]: number } } = {};
  
  csvData.forEach(row => {
    if (row.invSpName && row.group && row.group.trim()) {
      if (!speciesGroupCounts[row.invSpName]) {
        speciesGroupCounts[row.invSpName] = {};
      }
      speciesGroupCounts[row.invSpName][row.group] = 
        (speciesGroupCounts[row.invSpName][row.group] || 0) + 1;
    }
  });
  
  const result: SpeciesGroupMetrics[] = [];
  
  Object.entries(speciesGroupCounts).forEach(([species, groupCounts]) => {
    const totalForSpecies = Object.values(groupCounts).reduce((sum, count) => sum + count, 0);
    
    Object.entries(groupCounts).forEach(([group, count]) => {
      result.push({
        species,
        group,
        count,
        share: Math.round((count / totalForSpecies) * 100 * 100) / 100
      });
    });
  });
  
  return result;
}

// Parse CSV text into structured data
export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return {
      speciesNameAdjusted: values[0] || '',
      speciesName: values[1] || '',
      group: values[2] || '',
      broadLevelThreat: values[3] || '',
      scope: parseInt(values[4]) || 0,
      severity: parseInt(values[5]) || 0,
      timingScore: parseInt(values[6]) || 0,
      sumOfTimingScopeSeverity: parseInt(values[7]) || 0,
      impactScore: values[8] || '',
      invSpName: values[9] || ''
    };
  });
}
