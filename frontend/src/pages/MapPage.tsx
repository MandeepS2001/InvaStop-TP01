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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
      <div className="pt-20 sm:pt-24">
        {/* Enhanced Header Section */}
        <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
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
          {/* Information Cards - Moved to top of map section */}
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div 
                className="group relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-4 sm:p-6 text-center overflow-hidden transform hover:scale-105 hover:-rotate-1 transition-all duration-500"
                onMouseEnter={() => setHoveredCard('current')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Floating particles around each card */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`particle-current-${i}`}
                      className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-float"
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
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-xl sm:text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">Current Information</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Our map shows up-to-date information about where invasive plants and animals are causing problems across Australia.
                  </p>
                </div>
              </div>
              
              {/* Replaced card: Species Colors & Filters (no CTA since it's next to the map) */}
              <div 
                className="group relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-4 sm:p-6 text-center overflow-hidden transform hover:scale-105 hover:-rotate-1 transition-all duration-500"
                onMouseEnter={() => setHoveredCard('legend')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`particle-legend-${i}`}
                      className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
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
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-xl sm:text-2xl">🎨</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Species Colors & Filters</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Use the colored chips to filter species and check the legend on the map to see what each color means. Adjust the year range to explore trends over time.
                  </p>
                </div>
              </div>
              
              <div 
                className="group relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-4 sm:p-6 text-center overflow-hidden transform hover:scale-105 hover:-rotate-1 transition-all duration-500 sm:col-span-2 lg:col-span-1"
                onMouseEnter={() => setHoveredCard('details')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Floating particles around each card */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`particle-details-${i}`}
                      className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-float"
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
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-xl sm:text-2xl">🔍</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">More Details</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Click on any state to see which invasive species are causing the most trouble there and learn how to deal with them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Call-to-Action Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Map Container - Takes 3/4 of the width */}
            <div className="lg:col-span-3">
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

            {/* Call-to-Action Card - Takes 1/4 of the width */}
            <div className="lg:col-span-1">
              <div className="relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 overflow-hidden h-fit">
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
                
                <div className="relative z-10 text-center">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    Explore Detailed Species Distribution
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    View precise occurrence records and filter by species and year to understand the spread patterns of invasive species across Australia.
                  </p>
                  <button
                    onClick={() => setShowInteractiveMap(true)}
                    className="group inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 text-sm shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transform hover:scale-105 border-2 border-green-500/20 hover:border-green-400/40"
                  >
                    <span className="mr-2 text-lg group-hover:rotate-12 transition-transform duration-300">🗺️</span>
                    <span className="group-hover:tracking-wide transition-all duration-300">Open Interactive Distribution Map</span>
                    <span className="ml-2 text-sm group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  <li><a href="#" className="hover:text-white transition-colors">Species Database</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Educational Resources</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Mapping Tools</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-3 text-sm">About Us</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Who We Are</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                </ul>
              </div>
              
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Map Overlay Modal */}
      {showInteractiveMap && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Interactive Species Distribution Map
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
            
            {/* Modal Content - Interactive Map */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`/map.html?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}&_=${Date.now()}`}
                className="w-full h-full border-0"
                title="Interactive Species Distribution Map"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MapPage;
