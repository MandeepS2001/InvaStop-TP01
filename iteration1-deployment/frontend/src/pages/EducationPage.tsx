import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const speciesList: { name: string; image: string }[] = [
  { name: 'Lantana', image: '/top10/Lantana.png' },
  { name: 'Bitou Bush', image: '/top10/BitouBush.png' },
  { name: 'Common Myna', image: '/top10/CommonMyna.png' },
  { name: 'European Rabbit', image: '/top10/EuropeanRabbit.jpg' },
  { name: 'Red Fox', image: '/top10/RedFox.png' },
  { name: 'Gorse', image: '/top10/Gorse.png' },
  { name: 'Buffel Grass', image: '/top10/BuffelGrass.png' },
  { name: 'Cane Toad', image: '/top10/CaneToad.png' },
  { name: 'Feral Pig', image: '/top10/FeralPig.png' },
  { name: 'Gamba Grass', image: '/top10/GambaGrass.png' },
];

const EducationPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-16 w-16 sm:h-24 sm:w-24 md:h-40 md:w-40 lg:h-60 lg:w-60 object-contain" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-green-200 transition-colors">Home</Link>
              <Link to="/education" className="text-white hover:text-green-200 transition-colors font-semibold">Species Profile</Link>
              <Link to="/map" className="text-white hover:text-green-200 transition-colors">Map</Link>
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
                to="/education" 
                className="block px-3 py-2 text-green-200 font-medium hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Species Profile
              </Link>
              <Link 
                to="/map" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Map
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-24">
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Species Profile</h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Browse the top invasive species we track. Click a card to see more details, images, and how to manage them.</p>
          </div>
        </section>

        <section className="bg-gray-50 py-6 sm:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {speciesList.map((sp) => (
                <div key={sp.name} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                  <img
                    src={sp.image}
                    alt={sp.name}
                    className="w-full h-40 sm:h-44 md:h-36 object-cover"
                    onError={(e) => {
                      const svgFallback = `data:image/svg+xml;base64,${btoa(
                        `<svg width="300" height="160" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="160" fill="#166534"/><text x="150" y="80" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Image not available</text></svg>`
                      )}`;
                      e.currentTarget.src = svgFallback;
                    }}
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{sp.name}</h3>
                    <Link to={`/species/${sp.name.toLowerCase().replace(/\s+/g, '-')}?from=education`} className="inline-flex items-center text-green-700 hover:text-green-900 font-medium text-sm sm:text-base">
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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
                  <li><Link to="/map" className="hover:text-white transition-colors">Species Database</Link></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Educational Resources</span></li>
                  <li><Link to="/map" className="hover:text-white transition-colors">Mapping Tools</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-sm">About Us</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><span className="hover:text-white transition-colors cursor-pointer">Who We Are</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Our Mission</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EducationPage;
