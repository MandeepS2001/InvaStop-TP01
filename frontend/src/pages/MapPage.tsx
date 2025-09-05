import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';

const MapPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 object-contain" />
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/" className="text-white hover:text-green-200 transition-colors text-sm lg:text-base">
                Home
              </Link>
              <Link to="/map" className="text-green-200 font-medium text-sm lg:text-base">
                Map
              </Link>
              <Link to="/education" className="text-white hover:text-green-200 transition-colors text-sm lg:text-base">
                Species Profile
              </Link>
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
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/map" 
                className="block px-3 py-2 text-green-200 font-medium hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Map
              </Link>
              <Link 
                to="/education" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Species Profile
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <div className="pt-20 sm:pt-24">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Invasive Species Map
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                See where invasive plants and animals are causing problems across Australia. 
                Click on any state to find out which species are most harmful there.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Explore Detailed Species Distribution
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                View precise occurrence records and filter by species and year to understand the spread patterns of invasive species across Australia.
              </p>
              <button
                onClick={() => setShowInteractiveMap(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Open Interactive Distribution Map
              </button>
            </div>
          </div>
        </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <InteractiveMap />
      </div>

      {/* Additional Information Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🗺️</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Current Information</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our map shows up-to-date information about where invasive plants and animals are causing problems across Australia.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Problem Levels</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Each state is colored to show how many problems invasive species are causing there, helping you see which areas need the most help.
              </p>
            </div>
            
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🔍</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">More Details</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Click on any state to see which invasive species are causing the most trouble there and learn how to deal with them.
              </p>
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
                src="/map.html"
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
