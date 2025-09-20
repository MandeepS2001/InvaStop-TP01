import React, { useState } from 'react';
import TaxonThreatChart from '../components/TaxonThreatChart';
import SeasonalMetrics from '../components/SeasonalMetrics';
import { Link } from 'react-router-dom';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const DidYouKnowPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
            {/* Logo */}
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 object-contain" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Home</Link>
              <Link to="/education" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Species Profile</Link>
              <Link to="/insights" onClick={scrollToTop} className="px-4 py-2 text-white bg-green-600/60 border-green-500 rounded-md transition-all duration-200 font-medium shadow-md">Did you Know?</Link>
              <Link to="/map" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Map</Link>
              <Link to="/epic5" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Seasonal</Link>
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
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
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

      {/* Hero Section - Edge to Edge */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-12 sm:py-16 lg:py-20 pt-20 sm:pt-24 lg:pt-32 w-full overflow-visible">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-300/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
          
          {/* Larger Floating Elements */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`large-${i}`}
              className="absolute w-2 h-2 bg-green-400/20 rounded-full animate-float-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 6}s`
              }}
            ></div>
          ))}
          
          {/* Morphing Background Shapes */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-green-500/10 animate-morph"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-green-400/15 animate-morph" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-300/20 animate-morph" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="inline-block">
                  Did you Know?
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-green-100">
                <span className="inline-block">
                  Learn about problem plants that affect farms and properties across Australia. See real stories and pictures of the impact.
                </span>
              </p>
            </div>
          </div>
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

          {/* Seasonal Information Section */}
          <SeasonalMetrics />

          {/* Simple Chart Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How Problem Plants Affect Australia</h2>
              <p className="text-gray-600">See which types of plants cause the most problems across the country</p>
            </div>
            <TaxonThreatChart />
          </div>

          {/* Simple Plant Stories */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Real Stories from Australian Farms</h2>
              <p className="text-lg text-gray-600">See how problem plants affect properties just like yours</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Story 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-red-600 text-2xl">🌿</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Lantana Takes Over</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">"Within two years, Lantana had covered half my property. It was impossible to walk through some areas."</p>
                <div className="text-xs text-gray-500">- Farmer from Queensland</div>
              </div>

              {/* Story 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-orange-600 text-2xl">🌿</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Blackberry Bush Problem</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">"The blackberry bushes got so thick, they blocked access to my dam. I had to cut a new path."</p>
                <div className="text-xs text-gray-500">- Property owner from Victoria</div>
              </div>

              {/* Story 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-yellow-600 text-2xl">🌿</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Gorse Spreading Fast</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">"Gorse started in one corner and now it's spreading to my neighbor's property too."</p>
                <div className="text-xs text-gray-500">- Landowner from Tasmania</div>
              </div>
            </div>
          </section>

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
                <h3 className="font-bold mb-3 text-sm">Company</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><Link to="/" onClick={scrollToTop} className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/insights" onClick={scrollToTop} className="hover:text-white transition-colors">Plant Information</Link></li>
                  <li><Link to="/map" onClick={scrollToTop} className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DidYouKnowPage;


