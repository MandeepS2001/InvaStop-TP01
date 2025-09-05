// src/components/InteractiveMap.tsx
import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

// For development - you can replace this with your actual API key
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyB41DRuKWuJdGrZgCrUdLZtrKEJd_ZmJ9g";

type InfoState = {
  position: google.maps.LatLngLiteral;
  featureName: string;
} | null;

type Species = { name: string; impact: string; spread: string; risk: string };
type StateMeta = {
  name: string;
  risk: "high" | "moderate" | "low";
  color: string;
  species: Species[];
};
type StateMetaMap = Record<string, StateMeta>;

const mapContainerStyle = { width: "100%", height: "600px" };
const center = { lat: -25, lng: 135 };
const libraries: ("geometry" | "places" | "drawing" | "visualization")[] = ["geometry"];

// State click areas - approximate coordinates for each state
const stateClickAreas = [
  { 
    name: "New South Wales", 
    bounds: { 
      north: -28, south: -37.5, east: 153.5, west: 141 
    },
    center: { lat: -33.8688, lng: 151.2093 }
  },
  { 
    name: "Victoria", 
    bounds: { 
      north: -34, south: -39, east: 150, west: 141 
    },
    center: { lat: -37.8136, lng: 144.9631 }
  },
  { 
    name: "Queensland", 
    bounds: { 
      north: -10, south: -29, east: 153.5, west: 138 
    },
    center: { lat: -23.4691, lng: 144.9778 }
  },
  { 
    name: "Western Australia", 
    bounds: { 
      north: -13, south: -35, east: 129, west: 113 
    },
    center: { lat: -25.2744, lng: 133.7751 }
  },
  { 
    name: "South Australia", 
    bounds: { 
      north: -26, south: -38, east: 141, west: 129 
    },
    center: { lat: -30.0002, lng: 135.0000 }
  },
  { 
    name: "Tasmania", 
    bounds: { 
      north: -40.5, south: -43.5, east: 148.5, west: 144.5 
    },
    center: { lat: -42.8821, lng: 147.3272 }
  },
  { 
    name: "Northern Territory", 
    bounds: { 
      north: -10, south: -26, east: 138, west: 129 
    },
    center: { lat: -19.4914, lng: 132.5510 }
  }
];

const InteractiveMap: React.FC = () => {
  const navigate = useNavigate();
  const [infoWindow, setInfoWindow] = useState<InfoState>(null);
  const [stateMeta, setStateMeta] = useState<StateMetaMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateMeta | null>(null);
  const [currentSpeciesIndex, setCurrentSpeciesIndex] = useState(0);

  // Fetch real state data from Epic 1.0 API
  useEffect(() => {
    const fetchStateData = async () => {
      try {
        setLoading(true);
        console.log('Fetching state data from API...');
        const apiUrl = process.env.REACT_APP_API_URL || 'https://invastopbackend.vercel.app/api/v1';
        const response = await fetch(`${apiUrl}/epic1/map/state-data`);
        
        console.log('API Response status:', response.status);
        console.log('API Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        // Convert API data to StateMeta format
        const stateMetaMap: StateMetaMap = {};
        data.forEach((state: any) => {
          stateMetaMap[state.name] = {
            name: state.name,
            risk: state.risk,
            color: state.color,
            species: state.species.map((sp: any) => ({
              name: sp.name,
              impact: sp.impact,
              spread: sp.spread,
              risk: sp.risk
            }))
          };
        });
        
        console.log('Processed stateMetaMap:', stateMetaMap);
        setStateMeta(stateMetaMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching state data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch state data');
        setStateMeta({}); // Empty state instead of fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchStateData();
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    
    // Add click listener to the map
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const clickedLat = event.latLng!.lat();
      const clickedLng = event.latLng!.lng();
      
      // Check which state was clicked
      const clickedState = stateClickAreas.find(state => {
        return clickedLat >= state.bounds.south && 
               clickedLat <= state.bounds.north && 
               clickedLng >= state.bounds.west && 
               clickedLng <= state.bounds.east;
      });
      
      if (clickedState && stateMeta[clickedState.name]) {
        setSelectedState(stateMeta[clickedState.name]);
        setCurrentSpeciesIndex(0); // Reset to first species
        setInfoWindow({
          position: clickedState.center,
          featureName: clickedState.name
        });
      } else {
        // Clicked outside any state area
        setInfoWindow(null);
        setSelectedState(null);
        setCurrentSpeciesIndex(0);
      }
    });
  }, [stateMeta]);

  const nextSpecies = () => {
    if (selectedState) {
      setCurrentSpeciesIndex((prev) => (prev + 1) % selectedState.species.length);
    }
  };

  const prevSpecies = () => {
    if (selectedState) {
      setCurrentSpeciesIndex((prev) => (prev - 1 + selectedState.species.length) % selectedState.species.length);
    }
  };

  const getSpeciesImage = (speciesName: string) => {
    // Use images from the top10 folder in public - updated to match actual file names
    const imageMap: Record<string, string> = {
      'Lantana': '/top10/Lantana.png',
      'Bitou Bush': '/top10/BitouBush.png',
      'Common Myna': '/top10/CommonMyna.png',
      'Gorse': '/top10/Gorse.png',
      'Buffel Grass': '/top10/BuffelGrass.png',
      'Cane Toad': '/top10/CaneToad.png',
      'Red Fox': '/top10/RedFox.png',
      'Gamba Grass': '/top10/GambaGrass.png',
      'European Rabbit': '/top10/EuropeanRabbit.jpg',
      'Feral Pig': '/top10/FeralPig.png'
    };
    
    // Return the mapped image or create a simple SVG fallback
    if (imageMap[speciesName]) {
      console.log(`Loading image for ${speciesName}: ${imageMap[speciesName]}`);
      return imageMap[speciesName];
    }
    
    console.log(`No image found for ${speciesName}, using fallback`);
    // Create a simple SVG fallback for missing images
    const svgFallback = `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#4F46E5"/>
        <text x="150" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Species Image</text>
        <text x="150" y="125" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Not Available</text>
      </svg>
    `)}`;
    
    return svgFallback;
  };


  const getScientificName = (speciesName: string) => {
    const scientificNames: Record<string, string> = {
      'Lantana': 'Lantana camara',
      'Bitou Bush': 'Eucalyptus cladocalyx',
      'Common Myna': 'Acridotheres tristis',
      'Gorse': 'Ulex europaeus',
      'Buffel Grass': 'Cenchrus ciliaris',
      'Cane Toad': 'Bufo marinus',
      'Red Fox': 'Vulpes vulpes',
      'Gamba Grass': 'Panicum maximum',
      'European Rabbit': 'Oryctolagus cuniculus',
      'Feral Pig': 'Sus scrofa'
    };
    return scientificNames[speciesName] || 'N/A';
  };


  // Removed unused functions to fix linting errors

  const getSpeciesType = (speciesName: string) => {
    const types: Record<string, string> = {
      'Lantana': 'Shrub',
      'Bitou Bush': 'Tree',
      'Common Myna': 'Bird',
      'Gorse': 'Plant',
      'Buffel Grass': 'Grass',
      'Cane Toad': 'Amphibian',
      'Red Fox': 'Mammal',
      'Gamba Grass': 'Grass',
      'European Rabbit': 'Mammal',
      'Feral Pig': 'Mammal'
    };
    return types[speciesName] || 'Unknown';
  };


  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Google Maps API Key Required</h3>
        <p className="text-gray-600">Please add your Google Maps API key to use the interactive map.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Failed to Load Google Maps</h3>
        <p className="text-gray-600">Error: {loadError.message}</p>
        <p className="text-gray-500 text-sm mt-2">Please check your API key and try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Google Maps...</p>
      </div>
    );
  }

  const selected = infoWindow ? stateMeta[infoWindow.featureName] : null;

  return (
    <div className="relative">
      <div className="mb-6">
        {/* API Status Indicator */}
        {loading && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading real-time state data from InvaStop API...
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
              <span className="mr-2">⚠️</span>
              {error} - No data available
            </div>
          </div>
        )}
        

        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        {/*  Invasive Species Map */}
        </h3>
        <p className="text-gray-600 text-center text-lg mb-6">
        {/*  Click on any state to see which invasive species are causing the most trouble there. */}
        </p>
      </div>

      <div className="relative">
        {Object.keys(stateMeta).length > 0 ? (
          <div className="relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={4}
              onLoad={onLoad}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#374151" }],
                  },
                  {
                    featureType: "administrative",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#2563eb" }], // Blue color for state names
                  },
                  {
                    featureType: "administrative",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#ffffff" }], // White outline for better visibility
                  },
                  {
                    featureType: "landscape",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#f9fafb" }],
                  },
                  {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#e0f2fe" }],
                  },
                ],
              }}
            >
              {infoWindow && selected && (
                <InfoWindow
                  position={infoWindow.position}
                  onCloseClick={() => {
                    setInfoWindow(null);
                    setSelectedState(null);
                    setCurrentSpeciesIndex(0);
                  }}
                >
                  <div className="p-3 sm:p-4 max-w-xs sm:max-w-md bg-white rounded-lg" style={{ minHeight: '400px', maxHeight: '500px' }}>
                    {/* Header Row - State and Species Counter */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-semibold text-gray-800 text-xs sm:text-sm">{infoWindow.featureName}</h5>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          selected.risk === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : selected.risk === 'moderate'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selected.risk === 'high' ? 'MANY PROBLEMS' : selected.risk === 'moderate' ? 'SOME PROBLEMS' : 'FEW PROBLEMS'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {currentSpeciesIndex + 1}/{selected.species.length}
                      </span>
                    </div>
                    
                    {/* Species Image with Navigation */}
                    <div className="relative mb-3">
                      <img 
                        src={getSpeciesImage(selected.species[currentSpeciesIndex].name)}
                        alt={selected.species[currentSpeciesIndex].name}
                        className="w-full h-36 sm:h-40 object-cover rounded-lg"
                        onError={(e) => {
                          // If the image fails to load, use the SVG fallback
                          const svgFallback = `data:image/svg+xml;base64,${btoa(`
                            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                              <rect width="300" height="200" fill="#4F46E5"/>
                              <text x="150" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Image Error</text>
                              <text x="150" y="125" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Failed to Load</text>
                            </svg>
                          `)}`;
                          e.currentTarget.src = svgFallback;
                        }}
                      />
                      
                      {/* Navigation Arrows */}
                      <button
                        onClick={prevSpecies}
                        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 p-1.5 rounded-full shadow-lg transition-all duration-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={nextSpecies}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 p-1.5 rounded-full shadow-lg transition-all duration-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Pagination Dots */}
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {selected.species.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full ${
                              index === currentSpeciesIndex ? 'bg-black' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Species Information - Compact Layout */}
                    <div className="space-y-2">
                      {/* Species Name and Type */}
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm sm:text-base font-bold text-gray-900">
                          {selected.species[currentSpeciesIndex].name}
                        </h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                          {getSpeciesType(selected.species[currentSpeciesIndex].name)}
                        </span>
                      </div>
                      
                      {/* Scientific Name */}
                      <p className="text-xs text-gray-600 italic mb-2">
                        {getScientificName(selected.species[currentSpeciesIndex].name)}
                      </p>
                      
                      {/* Risk Indicators Row */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                          selected.species[currentSpeciesIndex].impact === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : selected.species[currentSpeciesIndex].impact === 'Moderate'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Harm: {selected.species[currentSpeciesIndex].impact === 'High' ? 'High' : selected.species[currentSpeciesIndex].impact === 'Moderate' ? 'Medium' : 'Low'}
                        </span>
                        <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                          selected.species[currentSpeciesIndex].spread === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : selected.species[currentSpeciesIndex].spread === 'Moderate'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Spread: {selected.species[currentSpeciesIndex].spread === 'High' ? 'Fast' : selected.species[currentSpeciesIndex].spread === 'Moderate' ? 'Medium' : 'Slow'}
                        </span>
                      </div>
                      
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => {
                          const speciesName = selected.species[currentSpeciesIndex].name
                            .toLowerCase()
                            .replace(/\s+/g, "-");
                          navigate(`/species/${speciesName}?from=map`);
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={() => {
                          // Add to favorites or report functionality
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
            
          </div>
        ) : (
          <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              {loading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="text-lg text-gray-600">Loading interactive map...</p>
                  <p className="text-sm text-gray-500">Fetching data from InvaStop API</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-red-500 text-6xl">🗺️</div>
                  <p className="text-lg text-gray-600">Map data unavailable</p>
                  <p className="text-sm text-gray-500 max-w-md">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-gray-400 text-6xl">🗺️</div>
                  <p className="text-lg text-gray-600">No map data available</p>
                  <p className="text-sm text-gray-500">Check the console for debugging information</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;