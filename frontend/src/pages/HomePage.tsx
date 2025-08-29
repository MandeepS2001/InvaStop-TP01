import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  ChevronLeft, 
  ChevronRight,
  Search
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [expandedStat, setExpandedStat] = useState<number | null>(null);

  const statistics = [
    {
      id: 1,
      icon: "/Money.png",
      title: "$25 B - Cost Annually",
      description: "Pest plants and animals cost Australia around $25 billion a year",
      expandedInfo: {
        explanation: "Invasive species cause significant economic damage through agricultural losses, infrastructure damage, and control costs.",
        visual: "chart-data",
        citation: "Source: ABARES (Australian Bureau of Agricultural and Resource Economics and Sciences), 2023"
      }
    },
    {
      id: 2,
      icon: "/Stop.png",
      title: "3,000+ - Invasive Species",
      description: "Australia has close to 3000 invasive alien species",
      expandedInfo: {
        explanation: "These species threaten native biodiversity and ecosystem health across all Australian states and territories.",
        visual: "species-map",
        citation: "Source: Department of Agriculture, Fisheries and Forestry, 2024"
      }
    },
    {
      id: 3,
      icon: "/Frog.png",
      title: "100+ - Native Extinctions",
      description: "Over 100 species have gone extinct in the past 200 years",
      expandedInfo: {
        explanation: "Invasive species are a major driver of native species extinction, disrupting food chains and habitats.",
        visual: "extinction-timeline",
        citation: "Source: CSIRO Biodiversity Data, 2024"
      }
    }
  ];

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % statistics.length);
  };

  const prevStat = () => {
    setCurrentStatIndex((prev) => (prev - 1 + statistics.length) % statistics.length);
  };

  const handleStatClick = (statId: number) => {
    setExpandedStat(expandedStat === statId ? null : statId);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 object-contain" />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-green-200 transition-colors">
                Home
              </Link>
              <Link to="/education" className="text-white hover:text-green-200 transition-colors">
                Education
              </Link>
              <Link to="/map" className="text-white hover:text-green-200 transition-colors">
                Map
              </Link>
              <Link to="/more" className="text-white hover:text-green-200 transition-colors">
                More
              </Link>
            </nav>

            {/* Search Icon */}
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 cursor-pointer hover:text-green-200 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Edge to Edge */}
      <section className="relative bg-green-800 text-white py-20 pt-28 w-full overflow-visible min-h-[560px] md:min-h-[680px] lg:min-h-[760px]">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side Content */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Play your part in protecting the environment.
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Record sightings of invasive species around you and learn how to protect your land.
              </p>
              <button className="bg-green-700 hover:bg-green-600 text-white px-8 py-4 rounded-lg border border-white transition-colors">
                Click Here to Started It !
              </button>
            </div>
          </div>
        </div>
        {/* Floating Tree Image */}
        <div className="pointer-events-none select-none absolute right-6 lg:right-24 -bottom-[140px] md:-bottom-[180px] lg:-bottom-[220px] z-30">
          <img 
            src="/Tree.png" 
            alt="Tree in hand"
            className="h-[640px] md:h-[780px] lg:h-[900px] w-auto object-contain"
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-100 py-20 pt-32 md:pt-44 lg:pt-56 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover the hidden threats around you.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore invasive species that harm Australia's farms, wildlife, and communities — and learn how your actions can make a real difference.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevStat}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>

            <button
              onClick={nextStat}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statistics.map((stat, index) => (
                <div key={stat.id} className="relative">
                  <div 
                    className={`bg-green-800 text-white p-8 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      expandedStat === stat.id ? 'ring-4 ring-green-600' : ''
                    }`}
                    onClick={() => handleStatClick(stat.id)}
                  >
                    <div className="flex justify-center mb-4">
                      <img 
                        src={stat.icon} 
                        alt={stat.title}
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">
                      {stat.title}
                    </h3>
                    <p className="text-center text-green-100">
                      {stat.description}
                    </p>
                  </div>

                  {/* Expanded Information */}
                  {expandedStat === stat.id && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-lg shadow-xl p-6 z-20 border border-gray-200">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Learn More</h4>
                        <p className="text-gray-600 mb-4">
                          {stat.expandedInfo.explanation}
                        </p>
                        
                        {/* Visual Placeholder */}
                        <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center">
                          <div className="text-gray-500 text-sm">
                            📊 {stat.expandedInfo.visual} visualization
                          </div>
                        </div>
                        
                        {/* Citation */}
                        <div className="text-xs text-gray-500 border-t pt-2">
                          {stat.expandedInfo.citation}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setExpandedStat(null)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

export default HomePage;
