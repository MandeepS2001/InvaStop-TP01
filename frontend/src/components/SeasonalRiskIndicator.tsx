import React, { useState, useEffect } from 'react';

interface SeasonalRiskIndicatorProps {
  speciesName: string;
  className?: string;
}

interface SeasonalRiskData {
  season: string;
  risk_level: string;
  sightings: number;
}

const SeasonalRiskIndicator: React.FC<SeasonalRiskIndicatorProps> = ({ 
  speciesName, 
  className = "" 
}) => {
  const [riskData, setRiskData] = useState<SeasonalRiskData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRiskData = async () => {
      setLoading(true);
      try {
        // Get current season
        const month = new Date().getMonth() + 1;
        let season = 'Summer';
        if (month >= 9 && month <= 11) season = 'Spring';
        else if (month >= 12 || month <= 2) season = 'Summer';
        else if (month >= 3 && month <= 5) season = 'Autumn';
        else if (month >= 6 && month <= 8) season = 'Winter';

        const apiUrl = process.env.REACT_APP_API_URL || 'https://invastopbackend.vercel.app/api/v1';
        const response = await fetch(`${apiUrl}/epic1/seasonal-risk?season=${season}`);
        
        if (response.ok) {
          const data = await response.json();
          const speciesData = data.top_species[speciesName];
          
          if (speciesData) {
            setRiskData({
              season,
              risk_level: speciesData.risk_level,
              sightings: speciesData.count
            });
          }
        }
      } catch (error) {
        console.error('Error fetching seasonal risk data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [speciesName]);

  if (loading) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ${className}`}>
        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600 mr-1"></div>
        Loading...
      </div>
    );
  }

  if (!riskData) {
    return null;
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(riskData.risk_level)} ${className}`}>
      <span className="mr-1">{getRiskIcon(riskData.risk_level)}</span>
      <span>{riskData.risk_level} Risk</span>
      <span className="ml-1 text-xs opacity-75">({riskData.sightings} sightings)</span>
    </div>
  );
};

export default SeasonalRiskIndicator;
