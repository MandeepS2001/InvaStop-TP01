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
          <p className="mt-2 text-gray-600">Loading seasonal insights...</p>
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full mr-4">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {currentSeason} Invasive Species Insights
          </h2>
          <p className="text-gray-600">Real-time data from our monitoring network</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Sightings */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border-2 border-blue-200">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {metricsData.total_sightings.toLocaleString()}
          </div>
          <div className="text-blue-800 font-medium">Total Sightings</div>
          <div className="text-sm text-blue-600 mt-1">This {currentSeason.toLowerCase()}</div>
        </div>

        {/* High Risk Species */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center border-2 border-red-200">
          <div className="text-3xl mb-2">🚨</div>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {metricsData.risk_summary.high_risk}
          </div>
          <div className="text-red-800 font-medium">High Risk Species</div>
          <div className="text-sm text-red-600 mt-1">Require immediate attention</div>
        </div>

        {/* Most Common Species */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center border-2 border-yellow-200">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-lg font-bold text-yellow-600 mb-1">
            {mostCommonSpecies ? mostCommonSpecies[0] : 'N/A'}
          </div>
          <div className="text-yellow-800 font-medium">Most Common</div>
          <div className="text-sm text-yellow-600 mt-1">
            {mostCommonSpecies ? `${mostCommonSpecies[1].count.toLocaleString()} sightings` : 'No data'}
          </div>
        </div>

        {/* Coverage Area */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border-2 border-green-200">
          <div className="text-3xl mb-2">🌏</div>
          <div className="text-lg font-bold text-green-600 mb-1">Australia-wide</div>
          <div className="text-green-800 font-medium">Coverage</div>
          <div className="text-sm text-green-600 mt-1">All states & territories</div>
        </div>
      </div>

      {/* Top Species Breakdown */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Top 3 Species This {currentSeason}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topSpecies.map(([speciesName, data], index) => (
            <div key={speciesName} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md border-2 border-gray-200">
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
                      <span className="text-lg">🌿</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{speciesName}</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getRiskColor(data.risk_level)}`}>
                      <span className="mr-1">{getRiskIcon(data.risk_level)}</span>
                      {data.risk_level}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">#{index + 1}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sightings:</span>
                  <span className="font-bold text-gray-800">{data.count.toLocaleString()}</span>
                </div>
                {data.locations.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Locations:</span>
                    <span className="text-sm font-medium text-gray-700">{data.locations.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Risk Level Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {metricsData.risk_summary.high_risk}
            </div>
            <div className="text-red-800 font-medium">High Risk</div>
            <div className="text-sm text-red-600">Immediate action needed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {metricsData.risk_summary.medium_risk}
            </div>
            <div className="text-yellow-800 font-medium">Medium Risk</div>
            <div className="text-sm text-yellow-600">Monitor closely</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {metricsData.risk_summary.low_risk}
            </div>
            <div className="text-green-800 font-medium">Low Risk</div>
            <div className="text-sm text-green-600">Under control</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-2">
            📍 Want to see data for your specific area?
          </p>
          <p className="text-sm text-gray-600">
            Visit our <a href="/epic5" className="text-green-600 hover:text-green-700 font-bold underline">Seasonal Risk page</a> to enter your postcode and get localized insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeasonalMetrics;
