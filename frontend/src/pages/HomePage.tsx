import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  ChevronLeft, 
  ChevronRight,
  Search
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

// Types for API data
interface Epic1Statistics {
  total_invasive_species: number;
  total_biodiversity_impact: number;
  high_risk_states: number;
  annual_cost_estimate: string;
  message: string;
}

// Counting Animation Component
const CountUp: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string }> = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };

    // Start animation when component is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animationFrame = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      observer.disconnect();
    };
  }, [end, duration, hasAnimated]);

  return (
    <span className="text-4xl font-bold">
      {prefix}{count}{suffix}
    </span>
  );
};

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [expandedStat, setExpandedStat] = useState<number | null>(null);
  const [apiStatistics, setApiStatistics] = useState<Epic1Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real statistics from Epic 1.0 API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/epic1/statistics/overview');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setApiStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Dynamic statistics based on API data
  const statistics = apiStatistics ? [
    {
      id: 1,
      icon: "/Money.png",
      title: `${apiStatistics.annual_cost_estimate} - Cost Annually`,
      description: `Pest plants and animals cost Australia around ${apiStatistics.annual_cost_estimate} a year`,
      expandedInfo: {
        explanation: "Invasive species cause significant economic damage through agricultural losses, infrastructure damage, and control costs.",
        visual: "chart-data",
        citation: "Source: ABARES (Australian Bureau of Agricultural and Resource Economics and Sciences), 2023"
      }
    },
    {
      id: 2,
      icon: "/Stop.png",
      title: `${apiStatistics.total_invasive_species.toLocaleString()}+ - Invasive Species`,
      description: `Australia has close to ${apiStatistics.total_invasive_species.toLocaleString()} invasive alien species`,
      expandedInfo: {
        explanation: "These species threaten native biodiversity and ecosystem health across all Australian states and territories.",
        visual: "species-map",
        citation: "Source: Department of Agriculture, Fisheries and Forestry, 2024"
      }
    },
    {
      id: 3,
      icon: "/Frog.png",
      title: `${apiStatistics.total_biodiversity_impact.toLocaleString()}+ - Biodiversity Impact`,
      description: `Over ${apiStatistics.total_biodiversity_impact.toLocaleString()} species are impacted by invasive species`,
      expandedInfo: {
        explanation: "Invasive species are a major driver of native species decline, disrupting food chains and habitats.",
        visual: "extinction-timeline",
        citation: "Source: CSIRO Biodiversity Data, 2024"
      }
    }
  ] : [];

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
      <section className="relative bg-green-800 text-white py-20 pt-32 w-full overflow-visible">
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
                Click Here to Get Started !
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Tree Image - Separate Entity */}
      <div className="pointer-events-none select-none absolute right-0 top-1/2 transform -translate-y-1/2 z-30">
        <img 
          src="/Tree.png" 
          alt="Tree in hand"
          className="h-[600px] md:h-[700px] lg:h-[1100px] w-auto object-contain"
        />
      </div>

      {/* Statistics Section */}
      <section className="bg-gray-100 py-20 pt-20 mt-0" id="stats-section">
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

          {/* API Status Indicator */}
          {loading && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading real-time statistics from InvaStop API...
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                <span className="mr-2">⚠️</span>
                {error} - Using fallback data
              </div>
            </div>
          )}
          
          {apiStatistics && !loading && !error && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <span className="mr-2">✅</span>
                Live data from InvaStop API - {apiStatistics.message}
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="relative">
            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statistics.length > 0 ? (
                statistics.map((stat, index) => (
                  <div key={stat.id} className="relative group">
                    {/* Flippable Card Container */}
                    <div 
                      className="relative w-full h-64 perspective-1000"
                      onMouseLeave={() => setExpandedStat(null)}
                    >
                      <div 
                        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                          expandedStat === stat.id ? 'rotate-y-180' : ''
                        }`}
                      >
                        {/* Front of Card */}
                        <div 
                          className={`absolute inset-0 w-full h-full bg-green-800 text-white p-8 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg backface-hidden ${
                            expandedStat === stat.id ? 'opacity-0' : 'opacity-100'
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
                          <h3 className="text-center mb-2">
                            {stat.id === 1 ? (
                              <CountUp end={parseInt(apiStatistics?.annual_cost_estimate.replace('B', '000000000') || '25000000000')} prefix="$" suffix=" B - Cost Annually" />
                            ) : stat.id === 2 ? (
                              <CountUp end={apiStatistics?.total_invasive_species || 0} suffix="+ - Invasive Species" />
                            ) : (
                              <CountUp end={apiStatistics?.total_biodiversity_impact || 0} suffix="+ - Biodiversity Impact" />
                            )}
                          </h3>
                          <p className="text-center text-green-100">
                            {stat.description}
                          </p>
                          <div className="text-center mt-4 text-sm text-white">
                            <span className="text-green-800 text-base font-semibold">
                              Click to flip for more info
                            </span>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div 
                          className={`absolute inset-0 w-full h-full bg-green-700 text-white p-8 rounded-lg backface-hidden rotate-y-180 ${
                            expandedStat === stat.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div className="h-full flex flex-col">
                            <h4 className="font-semibold text-lg mb-3 text-center">Learn More</h4>
                            <p className="text-sm mb-4 flex-grow">
                              {stat.expandedInfo.explanation}
                            </p>
                            
                            {/* Visual Placeholder */}
                            <div className="bg-green-600 rounded-lg p-3 mb-4 text-center">
                              <div className="text-green-100 text-sm">
                                📊 {stat.expandedInfo.visual} visualization
                              </div>
                            </div>
                            
                            {/* Citation */}
                            <div className="text-xs text-green-200 border-t border-green-600 pt-2 mb-3">
                              {stat.expandedInfo.citation}
                            </div>
                            
                            <div className="text-center text-sm text-green-200">
                              Hover away to flip back
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  {loading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                      <p className="text-lg text-gray-600">Loading real-time statistics...</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-red-500 text-6xl">⚠️</div>
                      <p className="text-lg text-gray-600">Failed to load statistics</p>
                      <p className="text-sm text-gray-500">{error}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-gray-400 text-6xl">📊</div>
                      <p className="text-lg text-gray-600">No statistics available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See the Spread of Invasive Species Across Australia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our interactive map to understand the environmental impact and risk levels of invasive species in different states. 
              Click on any state to learn about the top invasive species affecting that region.
            </p>
          </div>
          
          <InteractiveMap />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Copyright */}
            <div className="md:col-span-1 flex flex-col items-start">
              <div className="flex flex-col items-start mb-4">
                <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 mb-2" />
                <span className="text-xl font-bold">invastop</span>
              </div>
              <p className="text-green-100">© 2025</p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-4">Products</h3>
                <ul className="space-y-2 text-green-100">
                  <li><a href="#" className="hover:text-white transition-colors">Species Database</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Educational Resources</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Mapping Tools</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">About Us</h3>
                <ul className="space-y-2 text-green-100">
                  <li><a href="#" className="hover:text-white transition-colors">Who We Are</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Contact Us</h3>
                <ul className="space-y-2 text-green-100">
                  <li><a href="mailto:EnvironmentalHealth@hv.sistem.com" className="hover:text-white transition-colors">EnvironmentalHealth@hv.sistem.com</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Report an Issue</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
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
