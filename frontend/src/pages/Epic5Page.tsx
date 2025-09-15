import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Epic5Page: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('Summer');
  const [postcode, setPostcode] = useState('3000');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClearPostcode = () => {
    setPostcode('');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 object-contain" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Home</Link>
              <Link to="/education" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Species Profile</Link>
              <Link to="/insights" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Did you Know?</Link>
              <Link to="/map" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Map</Link>
              <Link to="/epic5" onClick={scrollToTop} className="px-4 py-2 text-white bg-green-600/60 border-green-500 rounded-md transition-all duration-200 font-medium shadow-md">Seasonal</Link>
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
                className="block px-3 py-2 text-green-200 font-medium hover:bg-green-600 rounded-md transition-colors"
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

      {/* Main Content Area */}
      <div className="pt-24">
        {/* Hero Section */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Seasonal Invasive Plant Risk
            </h1>
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-semibold text-gray-700">Select Season:</label>
                <select 
                  value={selectedSeason} 
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Autumn">Autumn</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-lg font-semibold text-gray-700">Enter Postcode:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                    placeholder="3000"
                  />
                  {postcode && (
                    <button
                      onClick={handleClearPostcode}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Critical Gamba Grass Card */}
            <div className="bg-green-800 rounded-2xl p-8 mb-12 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="text-red-500 text-2xl font-bold">!! Critical !!</div>
                <div className="text-orange-500 text-2xl font-bold">Gamba Grass</div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="flex justify-center">
                  <div className="w-80 h-64 bg-green-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">Grass</div>
                      <div className="text-green-700 font-semibold">Gamba Grass</div>
                      <div className="text-green-600 text-sm">Dense clump of tall grass</div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-white">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-lg">Queensland, Northern Territory</span>
                  </div>
                  
                  <ul className="space-y-3 text-green-100">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-300 mt-1">-</span>
                      <span>Grows actively during wet seasons</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-300 mt-1">-</span>
                      <span>Peak growth occurs in <span className="text-red-400 font-bold">summer</span> and <span className="text-red-400 font-bold">autumn</span></span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-300 mt-1">-</span>
                      <span>Seeds germinate after rainfall events</span>
                    </li>
                  </ul>
                  
                  <div className="pt-4">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Invasive Species */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Other High-Risk Species</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lantana */}
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="absolute top-2 left-2 z-10">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div className="w-full h-48 bg-yellow-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">Flower</div>
                      <div className="text-yellow-700 font-semibold">Lantana</div>
                    </div>
                  </div>
                </div>

                {/* Grass Species */}
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="absolute top-2 left-2 z-10">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div className="w-full h-48 bg-green-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">Plant</div>
                      <div className="text-green-700 font-semibold">Grass Species</div>
                    </div>
                  </div>
                </div>

                {/* Cane Toad */}
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="absolute top-2 left-2 z-10">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div className="w-full h-48 bg-brown-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">Toad</div>
                      <div className="text-brown-700 font-semibold">Cane Toad</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Invasive Plant Sightings</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">Chart</div>
                  <div className="text-gray-600 font-semibold">Sightings Trend Chart</div>
                  <div className="text-gray-500 text-sm">2014-2024: 75 to 325 sightings</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Copyright */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/Invastop-Logo.png" alt="InvaStop" className="h-8 w-8" />
                <span className="text-xl font-bold">invastop</span>
              </div>
              <p className="text-green-100">© 2025</p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-4">Produtos</h3>
                <ul className="space-y-2 text-green-100">
                  <li><a href="#" className="hover:text-white transition-colors">Ervas</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Flores</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cactos</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Sobre nós</h3>
                <ul className="space-y-2 text-green-100">
                  <li><a href="#" className="hover:text-white transition-colors">Quem somos?</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Trabalhe com a gente</h3>
                <ul className="space-y-2 text-green-100">
                  <li><a href="#" className="hover:text-white transition-colors">Entre em contato com nosso email</a></li>
                  <li><a href="mailto:EnvironmentalHealth@hv.sistem.com" className="hover:text-white transition-colors">EnvironmentalHealth@hv.sistem.com</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Epic5Page;
