// Species data utility functions for loading and parsing invasive plants CSV data

export interface SpeciesData {
  sp_id: number;
  sp_common_name: string;
  species_type: string;
  sp_scientific_name: string;
  native_range: string;
  first_introduced: string;
  type: string;
  impact: string;
}

export interface ProcessedSpeciesData {
  name: string;
  scientificName: string;
  type: string;
  nativeRange: string;
  firstDetected: string;
  impact: string;
  description: string;
  category: 'plant' | 'animal' | 'insect';
  threatLevel: 'high' | 'medium' | 'low';
  quickFacts: {
    introduced: string;
    impact: string;
    distribution: string;
  };
  relatedSpecies: string[];
}

// Cache for loaded species data
let speciesDataCache: ProcessedSpeciesData[] | null = null;

// Parse CSV text into species data
function parseCSV(csvText: string): SpeciesData[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
    const species: any = {};
    
    headers.forEach((header, index) => {
      species[header] = values[index];
    });
    
    // Convert sp_id to number
    species.sp_id = parseInt(species.sp_id);
    
    return species as SpeciesData;
  });
}

// Convert CSV data to the format expected by the UI components
function processSpeciesData(csvData: SpeciesData[]): ProcessedSpeciesData[] {
  return csvData.map(species => {
    // Determine threat level based on impact keywords
    const impactLower = species.impact.toLowerCase();
    let threatLevel: 'high' | 'medium' | 'low' = 'medium';
    
    if (impactLower.includes('toxic') || 
        impactLower.includes('dense thickets') || 
        impactLower.includes('displaces') || 
        impactLower.includes('invades') ||
        impactLower.includes('extreme') ||
        impactLower.includes('monocultures')) {
      threatLevel = 'high';
    } else if (impactLower.includes('reduces') || 
               impactLower.includes('competes') || 
               impactLower.includes('alters')) {
      threatLevel = 'medium';
    }

    // Generate distribution based on common patterns in Australian invasive species
    let distribution = 'NSW, VIC, QLD';
    if (species.sp_common_name.toLowerCase().includes('coastal') || 
        species.native_range.toLowerCase().includes('coastal')) {
      distribution = 'NSW, VIC, QLD, SA';
    } else if (species.sp_common_name.toLowerCase().includes('grass')) {
      distribution = 'NSW, VIC, QLD, SA, WA, NT';
    }

    // Generate related species based on type and threat level
    const relatedSpecies: string[] = [];
    if (species.type.toLowerCase().includes('shrub')) {
      relatedSpecies.push('Lantana', 'Gorse', 'Bitou Bush');
    } else if (species.type.toLowerCase().includes('grass')) {
      relatedSpecies.push('Buffel Grass', 'Gamba Grass', 'Wiregrass');
    } else if (species.type.toLowerCase().includes('vine')) {
      relatedSpecies.push('Mikania', 'Black Swallow-wort');
    } else {
      relatedSpecies.push('Lantana', 'Bitou Bush', 'Gorse');
    }

    return {
      name: species.sp_common_name,
      scientificName: species.sp_scientific_name,
      type: species.type,
      nativeRange: species.native_range,
      firstDetected: species.first_introduced,
      impact: species.impact,
      description: species.impact,
      category: 'plant' as const,
      threatLevel,
      quickFacts: {
        introduced: species.first_introduced,
        impact: species.impact,
        distribution
      },
      relatedSpecies: relatedSpecies.slice(0, 3) // Limit to 3 related species
    };
  });
}

// Load species data from CSV file
export async function loadSpeciesData(): Promise<ProcessedSpeciesData[]> {
  // Return cached data if available
  if (speciesDataCache) {
    return speciesDataCache;
  }

  try {
    const response = await fetch('/invasive_plants_updated.csv');
    if (!response.ok) {
      throw new Error(`Failed to load species data: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const csvData = parseCSV(csvText);
    const processedData = processSpeciesData(csvData);
    
    // Cache the processed data
    speciesDataCache = processedData;
    
    return processedData;
  } catch (error) {
    console.error('Error loading species data:', error);
    // Return empty array as fallback
    return [];
  }
}

// Get species data by name (case-insensitive)
export async function getSpeciesByName(name: string): Promise<ProcessedSpeciesData | null> {
  const speciesData = await loadSpeciesData();
  const normalizedName = name.toLowerCase().replace(/[_\s-]/g, ' ');
  
  return speciesData.find(species => 
    species.name.toLowerCase().replace(/[_\s-]/g, ' ') === normalizedName
  ) || null;
}

// Get all species data
export async function getAllSpecies(): Promise<ProcessedSpeciesData[]> {
  return await loadSpeciesData();
}

// Clear cache (useful for development or when CSV is updated)
export function clearSpeciesCache(): void {
  speciesDataCache = null;
}
