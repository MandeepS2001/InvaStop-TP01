import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
import SimpleBarChart from '../components/SimpleBarChart';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

interface SeasonalData {
  season: string;
  total_sightings: number;
  top_species: Record<string, {
    count: number;
    locations: string[];
    months: number[];
    risk_level: string;
  }>;
  risk_summary: {
    high_risk: number;
    medium_risk: number;
    low_risk: number;
  };
  location: string;
  radius_km?: number;
}

const Epic5Page: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('Summer');
  const [postcode, setPostcode] = useState('3000');
  const [postcodeInput, setPostcodeInput] = useState('3000');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [seasonalData, setSeasonalData] = useState<SeasonalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const postcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClearPostcode = () => {
    setPostcodeInput('');
    setPostcode('');
  };

  // Fallback function to approximate postcode from coordinates
  const getApproximatePostcode = (lat: number, lng: number): string | null => {
    // Major Australian city coordinates and their primary postcodes
    const cityData = [
      { lat: -37.8136, lng: 144.9631, postcode: '3000', name: 'Melbourne' },
      { lat: -33.8688, lng: 151.2093, postcode: '2000', name: 'Sydney' },
      { lat: -27.4698, lng: 153.0251, postcode: '4000', name: 'Brisbane' },
      { lat: -31.9505, lng: 115.8605, postcode: '6000', name: 'Perth' },
      { lat: -34.9285, lng: 138.6007, postcode: '5000', name: 'Adelaide' },
      { lat: -42.8821, lng: 147.3272, postcode: '7000', name: 'Hobart' },
      { lat: -35.2809, lng: 149.1300, postcode: '2600', name: 'Canberra' },
      { lat: -12.4634, lng: 130.8456, postcode: '0800', name: 'Darwin' }
    ];

    // Find the closest city
    let closestCity = cityData[0];
    let minDistance = Math.sqrt(
      Math.pow(lat - closestCity.lat, 2) + Math.pow(lng - closestCity.lng, 2)
    );

    for (const city of cityData) {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    }

    // If within reasonable distance (roughly 50km), return the postcode
    if (minDistance < 0.5) { // Approximately 50km
      return closestCity.postcode;
    }

    return null;
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get postcode
          const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
          if (!apiKey) {
            throw new Error('Google Maps API key not configured');
          }
          
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          
          if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            // Look for postcode in address components
            const result = data.results[0];
            const postcodeComponent = result.address_components.find(
              (component: any) => component.types.includes('postal_code')
            );
            
            if (postcodeComponent) {
              const detectedPostcode = postcodeComponent.long_name;
              setPostcodeInput(detectedPostcode);
              setPostcode(detectedPostcode);
              setError(null); // Clear any previous errors
            } else {
              // Fallback: try to find postcode in formatted address
              const formattedAddress = result.formatted_address;
              const postcodeMatch = formattedAddress.match(/\b\d{4}\b/);
              if (postcodeMatch) {
                const detectedPostcode = postcodeMatch[0];
                setPostcodeInput(detectedPostcode);
                setPostcode(detectedPostcode);
                setError(null);
              } else {
                setError('Could not determine postcode for your location. Please enter it manually.');
              }
            }
          } else {
            if (data.status === 'REQUEST_DENIED') {
              console.log('Geocoding API access denied. Using fallback method...');
              // Fallback: Use approximate postcode based on coordinates
              const approximatePostcode = getApproximatePostcode(latitude, longitude);
              if (approximatePostcode) {
                setPostcodeInput(approximatePostcode);
                setPostcode(approximatePostcode);
                setError(null);
                console.log(`Using approximate postcode: ${approximatePostcode}`);
              } else {
                setError('Could not determine postcode for your location. Please enter it manually or try a major city postcode (e.g., 3000 for Melbourne, 2000 for Sydney).');
              }
            } else {
              throw new Error(`Geocoding failed: ${data.status || 'No results'}`);
            }
          }
        } catch (err) {
          console.error('Geocoding error:', err);
          setError('Could not determine postcode for your location. Please enter it manually or try a major city postcode (e.g., 3000 for Melbourne, 2000 for Sydney).');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please allow location access and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Fetch seasonal data when season or postcode changes (with debounce for postcode)
  useEffect(() => {
    const fetchSeasonalData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://invastopbackend.vercel.app/api/v1';
        const params = new URLSearchParams({
          season: selectedSeason,
          ...(postcode && { postcode })
        });
        
        const response = await fetch(`${apiUrl}/epic1/seasonal-risk?${params}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data = await response.json();
        setSeasonalData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load seasonal data');
        console.error('Error fetching seasonal data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce postcode changes - only fetch after user stops typing for 500ms
    const timeoutId = setTimeout(() => {
      fetchSeasonalData();
    }, postcode ? 500 : 0); // No delay for season changes, 500ms delay for postcode

    return () => clearTimeout(timeoutId);
  }, [selectedSeason, postcode]);

  // Get risk level color
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get risk level icon
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 object-contain" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Home</Link>
              <Link to="/education" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Species Profile</Link>
              <Link to="/insights" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Did you Know?</Link>
              <Link to="/map" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Map</Link>
              <Link to="/epic5" onClick={scrollToTop} className="px-4 py-2 text-white bg-green-600/60 border-green-500 rounded-md transition-all duration-200 font-medium shadow-md">Seasonal</Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white hover:text-green-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-green-700 border-t border-green-600">
            <div className="px-4 py-2 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                Home
              </Link>
              <Link 
                to="/education" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                Species Profile
              </Link>
              <Link 
                to="/insights" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                Did you Know?
              </Link>
              <Link 
                to="/map" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                Map
              </Link>
              <Link 
                to="/epic5" 
                className="block px-3 py-2 text-green-200 font-medium hover:bg-green-600 rounded-md transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                Seasonal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="pt-24">
        {/* Hero Section */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Seasonal Invasive Plant Risk
            </h1>
            
            {/* Controls */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-16">
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                <div className="flex items-center space-x-4">
                  <label className="text-xl font-bold text-gray-800">🌱 Select Season:</label>
                  <select 
                    value={selectedSeason} 
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold bg-white shadow-md"
                    disabled={loading}
                  >
                    <option value="Spring">🌸 Spring</option>
                    <option value="Summer">☀️ Summer</option>
                    <option value="Autumn">🍂 Autumn</option>
                    <option value="Winter">❄️ Winter</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="text-xl font-bold text-gray-800">📍 Enter Postcode:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={postcodeInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        console.log('Input change:', value);
                        setPostcodeInput(value);
                        
                        // Clear existing timeout
                        if (postcodeTimeoutRef.current) {
                          clearTimeout(postcodeTimeoutRef.current);
                        }
                        
                        // Set new timeout to update postcode
                        postcodeTimeoutRef.current = setTimeout(() => {
                          setPostcode(value);
                        }, 500);
                      }}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12 text-lg font-semibold shadow-md"
                      placeholder="3000"
                      disabled={loading || locationLoading}
                      maxLength={4}
                    />
                    {postcodeInput && (
                      <button
                        onClick={handleClearPostcode}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading || locationLoading}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleUseMyLocation}
                    disabled={loading || locationLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold shadow-md transition-all duration-200 flex items-center space-x-2"
                  >
                    {locationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-5 w-5" />
                        <span>Use my location</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-600">Loading seasonal data...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>Error: {error}</span>
                </div>
              </div>
            )}

            {/* No Data State */}
            {!loading && !error && (!seasonalData || seasonalData.total_sightings === 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-12 text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-yellow-800 mb-2">No Data Available</h3>
                <p className="text-yellow-700 mb-4">
                  No invasive species sightings found for {selectedSeason} in the selected area.
                </p>
                <p className="text-sm text-yellow-600">
                  Try selecting a different season or entering a different postcode.
                </p>
              </div>
            )}

            {/* Dynamic Content */}
            {seasonalData && !loading && seasonalData.total_sightings > 0 && (
              <>
                {/* Risk Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-12 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-blue-900">
                        {selectedSeason} Risk Summary
                      </h2>
                      <p className="text-blue-700 text-lg">for {seasonalData.location}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 text-center shadow-md border-2 border-gray-100 hover:border-blue-300 transition-all">
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        {seasonalData.total_sightings.toLocaleString()}
                      </div>
                      <div className="text-gray-600 font-medium">Total Sightings</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center shadow-md border-2 border-gray-100 hover:border-red-300 transition-all">
                      <div className="text-4xl font-bold text-red-600 mb-2">
                        {seasonalData.risk_summary.high_risk}
                      </div>
                      <div className="text-gray-600 font-medium">High Risk Species</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center shadow-md border-2 border-gray-100 hover:border-yellow-300 transition-all">
                      <div className="text-4xl font-bold text-yellow-600 mb-2">
                        {seasonalData.risk_summary.medium_risk}
                      </div>
                      <div className="text-gray-600 font-medium">Medium Risk Species</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center shadow-md border-2 border-gray-100 hover:border-green-300 transition-all">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {seasonalData.risk_summary.low_risk}
                      </div>
                      <div className="text-gray-600 font-medium">Low Risk Species</div>
                    </div>
                  </div>
                </div>
              </>
            )}

                   {/* Dynamic Critical Alert Card */}
                   {seasonalData && seasonalData.risk_summary.high_risk > 0 && (
                     <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 mb-12 shadow-2xl border-4 border-red-400">
                       {(() => {
                         // Find the highest risk species (highest count among high risk species)
                         const highRiskSpecies = Object.entries(seasonalData.top_species)
                           .filter(([_, data]) => data.risk_level === 'High')
                           .sort(([_, a], [__, b]) => b.count - a.count);
                         
                         const topHighRiskSpecies = highRiskSpecies[0];
                         
                         if (!topHighRiskSpecies) return null;
                         
                         const [speciesName, speciesData] = topHighRiskSpecies;
                         const imagePath = `/top10/${speciesName.replace(/\s+/g, '')}.png`;
                         
                         return (
                           <>
                             <div className="flex justify-between items-start mb-8">
                               <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                                 <div className="text-red-600 text-xl font-bold flex items-center">
                                   <AlertTriangle className="h-6 w-6 mr-2" />
                                   CRITICAL ALERT
                                 </div>
                               </div>
                               <div className="bg-yellow-400 rounded-full px-6 py-3 shadow-lg">
                                 <div className="text-red-800 text-xl font-bold">{speciesName}</div>
                               </div>
                             </div>
                             
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                               {/* Image */}
                               <div className="flex justify-center">
                                 <div className="w-80 h-64 bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-yellow-300 overflow-hidden">
                                   <img 
                                     src={imagePath} 
                                     alt={speciesName} 
                                     className="w-full h-full object-cover rounded-xl"
                                     onError={(e) => {
                                       // Fallback to emoji if image fails to load
                                       const target = e.target as HTMLImageElement;
                                       target.style.display = 'none';
                                       const fallback = target.nextElementSibling as HTMLElement;
                                       if (fallback) fallback.style.display = 'block';
                                     }}
                                   />
                                   <div className="text-center hidden">
                                     <div className="text-6xl mb-3">🌿</div>
                                     <div className="text-green-800 font-bold text-xl">{speciesName}</div>
                                     <div className="text-green-600 text-sm">Invasive plant species</div>
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Content */}
                               <div className="space-y-6">
                                 <div className="flex items-center space-x-3 text-white">
                                   <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                     <MapPin className="h-4 w-4 text-red-800" />
                                   </div>
                                   <span className="text-xl font-semibold">
                                     {speciesData.locations.length > 0 ? speciesData.locations.join(', ') : 'Multiple locations'}
                                   </span>
                                 </div>
                                 
                                 <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                   <h4 className="text-white font-bold text-lg mb-3">Risk Information:</h4>
                                   <ul className="space-y-3 text-green-100">
                                     <li className="flex items-start space-x-3">
                                       <span className="text-yellow-300 mt-1 text-lg">•</span>
                                       <span className="text-lg">
                                         <span className="text-yellow-300 font-bold">{speciesData.count.toLocaleString()}</span> sightings in {selectedSeason}
                                       </span>
                                     </li>
                                     <li className="flex items-start space-x-3">
                                       <span className="text-yellow-300 mt-1 text-lg">•</span>
                                       <span className="text-lg">
                                         High risk level - requires immediate attention
                                       </span>
                                     </li>
                                     <li className="flex items-start space-x-3">
                                       <span className="text-yellow-300 mt-1 text-lg">•</span>
                                       <span className="text-lg">
                                         Found in {speciesData.locations.length} location{speciesData.locations.length !== 1 ? 's' : ''}
                                       </span>
                                     </li>
                                   </ul>
                                 </div>
                                 
                                 <div className="pt-4">
                                   <button className="bg-yellow-400 hover:bg-yellow-300 text-red-800 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                                     🚨 Report Sighting
                                   </button>
                                 </div>
                               </div>
                             </div>
                           </>
                         );
                       })()}
                     </div>
                   )}
                   
                   {/* No High Risk Alert - Show Medium Risk instead */}
                   {seasonalData && seasonalData.risk_summary.high_risk === 0 && seasonalData.risk_summary.medium_risk > 0 && (
                     <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl p-8 mb-12 shadow-2xl border-4 border-yellow-400">
                       {(() => {
                         // Find the highest medium risk species
                         const mediumRiskSpecies = Object.entries(seasonalData.top_species)
                           .filter(([_, data]) => data.risk_level === 'Medium')
                           .sort(([_, a], [__, b]) => b.count - a.count);
                         
                         const topMediumRiskSpecies = mediumRiskSpecies[0];
                         
                         if (!topMediumRiskSpecies) return null;
                         
                         const [speciesName, speciesData] = topMediumRiskSpecies;
                         const imagePath = `/top10/${speciesName.replace(/\s+/g, '')}.png`;
                         
                         return (
                           <>
                             <div className="flex justify-between items-start mb-8">
                               <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                                 <div className="text-yellow-600 text-xl font-bold flex items-center">
                                   <AlertTriangle className="h-6 w-6 mr-2" />
                                   MODERATE ALERT
                                 </div>
                               </div>
                               <div className="bg-yellow-200 rounded-full px-6 py-3 shadow-lg">
                                 <div className="text-yellow-800 text-xl font-bold">{speciesName}</div>
                               </div>
                             </div>
                             
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                               {/* Image */}
                               <div className="flex justify-center">
                                 <div className="w-80 h-64 bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-yellow-300 overflow-hidden">
                                   <img 
                                     src={imagePath} 
                                     alt={speciesName} 
                                     className="w-full h-full object-cover rounded-xl"
                                     onError={(e) => {
                                       const target = e.target as HTMLImageElement;
                                       target.style.display = 'none';
                                       const fallback = target.nextElementSibling as HTMLElement;
                                       if (fallback) fallback.style.display = 'block';
                                     }}
                                   />
                                   <div className="text-center hidden">
                                     <div className="text-6xl mb-3">🌿</div>
                                     <div className="text-green-800 font-bold text-xl">{speciesName}</div>
                                     <div className="text-green-600 text-sm">Invasive plant species</div>
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Content */}
                               <div className="space-y-6">
                                 <div className="flex items-center space-x-3 text-white">
                                   <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center">
                                     <MapPin className="h-4 w-4 text-yellow-800" />
                                   </div>
                                   <span className="text-xl font-semibold">
                                     {speciesData.locations.length > 0 ? speciesData.locations.join(', ') : 'Multiple locations'}
                                   </span>
                                 </div>
                                 
                                 <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                   <h4 className="text-white font-bold text-lg mb-3">Risk Information:</h4>
                                   <ul className="space-y-3 text-yellow-100">
                                     <li className="flex items-start space-x-3">
                                       <span className="text-yellow-200 mt-1 text-lg">•</span>
                                       <span className="text-lg">
                                         <span className="text-yellow-200 font-bold">{speciesData.count.toLocaleString()}</span> sightings in {selectedSeason}
                                       </span>
                                     </li>
                                     <li className="flex items-start space-x-3">
                                       <span className="text-yellow-200 mt-1 text-lg">•</span>
                                       <span className="text-lg">
                                         Medium risk level - monitor closely
                                       </span>
                                     </li>
                                     <li className="flex items-start space-x-3">
                                       <span className="text-yellow-200 mt-1 text-lg">•</span>
                                       <span className="text-lg">
                                         Found in {speciesData.locations.length} location{speciesData.locations.length !== 1 ? 's' : ''}
                                       </span>
                                     </li>
                                   </ul>
                                 </div>
                                 
                                 <div className="pt-4">
                                   <button className="bg-yellow-200 hover:bg-yellow-100 text-yellow-800 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                                     📍 Report Sighting
                                   </button>
                                 </div>
                               </div>
                             </div>
                           </>
                         );
                       })()}
                     </div>
                   )}

            {/* Dynamic Species Cards */}
            {seasonalData && !loading && (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Top Invasive Species in {selectedSeason}
                  </h2>
                  <p className="text-gray-600 text-lg">Based on sighting data for {seasonalData.location}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Object.entries(seasonalData.top_species).slice(0, 6).map(([speciesName, data], index) => {
                    // Create image path for the species
                    const imagePath = `/top10/${speciesName.replace(/\s+/g, '')}.png`;
                    
                    return (
                      <div key={speciesName} className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-gray-300 transition-all transform hover:scale-105">
                        <div className="absolute top-4 left-4 z-10">
                          <div className={`w-8 h-8 ${getRiskColor(data.risk_level)} rounded-full flex items-center justify-center shadow-lg`}>
                            <span className="text-white text-sm font-bold">
                              {getRiskIcon(data.risk_level)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Species Image */}
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                          <img 
                            src={imagePath} 
                            alt={speciesName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to colored background with species name
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center hidden">
                            <div className="text-center">
                              <div className="text-4xl mb-2">🌿</div>
                              <div className="text-green-800 font-bold text-lg">{speciesName}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{speciesName}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              data.risk_level === 'High' ? 'bg-red-100 text-red-800 border-2 border-red-200' :
                              data.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200' :
                              'bg-green-100 text-green-800 border-2 border-green-200'
                            }`}>
                              {data.risk_level} Risk
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center bg-gray-50 rounded-lg p-3">
                              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                              <span className="font-semibold text-gray-700">{data.count.toLocaleString()} sightings</span>
                            </div>
                            
                            {data.locations.length > 0 && (
                              <div className="bg-blue-50 rounded-lg p-3">
                                <span className="font-medium text-blue-800">Found in:</span>
                                <div className="text-blue-700 mt-1">{data.locations.join(', ')}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

                   {/* Interactive Chart Section */}
                   {seasonalData && !loading && (
                     <div className="mb-12">
                       <SimpleBarChart
                         data={Object.entries(seasonalData.top_species).slice(0, 5).map(([name, data], index) => ({
                           name: name,
                           value: data.count,
                           color: data.risk_level === 'High' ? '#ef4444' : 
                                  data.risk_level === 'Medium' ? '#f59e0b' : '#10b981',
                           risk_level: data.risk_level,
                           locations: data.locations
                         }))}
                         title={`Top 5 Invasive Species in ${selectedSeason}`}
                         season={selectedSeason}
                       />
                     </div>
                   )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Logo and Copyright */}
            <div className="md:col-span-1 flex flex-col items-start">
              <div className="flex flex-col items-start mb-3">
                <img src="/Invastop-Logo.png" alt="InvaStop" className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain" />
              </div>
              <p className="text-green-100 text-sm">© 2025</p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3 text-sm">Products</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><Link to="/map" onClick={scrollToTop} className="hover:text-white transition-colors">Species Database</Link></li>
                  <li><Link to="/education" onClick={scrollToTop} className="hover:text-white transition-colors">Educational Resources</Link></li>
                  <li><Link to="/map" onClick={scrollToTop} className="hover:text-white transition-colors">Mapping Tools</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-3 text-sm">About Us</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><span className="hover:text-white transition-colors cursor-pointer">Who We Are</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Our Mission</span></li>
                </ul>
              </div>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Epic5Page;
