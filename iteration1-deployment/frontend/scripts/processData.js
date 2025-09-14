const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../../Data-Science/taxon_threat_impact_cleaned.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
function parseCSV(csvText) {
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

// Process group data
function processGroupData(csvData) {
  const groupCounts = {};
  
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
      share: Math.round((count / total) * 100 * 100) / 100
    }))
    .sort((a, b) => b.count - a.count);
}

// Process species-group data
function processSpeciesGroupData(csvData) {
  const speciesGroupCounts = {};
  
  csvData.forEach(row => {
    if (row.invSpName && row.group && row.group.trim()) {
      if (!speciesGroupCounts[row.invSpName]) {
        speciesGroupCounts[row.invSpName] = {};
      }
      speciesGroupCounts[row.invSpName][row.group] = 
        (speciesGroupCounts[row.invSpName][row.group] || 0) + 1;
    }
  });
  
  const result = [];
  
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

// Process the data
const csvData = parseCSV(csvContent);
const groupData = processGroupData(csvData);
const speciesGroupData = processSpeciesGroupData(csvData);

// Create the output data
const outputData = {
  groupData,
  speciesGroupData,
  topSpecies: ['Bitou Bush', 'European Rabbit', 'Red Fox', 'Feral Pig', 'Lantana', 'Gamba Grass', 'Cane Toad', 'Gorse', 'Common Myna']
};

// Write to public directory
const outputPath = path.join(__dirname, '../public/visualization-data.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log('Data processed successfully!');
console.log('Group data:', groupData);
console.log('Species group data sample:', speciesGroupData.slice(0, 5));
console.log('Output written to:', outputPath);
