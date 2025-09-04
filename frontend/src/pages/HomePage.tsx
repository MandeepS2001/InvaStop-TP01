import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaxonThreatChart from '../components/TaxonThreatChart';

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

  // Static statistics - no API call needed
  const statistics = [
    {
      id: 1,
      icon: "/Money.png",
      title: "$25B Cost Annually",
      expandedInfo: {
        explanation: "Pest plants and animals cost Australia around $25 billion a year, and it will get worse. Invasive species cause significant economic damage through agricultural losses, infrastructure damage, and control costs. The financial burden continues to grow as these species spread and establish themselves in new areas.",
        visual: "chart-data",
        citation: "Source: Tasmanian Times, CSIRO"
      }
    },
    {
      id: 2,
      icon: "/Stop.png",
      title: "3,000+ Invasive Species",
      expandedInfo: {
        explanation: "Australia has close to 3000 invasive alien species estimated to cost Australia approximately $25 billion every year in losses to agriculture and management costs. These species threaten native biodiversity and ecosystem health across all Australian states and territories. The high number of invasive species creates complex management challenges.",
        visual: "species-map",
        citation: "Source: CSIRO"
      }
    },
    {
      id: 3,
      icon: "/Frog.png",
      title: "100+ Species Extinct",
      expandedInfo: {
        explanation: "Over 100 species have gone extinct in the past 200 years, with more than 1,770 listed as threatened. Invasive species are a major driver of native species decline, disrupting food chains and habitats. The extinction rate continues to accelerate due to invasive species pressure.",
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
            <Link to="/" className="flex items-center space-x-3">
              <img src="/Invastop-Logo.png" alt="InvaStop" className="h-60 w-60 object-contain" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/" className="text-white hover:text-green-200 transition-colors text-sm lg:text-base">
                Home
              </Link>
              <Link to="/education" className="text-white hover:text-green-200 transition-colors text-sm lg:text-base">
                Species Profile
              </Link>
              <Link to="/map" className="text-white hover:text-green-200 transition-colors text-sm lg:text-base">
                Map
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
                to="/education" 
                className="block px-3 py-2 text-white hover:text-green-200 hover:bg-green-600 rounded-md transition-colors"
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

      {/* Hero Section - Edge to Edge */}
      <section className="relative bg-green-800 text-white py-12 sm:py-16 lg:py-20 pt-20 sm:pt-24 lg:pt-32 w-full overflow-visible">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Play your part in protecting the environment.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-green-100">
                Record sightings of invasive species around you and learn how to protect your land.
              </p>
              <button 
                onClick={async () => {
                  try {
                    // Request camera access
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    
                    // Create a modal to show "Coming Soon" message
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                    modal.innerHTML = `
                      <div class="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
                        <div class="text-4xl sm:text-6xl mb-4">📷</div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h3>
                        <p class="text-sm sm:text-base text-gray-600 mb-6">
                          Our AI-powered species identification feature is currently in development. 
                          Soon you'll be able to take photos of plants and animals to identify invasive species!
                        </p>
                        <button 
                          onclick="this.closest('.fixed').remove(); navigator.mediaDevices.getUserMedia({video: true}).then(stream => stream.getTracks().forEach(track => track.stop()))"
                          class="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          Close
                        </button>
                      </div>
                    `;
                    document.body.appendChild(modal);
                    
                    // Stop the camera stream immediately since we're just showing the modal
                    stream.getTracks().forEach(track => track.stop());
                  } catch (error) {
                    // Handle camera access denied or other errors
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                    modal.innerHTML = `
                      <div class="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
                        <div class="text-4xl sm:text-6xl mb-4">📷</div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Camera Access Required</h3>
                        <p class="text-sm sm:text-base text-gray-600 mb-6">
                          To use our AI species identification feature, please allow camera access when prompted.
                        </p>
                        <button 
                          onclick="this.closest('.fixed').remove()"
                          class="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          Close
                        </button>
                      </div>
                    `;
                    document.body.appendChild(modal);
                  }
                }}
                className="bg-green-700 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-white transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Any Species Nearby? Click
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center cursor-pointer hover:text-white transition-colors"
          onClick={() => {
            document.getElementById('stats-section')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          <div className="flex flex-col items-center space-y-2 text-white/80 hover:text-white transition-colors">
            <span className="text-sm font-medium">Scroll to see more</span>
            <div className="animate-bounce">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Tree Image - Separate Entity */}
      <div className="pointer-events-none select-none absolute right-0 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block" style={{ top: '55%' }}>
        <img 
          src="/Tree.png" 
          alt="Tree in hand"
          className="h-[600px] lg:h-[1100px] w-auto object-contain"
        />
      </div>

      {/* Statistics Section */}
      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20 pt-12 sm:pt-16 lg:pt-20 mt-0" id="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              See what's happening around you.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Find out about plants and animals that are causing problems in Australia. Learn how you can help.
            </p>
          </div>

          

          {/* Statistics Cards */}
          <div className="relative">
            {/* Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {statistics.map((stat, index) => (
                  <div key={stat.id} className="relative group">
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
                          className={`absolute inset-0 w-full h-full bg-green-800 text-white p-4 sm:p-6 lg:p-8 rounded-lg cursor-pointer transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-green-400/50 hover:scale-105 sm:hover:scale-110 backface-hidden ${
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
                            <span className="bg-yellow-400 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border-2 border-yellow-300">
                              Click to flip for more info
                            </span>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div 
                          className={`absolute inset-0 w-full h-full bg-green-700 text-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-2xl backface-hidden rotate-y-180 ${
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

      {/* Data Visualization Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See the Impact on Australian Wildlife
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover how many native species are being affected by invasive plants and animals across different groups.
            </p>
            
            {/* Data Visualization Card */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <TaxonThreatChart />
              
              <div className="mt-8">
                <Link 
                  to="/map" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
                >
                  <span className="mr-2">🗺️</span>
                  See The Impact
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Logo and Copyright */}
            <div className="md:col-span-1 flex flex-col items-start">
              <div className="flex flex-col items-start mb-3">
                <img src="/Invastop-Logo.png" alt="InvaStop" className="h-24 w-24 mb-2" />
              </div>
              <p className="text-green-100 text-sm">© 2025</p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold mb-3 text-sm">Products</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><Link to="/map" className="hover:text-white transition-colors">Species Database</Link></li>
                  <li><Link to="/education" className="hover:text-white transition-colors">Educational Resources</Link></li>
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
              
              <div>
                <h3 className="font-bold mb-3 text-sm">Contact Us</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><a href="mailto:EnvironmentalHealth@hv.sistem.com" className="hover:text-white transition-colors">EnvironmentalHealth@hv.sistem.com</a></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Report an Issue</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Partner With Us</span></li>
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
