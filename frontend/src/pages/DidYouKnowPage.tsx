import React from 'react';
import TaxonThreatChart from '../components/TaxonThreatChart';
import SeasonalMetrics from '../components/SeasonalMetrics';
import { Link } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther';
import SimpleHeader from '../components/SimpleHeader';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const getAustralianSeason = (date: Date): 'Summer' | 'Autumn' | 'Winter' | 'Spring' => {
  const month = date.getMonth() + 1; // 1-12
  if (month === 12 || month === 1 || month === 2) return 'Summer';
  if (month >= 3 && month <= 5) return 'Autumn';
  if (month >= 6 && month <= 8) return 'Winter';
  return 'Spring';
};

const DidYouKnowPage: React.FC = () => {
  const currentSeason = getAustralianSeason(new Date());

  return (
    <div className="relative min-h-screen bg-neutral-50">

            {/* Simple Header */}
            <SimpleHeader />

      {/* Hero Section - Edge to Edge */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <LiquidEther
            colors={['#22c55e', '#16a34a', '#15803d', '#166534']}
            mouseForce={16}
            cursorSize={130}
            isViscous={false}
            viscous={20}
            iterationsViscous={16}
            iterationsPoisson={16}
            dt={0.016}
            BFECC={true}
            resolution={0.6}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.8}
            takeoverDuration={0.3}
            autoResumeDelay={2000}
            autoRampDuration={0.8}
          />
        </div>
        
        {/* Dark overlay for text readability - with pointer-events-none to allow mouse events through */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="inline-block">
                  Did you Know?
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto">
                Learn about problem plants that affect farms and properties across Australia. See real stories and pictures of the impact.
              </p>
        </div>
      </section>

      <main className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-parallax-up"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300/15 rounded-full blur-3xl animate-parallax-down"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-3xl animate-parallax-up" style={{animationDelay: '5s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Removed old list section (SeasonalMetrics) per request */}

          {/* Simple Chart Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How Problem Plants Affect Australia</h2>
              <p className="text-gray-600">See which types of plants cause the most problems across the country</p>
            </div>
            <TaxonThreatChart />
          </div>

          {/* Removed: Real Stories from Australian Farms section */}

          {/* How Urgent Are These Plants */}
          <div className="mb-16">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <h3 className="text-center text-2xl font-semibold text-gray-900 mb-6">How Urgent Are These Plants?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-red-200 bg-red-100 p-6 text-center">
                  <div className="text-3xl mb-2">⚠️</div>
                  <div className="text-4xl font-bold text-red-700">5</div>
                  <div className="mt-1 font-semibold text-red-800">Act Now</div>
                  <p className="mt-2 text-sm text-red-700">These plants need quick action to stop them spreading</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-100 p-6 text-center">
                  <div className="text-3xl mb-2">👀</div>
                  <div className="text-4xl font-bold text-amber-700">0</div>
                  <div className="mt-1 font-semibold text-amber-800">Keep Watch</div>
                  <p className="mt-2 text-sm text-amber-700">Check on these plants regularly to make sure they don't spread</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-100 p-6 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-4xl font-bold text-emerald-700">0</div>
                  <div className="mt-1 font-semibold text-emerald-800">Under Control</div>
                  <p className="mt-2 text-sm text-emerald-700">These plants are being managed well and aren't spreading</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Next Steps */}
          <section className="relative py-12 sm:py-16 bg-gradient-to-br from-green-50 via-white to-green-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Help Your Property?</h3>
              <p className="text-lg text-gray-600 mb-8">Here's what you can do next:</p>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <span className="text-green-600 text-xl">🗺️</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Check Your Area</h4>
                </div>
                <p className="text-gray-600 mb-4">See what problem plants are found near your property</p>
                <Link
                  to="/map"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300"
                >
                  View Map
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <span className="text-blue-600 text-xl">📅</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Know the Seasons</h4>
                </div>
                <p className="text-gray-600 mb-4">Learn when problem plants are most active in your area</p>
                <Link
                  to="/epic5"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300"
                >
                  Check Seasons
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default DidYouKnowPage;


