import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TaxonThreatChart from '../components/TaxonThreatChart';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const HomePage: React.FC = () => {
  const [expandedStat, setExpandedStat] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Static statistics - no API call needed
  const statistics = [
    {
      id: 1,
      icon: "/Money.png",
      title: "$25B Cost Annually",
      expandedInfo: {
        explanation: "Pest plants and animals cost Australia around $25 billion a year. Invasive species cause economic damage through agricultural losses, infrastructure damage, and control costs.",
        visual: "chart-data",
        citation: "Source: Tasmanian Times, CSIRO"
      }
    },
    {
      id: 2,
      icon: "/Stop.png",
      title: "3,000+ Invasive Species",
      expandedInfo: {
        explanation: "Australia has close to 3000 invasive alien species costing approximately $25 billion every year. These species threaten native biodiversity and ecosystem health across all Australian states and territories.",
        visual: "species-map",
        citation: "Source: CSIRO"
      }
    },
    {
      id: 3,
      icon: "/Frog.png",
      title: "100+ Species Extinct",
      expandedInfo: {
        explanation: "Over 100 species have gone extinct in the past 200 years, with more than 1,770 listed as threatened. Invasive species are a major driver of native species decline.",
        visual: "extinction-timeline",
        citation: "Source: CSIRO"
      }
    }
  ];


  const handleStatClick = (statId: number) => {
    setExpandedStat(expandedStat === statId ? null : statId);
  };

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
              <Link to="/" onClick={scrollToTop} className="px-4 py-2 text-white bg-green-600/60 border-green-500 rounded-md transition-all duration-200 font-medium shadow-md">Home</Link>
              <Link to="/education" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Species Profile</Link>
              <Link to="/insights" onClick={scrollToTop} className="px-4 py-2 text-white hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 hover:shadow-md bg-gray-800/30">Did you Know?</Link>
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
                  Play your part in protecting the environment.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-green-100">
                <span className="inline-block">
                  Record sightings of invasive species on your farm or property and learn how to protect your land.
                </span>
              </p>
              <button 
                onClick={() => {
                  navigate('/education');
                  scrollToTop();
                }}
                className="group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-green-400/30 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto font-semibold shadow-lg hover:shadow-xl hover:shadow-green-500/25 hover:scale-105 transform"
              >
                <span className="relative z-10">Identify Your Invaders →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
        
      </section>

      {/* Floating Tree Image - Separate Entity */}
      <div className="pointer-events-none select-none absolute right-0 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block" style={{ top: '58%', right: '-30px' }}>
        <img 
          src="/Tree.png" 
          alt="Tree in hand"
          className="h-[550px] lg:h-[1000px] w-auto object-contain"
        />
      </div>

      {/* Statistics Section */}
      <section className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-12 sm:py-16 lg:py-20 pt-12 sm:pt-16 lg:pt-20 mt-0 overflow-hidden" id="stats-section">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-parallax-up"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300/15 rounded-full blur-3xl animate-parallax-down"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-3xl animate-parallax-up" style={{animationDelay: '5s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              See what's happening around you.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover how many native species are being affected by invasive plants and animals across different groups.
            </p>
          </div>

          

          {/* Statistics Cards */}
          <div className="relative">
            {/* Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {statistics.map((stat, index) => (
                  <div key={stat.id} className="relative group transform transition-all duration-500 hover:scale-105" style={{animationDelay: `${index * 0.1}s`}}>
                    {/* Flippable Card Container */}
                    <div 
                      className={`relative w-full perspective-1000 transition-all duration-300 ${
                        expandedStat === stat.id ? 'h-80 sm:h-96' : 'h-64 sm:h-72'
                      }`}
                      onMouseLeave={() => setExpandedStat(null)}
                    >
                      <div 
                        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                          expandedStat === stat.id ? 'rotate-y-180' : ''
                        }`}
                      >
                        {/* Front of Card */}
                        <div 
                          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white p-4 sm:p-6 lg:p-8 rounded-xl cursor-pointer transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-green-400/50 hover:scale-105 sm:hover:scale-110 backface-hidden border border-green-600/30 ${
                            expandedStat === stat.id ? 'opacity-0' : 'opacity-100'
                          }`}
                          onClick={() => handleStatClick(stat.id)}
                        >
                          <div className="flex justify-center mb-3 sm:mb-4">
                            <img 
                              src={stat.icon} 
                              alt={stat.title}
                              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 object-contain"
                            />
                          </div>
                          <h3 className="text-center mb-2 text-lg sm:text-xl font-bold leading-tight">
                            {stat.id === 1 ? (
                              <CountUp end={25} prefix="$" suffix="B Cost Annually" />
                            ) : stat.id === 2 ? (
                              <CountUp end={3000} suffix="+ Invasive Species" />
                            ) : (
                              <CountUp end={100} prefix="" suffix="+ Species Extinct" />
                            )}
                          </h3>
                          <div className="text-center mt-3 sm:mt-4">
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border-2 border-yellow-300 hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105">
                              More Info
                            </span>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div 
                          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl backface-hidden rotate-y-180 border border-green-500/30 ${
                            expandedStat === stat.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div className="h-full flex flex-col">
                            <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-center">Learn More</h4>
                            <p className="text-xs sm:text-sm mb-3 sm:mb-4 flex-grow">
                              {stat.expandedInfo.explanation}
                            </p>
                            
                            {/* Citation */}
                            <div className="text-xs text-green-200 border-t border-green-600 pt-2 mb-2 sm:mb-3">
                              {stat.expandedInfo.citation}
                            </div>
                            
                            <div className="text-center text-xs sm:text-sm text-green-200">
                              Hover away to flip back
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Insights */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-green-200/40 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">See the Impact on Australian Wildlife</h3>
              <p className="text-gray-600">Explore interactive charts and data stories about how invasive species impact Australia — all in one place.</p>
            </div>
            <div>
              <Link
                to="/insights"
                onClick={scrollToTop}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transform hover:scale-105 border-2 border-green-500/20 hover:border-green-400/40"
              >
                <span className="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">📊</span>
                <span className="group-hover:tracking-wide transition-all duration-300">Did you Know?</span>
                <span className="ml-3 text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section removed (moved to /insights) */}

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

export default HomePage;
