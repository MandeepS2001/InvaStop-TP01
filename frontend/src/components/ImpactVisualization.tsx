// Archived component (kept for future use). To re-enable, re-import and render it.
import React, { useState, useEffect } from 'react';
import { TrendingUp, TreePine, Droplets, Sun, Heart, Shield, CheckCircle } from 'lucide-react';
import api from '../services/api';

interface ImpactData {
  before: {
    invasiveCoverage: number;
    biodiversity: number;
    waterQuality: number;
    soilHealth: number;
    fireRisk: number;
  };
  after: {
    invasiveCoverage: number;
    biodiversity: number;
    waterQuality: number;
    soilHealth: number;
    fireRisk: number;
  };
  benefits: {
    carbonSequestration: number;
    waterSaved: number;
    speciesProtected: number;
    economicValue: number;
  };
}

const ImpactVisualization: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const fetchData = (stateCode?: string) => {
    setLoading(true);
    setError(null);
    const params = stateCode && stateCode !== 'ALL' ? { state: stateCode } : {};
    api.get('/impact/summary', { params })
      .then((res) => {
        setData(res.data as ImpactData);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
      })
      .catch(() => setError('Failed to load impact data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchData(selectedState);
    }
  }, [selectedState]);

  const AnimatedBar: React.FC<{
    label: string;
    beforeValue: number;
    afterValue: number;
    color: string;
    icon: React.ReactNode;
    unit?: string;
  }> = ({ label, beforeValue, afterValue, color, icon, unit = '%' }) => {
    const [animatedValue, setAnimatedValue] = useState(beforeValue);

    useEffect(() => {
      if (showAnimation) {
        const timer = setTimeout(() => {
          setAnimatedValue(afterValue);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        setAnimatedValue(afterValue);
      }
    }, [showAnimation, afterValue]);

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gray-100 rounded-lg mr-3">
            {icon}
          </div>
          <h3 className="font-bold text-gray-900">{label}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Before</span>
              <span>{beforeValue}{unit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-red-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${beforeValue}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>After</span>
              <span>{animatedValue}{unit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`${color} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${animatedValue}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BenefitCard: React.FC<{ 
    title: string; 
    value: string; 
    description: string; 
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, description, icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className={`p-3 ${color} rounded-lg mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">See the Positive Impact</h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover how removing invasive plants transforms your land and benefits the environment
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-3">
          <label className="text-sm font-medium text-gray-700">Scope:</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="ALL">Australia (national)</option>
            <option value="VIC">Victoria (VIC)</option>
            <option value="NSW">New South Wales (NSW)</option>
            <option value="QLD">Queensland (QLD)</option>
            <option value="SA">South Australia (SA)</option>
            <option value="WA">Western Australia (WA)</option>
            <option value="TAS">Tasmania (TAS)</option>
            <option value="NT">Northern Territory (NT)</option>
            <option value="ACT">Australian Capital Territory (ACT)</option>
          </select>
          {loading && <span className="text-gray-600 text-sm">Loading…</span>}
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>

        {data && (
          <>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Environmental Impact: Before vs After
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatedBar
                  label="Invasive Plant Coverage"
                  beforeValue={data.before.invasiveCoverage}
                  afterValue={data.after.invasiveCoverage}
                  color="bg-red-400"
                  icon={<TreePine className="h-5 w-5 text-red-600" />}
                />
                <AnimatedBar
                  label="Biodiversity Health"
                  beforeValue={data.before.biodiversity}
                  afterValue={data.after.biodiversity}
                  color="bg-green-500"
                  icon={<Heart className="h-5 w-5 text-green-600" />}
                />
                <AnimatedBar
                  label="Water Quality"
                  beforeValue={data.before.waterQuality}
                  afterValue={data.after.waterQuality}
                  color="bg-blue-500"
                  icon={<Droplets className="h-5 w-5 text-blue-600" />}
                />
                <AnimatedBar
                  label="Soil Health"
                  beforeValue={data.before.soilHealth}
                  afterValue={data.after.soilHealth}
                  color="bg-yellow-500"
                  icon={<Sun className="h-5 w-5 text-yellow-600" />}
                />
                <AnimatedBar
                  label="Fire Risk Reduction"
                  beforeValue={100 - data.before.fireRisk}
                  afterValue={100 - data.after.fireRisk}
                  color="bg-orange-500"
                  icon={<Shield className="h-5 w-5 text-orange-600" />}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🌟 Benefits You'll Achieve</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BenefitCard
                  title="Carbon Sequestration"
                  value={`${data.benefits.carbonSequestration} tonnes/year`}
                  description="Native plants store more carbon, helping fight climate change"
                  icon={<TreePine className="h-6 w-6 text-white" />}
                  color="bg-green-500"
                />
                <BenefitCard
                  title="Water Conservation"
                  value={`${(data.benefits.waterSaved / 1000).toLocaleString()}k L/year`}
                  description="Reduced water usage and improved water retention"
                  icon={<Droplets className="h-6 w-6 text-white" />}
                  color="bg-blue-500"
                />
                <BenefitCard
                  title="Species Protected"
                  value={`${data.benefits.speciesProtected} species`}
                  description="Native wildlife and plants thrive in restored habitat"
                  icon={<Heart className="h-6 w-6 text-white" />}
                  color="bg-purple-500"
                />
                <BenefitCard
                  title="Economic Value"
                  value={`$${data.benefits.economicValue.toLocaleString()}/year`}
                  description="Increased property value and reduced management costs"
                  icon={<TrendingUp className="h-6 w-6 text-white" />}
                  color="bg-yellow-500"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Story</h3>
                <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                  "After targeted removal of invasive plants, we've seen biodiversity rebound and fire risk fall dramatically."
                </p>
              </div>
            </div>
          </>
        )}

        {!data && !loading && !error && (
          <div className="text-center text-gray-600">No data available.</div>
        )}
      </div>
    </div>
  );
};

export default ImpactVisualization;
