import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

interface SeasonalMetricsData {
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

const SeasonalMetrics: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState('Summer');
  const [metricsData, setMetricsData] = useState<SeasonalMetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine current season based on month
  useEffect(() => {
    const month = new Date().getMonth() + 1; // 1-12
    let season = 'Summer';
    
    if (month >= 9 && month <= 11) season = 'Spring';
    else if (month >= 12 || month <= 2) season = 'Summer';
    else if (month >= 3 && month <= 5) season = 'Autumn';
    else if (month >= 6 && month <= 8) season = 'Winter';
    
    setCurrentSeason(season);
  }, []);

  // Fetch seasonal metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://invastopbackend.vercel.app/api/v1';
        const response = await fetch(`${apiUrl}/epic1/seasonal-risk?season=${currentSeason}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data = await response.json();
        setMetricsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
        console.error('Error fetching seasonal metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [currentSeason]);

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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading seasonal information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Unable to load seasonal data</p>
        </div>
      </div>
    );
  }

  if (!metricsData) return null;

  const topSpecies = Object.entries(metricsData.top_species).slice(0, 3);
  const mostCommonSpecies = topSpecies[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          What's Happening This {currentSeason}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Here's what we're seeing with problem plants across Australia right now
        </p>
      </div>

      {/* Main Content - Story Format */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">🌿</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {metricsData.total_sightings.toLocaleString()}
              </div>
              <div className="text-lg text-gray-600">problem plants found this {currentSeason.toLowerCase()}</div>
            </div>
          </div>
          <p className="text-center text-gray-700 text-lg">
            That's a lot of plants causing problems for farmers and property owners across Australia!
          </p>
        </div>

        {/* Top Problem Plants - Story Format */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            The Most Common Problem Plants Right Now
          </h3>
          
          <div className="space-y-6">
            {topSpecies.map(([speciesName, data], index) => (
              <div key={speciesName} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-all">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                      <img 
                        src={`/top10/${speciesName.replace(/\s+/g, '')}.png`}
                        alt={speciesName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center hidden">
                        <span className="text-5xl">🌿</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-800">{speciesName}</h4>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getRiskColor(data.risk_level)}`}>
                        <span className="mr-1">{getRiskIcon(data.risk_level)}</span>
                        {data.risk_level} Priority
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      This plant has been found <strong>{data.count.toLocaleString()} times</strong> across <strong>{data.locations.length} different areas</strong> this {currentSeason.toLowerCase()}.
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>#{index + 1} most common</span>
                      <span>•</span>
                      <span>Found in {data.locations.length} locations</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Information - Simple Format */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            How Urgent Are These Plants?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-3">⚠️</div>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {metricsData.risk_summary.high_risk}
              </div>
              <h4 className="text-xl font-bold text-red-800 mb-2">Act Now</h4>
              <p className="text-red-600">These plants need quick action to stop them spreading</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl border-2 border-yellow-200">
              <div className="text-4xl mb-3">👀</div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {metricsData.risk_summary.medium_risk}
              </div>
              <h4 className="text-xl font-bold text-yellow-800 mb-2">Keep Watch</h4>
              <p className="text-yellow-600">Check on these plants regularly to make sure they don't spread</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl border-2 border-green-200">
              <div className="text-4xl mb-3">✅</div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {metricsData.risk_summary.low_risk}
              </div>
              <h4 className="text-xl font-bold text-green-800 mb-2">Under Control</h4>
              <p className="text-green-600">These plants are being managed well and aren't spreading</p>
            </div>
          </div>
        </div>

        {/* Call to Action - Simple and Friendly */}
        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Want to Check Your Local Area?</h3>
          <p className="text-lg text-gray-600 mb-6">
            See what problem plants are active in your specific area and when they're most likely to spread.
          </p>
          <a 
            href="/epic5" 
            className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="mr-2">Check My Area</span>
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SeasonalMetrics;
