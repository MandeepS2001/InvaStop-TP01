import React, { useState } from 'react';
import TaxonThreatChart from '../components/TaxonThreatChart';
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
                  Discover the real impact of invasive species on Australian wildlife through data-driven insights and visualizations.
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

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-10">
            <TaxonThreatChart />
          </div>

          {/* Additional insights placeholders using existing data */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold text-lg mb-2">Top impacted group</h2>
              <p className="text-gray-600 text-sm">Plants remain the most impacted group across Australia.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold text-lg mb-2">Species with broadest impact</h2>
              <p className="text-gray-600 text-sm">Red Fox shows wide impact across mammals and birds.</p>
            </div>
          </section>

          {/* CTA to Map */}
          <section className="relative py-12 sm:py-16 bg-gradient-to-br from-green-50 via-white to-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-green-200/40 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Explore Interactive Species Map</h3>
                  <p className="text-gray-600">Discover where invasive species are found across Australia and learn about their distribution patterns in real-time.</p>
                </div>
                <div>
                  <Link
                    to="/map"
                    onClick={scrollToTop}
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transform hover:scale-105 border-2 border-green-500/20 hover:border-green-400/40"
                  >
                    <span className="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">🗺️</span>
                    <span className="group-hover:tracking-wide transition-all duration-300">View Interactive Map</span>
                    <span className="ml-3 text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link to="/education" onClick={scrollToTop} className="text-gray-300 hover:text-white transition-colors">Species Profile</Link></li>
                <li><Link to="/map" onClick={scrollToTop} className="text-gray-300 hover:text-white transition-colors">Interactive Map</Link></li>
                <li><Link to="/insights" onClick={scrollToTop} className="text-gray-300 hover:text-white transition-colors">Data Insights</Link></li>
              </ul>
            </div>
            
            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300 text-sm">
                InvaStop helps farmers and property owners identify and manage invasive species threatening their land and local ecosystems.
              </p>
            </div>
            
            {/* Logo */}
            <div className="flex justify-center md:justify-end">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-16 w-16 object-contain" />
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 InvaStop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DidYouKnowPage;


