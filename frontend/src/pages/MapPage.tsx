import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import LiquidEther from '../components/LiquidEther';
import SimpleHeader from '../components/SimpleHeader';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const parallaxElements = parallaxRef.current.querySelectorAll('.parallax-element');
        parallaxElements.forEach((element, index) => {
          const speed = 0.3 + (index * 0.1);
          (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Check for URL parameter to auto-open interactive map
  useEffect(() => {
    const openInteractive = searchParams.get('openInteractive');
    if (openInteractive === 'true') {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShowInteractiveMap(true);
        // Remove the parameter from URL without causing a page reload
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('openInteractive');
        window.history.replaceState({}, '', newUrl.toString());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  return (
    <div className="min-h-screen">
            {/* Simple Header */}
            <SimpleHeader />

      {/* Page Content */}
      <div>
        {/* Enhanced Header Section */}
        <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          {/* LiquidEther Background */}
          <div className="absolute inset-0 w-full h-full z-0">
            <LiquidEther
              colors={['#22c55e', '#16a34a', '#15803d', '#166534']}
              mouseForce={17}
              cursorSize={135}
              isViscous={false}
              viscous={21}
              iterationsViscous={17}
              iterationsPoisson={17}
              dt={0.0165}
              BFECC={true}
              resolution={0.62}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.32}
              autoIntensity={1.85}
              takeoverDuration={0.27}
              autoResumeDelay={1700}
              autoRampDuration={0.65}
            />
          </div>
          
          {/* Dark overlay for text readability - with pointer-events-none to allow mouse events through */}
          <div className="absolute inset-0 bg-black/17 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="inline-block">
                What's on Your Land?
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto">
              See where harmful plants and animals are in Australia. 
              Click on a state to learn which ones cause the most problems there.
            </p>
          </div>
        </div>


      {/* Enhanced Map Section */}
      <div ref={parallaxRef} className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-48 h-48 bg-green-200/15 rounded-full blur-3xl animate-parallax-up parallax-element"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-300/10 rounded-full blur-3xl animate-parallax-down parallax-element"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Call-to-Action Card on top */}
          <div className="mb-6">
            <div className="relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-4 sm:p-6 overflow-hidden">
              {/* Floating particles around the card */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`cta-particle-${i}`}
                    className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-float parallax-element"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Explore Detailed Species Distribution
                  </h2>
                </div>
                <button
                  onClick={() => setShowInteractiveMap(true)}
                  className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 text-sm shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transform hover:scale-105 border-2 border-green-500/20 hover:border-green-400/40"
                >
                  <span className="mr-2 text-lg group-hover:rotate-12 transition-transform duration-300">🗺️</span>
                  <span className="group-hover:tracking-wide transition-all duration-300">Where They Are Map</span>
                  <span className="ml-2 text-sm group-hover:translate-x-2 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Map Container - Full width */}
          <div>
            {isLoading ? (
              // Skeleton Loading State
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 animate-pulse">
                <div className="h-96 bg-gray-300 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 sm:p-8 overflow-hidden">
                {/* Floating particles around the map */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`map-particle-${i}`}
                      className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-float parallax-element"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                <div className="relative z-10">
                  <InteractiveMap />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Interactive Map Overlay Modal */}
      {showInteractiveMap && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                Trouble Tracker
              </h3>
              <button
                onClick={() => setShowInteractiveMap(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto">
              {/* Enhanced Information Cards - Scrollable */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Real-Time Data Card */}
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 text-center transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Live Data Feed</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get real-time updates on invasive species sightings across Australia. Our data comes directly from scientific surveys and citizen reports.
                    </p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Live Updates
                    </div>
                  </div>
                  
                  {/* Interactive Controls Card */}
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 text-center transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Smart Filters</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Filter by species, time period, and location. Each species has its own color code to help you quickly identify patterns and trends.
                    </p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Interactive Exploration Card */}
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 text-center transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Explore & Learn</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Click any state to discover which invasive species are most problematic there and get actionable insights for your area.
                    </p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Interactive
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Content - Interactive Map */}
              <div className="h-[70vh] min-h-[500px]">
                <iframe
                  src={`/map.html?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}&_=${Date.now()}`}
                  className="w-full h-full border-0"
                  title="Trouble Tracker"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MapPage;
