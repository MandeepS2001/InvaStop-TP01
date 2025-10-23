import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SeasonalRiskIndicator from '../components/SeasonalRiskIndicator';
import LiquidEther from '../components/LiquidEther';
import SimpleHeader from '../components/SimpleHeader';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Original 5 invasive species profiles
const originalSpeciesList = [
  { 
    name: 'Bitou Bush', 
    image: '/top10/BitouBush.png',
    category: 'plant' as const,
    threatLevel: 'high' as const,
    quickFacts: {
      introduced: '1908',
      impact: 'Coastal dune invasion, biodiversity loss',
      distribution: 'NSW, VIC, SA, WA'
    },
    relatedSpecies: ['Lantana', 'Gorse', 'Buffel Grass']
  },
  { 
    name: 'Buffel Grass', 
    image: '/top10/BuffelGrass.png',
    category: 'plant' as const,
    threatLevel: 'high' as const,
    quickFacts: {
      introduced: '1870s',
      impact: 'Alters fire regimes, reduces biodiversity',
      distribution: 'All mainland states'
    },
    relatedSpecies: ['Gamba Grass', 'Wiregrass', 'Asiatic Sand Sedge']
  },
  { 
    name: 'Gamba Grass', 
    image: '/top10/GambaGrass.png',
    category: 'plant' as const,
    threatLevel: 'high' as const,
    quickFacts: {
      introduced: '1930s',
      impact: 'Extreme fire risk, ecosystem transformation',
      distribution: 'NT, QLD, WA'
    },
    relatedSpecies: ['Buffel Grass', 'Wiregrass', 'Asiatic Sand Sedge']
  },
  { 
    name: 'Lantana', 
    image: '/top10/Lantana.png',
    category: 'plant' as const,
    threatLevel: 'high' as const,
    quickFacts: {
      introduced: '1841',
      impact: 'Forms dense thickets, displaces native vegetation',
      distribution: 'QLD, NSW, VIC, WA, NT'
    },
    relatedSpecies: ['Bitou Bush', 'Gorse', 'Buffel Grass']
  },
  { 
    name: 'Gorse', 
    image: '/top10/Gorse.png',
    category: 'plant' as const,
    threatLevel: 'high' as const,
    quickFacts: {
      introduced: '1830s',
      impact: 'Forms impenetrable thickets, fire hazard',
      distribution: 'VIC, TAS, NSW, SA'
    },
    relatedSpecies: ['Lantana', 'Bitou Bush', 'Portuguese Broom']
  }
];


const EducationPage: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const parallaxElements = parallaxRef.current.querySelectorAll('.parallax-element');
        parallaxElements.forEach((element, index) => {
          const speed = 0.5 + (index * 0.1);
          (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get threat level styling
  const getThreatLevelStyle = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-orange-500 text-white shadow-orange-500/50';
      case 'medium':
        return 'bg-yellow-500 text-white shadow-yellow-500/50';
      default:
        return 'bg-gray-500 text-white shadow-gray-500/50';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plant':
        return '🌱';
      case 'animal':
        return '🐾';
      case 'insect':
        return '🦋';
      default:
        return '🔍';
    }
  };
  return (
    <div className="min-h-screen">
            {/* Simple Header */}
            <SimpleHeader />

      {/* Main Content */}
      <main>
        <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          {/* LiquidEther Background */}
          <div className="absolute inset-0 w-full h-full z-0">
            <LiquidEther
              colors={['#22c55e', '#16a34a', '#15803d', '#166534']}
              mouseForce={18}
              cursorSize={140}
              isViscous={false}
              viscous={22}
              iterationsViscous={18}
              iterationsPoisson={18}
              dt={0.017}
              BFECC={true}
              resolution={0.65}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.35}
              autoIntensity={1.9}
              takeoverDuration={0.28}
              autoResumeDelay={1800}
              autoRampDuration={0.7}
            />
          </div>
          
          {/* Dark overlay for text readability - with pointer-events-none to allow mouse events through */}
          <div className="absolute inset-0 bg-black/18 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="inline-block">
                Invader Insight
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto">
              Browse the top invasive plants we track and learn about their impact on Australian ecosystems.
            </p>
          </div>
        </section>


        <section ref={parallaxRef} className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-12 sm:py-16 lg:py-20 overflow-hidden">
          {/* Parallax Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-parallax-up"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300/15 rounded-full blur-3xl animate-parallax-down"></div>
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-3xl animate-parallax-up" style={{animationDelay: '5s'}}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">

            {isLoading ? (
              // Skeleton Loading States
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 animate-pulse">
                    <div className="w-full h-40 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="transition-all duration-500 ease-in-out">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {originalSpeciesList
                    .sort((a, b) => {
                      const rank = (t: string) => (t === 'high' ? 0 : 1);
                      const rA = rank(a.threatLevel);
                      const rB = rank(b.threatLevel);
                      return rA - rB || a.name.localeCompare(b.name);
                    })
                  .map((sp, index) => (
                  <div 
                    key={sp.name} 
                    className="group relative bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden transform hover:scale-105 hover:-rotate-1 border border-white/30"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                    onMouseEnter={() => setHoveredCard(sp.name)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Neon Glow Effect */}
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                      hoveredCard === sp.name 
                        ? 'shadow-[0_0_30px_rgba(34,197,94,0.3)] shadow-green-500/30' 
                        : 'shadow-[0_0_15px_rgba(34,197,94,0.1)] shadow-green-500/10'
                    }`}></div>
                    
                    {/* Floating particles around each card */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={`particle-${i}`}
                          className="absolute w-1 h-1 bg-green-400/40 rounded-full animate-float"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Image with 3D tilt effect */}
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                          src={sp.image}
                          alt={sp.name}
                          className="w-full h-48 sm:h-56 md:h-44 object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const svgFallback = `data:image/svg+xml;base64,${btoa(
                              `<svg width="300" height="160" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="160" fill="#166534"/><text x="150" y="80" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Image not available</text></svg>`
                            )}`;
                            e.currentTarget.src = svgFallback;
                          }}
                        />
                        
                        {/* Overlay with category and threat level */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="text-lg">{getCategoryIcon(sp.category)}</span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-lg ${getThreatLevelStyle(sp.threatLevel)}`}>
                            {sp.threatLevel.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 sm:p-4 flex flex-col h-full">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors duration-300">
                          {sp.name}
                        </h3>
                        
                        {/* Seasonal Risk Indicator */}
                        <div className="mb-2">
                          <SeasonalRiskIndicator speciesName={sp.name} />
                        </div>
                        
                        {/* Quick Facts Preview */}
                        <div className="mb-3 space-y-1">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Introduced:</span> {sp.quickFacts.introduced}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            <span className="font-medium">Impact:</span> {sp.quickFacts.impact}
                          </div>
                        </div>
                        
                        {/* Related Species */}
                        <div className="mb-3 min-h-8">
                          <div className="text-xs text-gray-500 mb-1">Related:</div>
                          <div className="flex flex-wrap gap-1">
                            {sp.relatedSpecies.slice(0, 2).map((related, idx) => (
                              <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                {related}
                              </span>
                            ))}
                            {sp.relatedSpecies.length > 2 && (
                              <span className="text-xs text-gray-400">+{sp.relatedSpecies.length - 2}</span>
                            )}
                            {sp.relatedSpecies.length <= 2 && (
                              <span className="text-xs text-transparent select-none">+0</span>
                            )}
                          </div>
                        </div>
                        
                        <Link 
                          to={`/species/${sp.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}?from=education`} 
                          onClick={scrollToTop}
                          className="group/link inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium text-sm py-2 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl mt-auto"
                        >
                          Learn More 
                          <span className="ml-1 group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Try Your Skills Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-green-900">
          {/* LiquidEther Background */}
          <div className="absolute inset-0 w-full h-full z-0">
            <LiquidEther
              colors={['#22c55e', '#16a34a', '#15803d', '#166534']}
              mouseForce={15}
              cursorSize={120}
              isViscous={false}
              viscous={18}
              iterationsViscous={15}
              iterationsPoisson={15}
              dt={0.015}
              BFECC={true}
              resolution={0.6}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.35}
              autoIntensity={1.7}
              takeoverDuration={0.3}
              autoResumeDelay={1800}
              autoRampDuration={0.7}
            />
          </div>
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/18 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                <span className="inline-block">
                  Try Your Skills
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
                See how good you are at spotting invasive plants with our fun quiz.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🏆</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Earn Achievements</h4>
                <p className="text-gray-700">
                  Unlock badges and track your progress as you become more skilled at plant identification
                </p>
              </div>

              <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🎓</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Build Confidence</h4>
                <p className="text-gray-700">
                  Practice in a safe environment before encountering invasive plants in real life
                </p>
            </div>

              <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🌱</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Make a Difference</h4>
                <p className="text-gray-700">
                  Every correct identification helps protect Australia's unique biodiversity
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center max-w-4xl mx-auto">
              {/* Quiz Card */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Spot the Invader</h3>
                  <p className="text-gray-600 mb-6">
                    Test your ability to identify invasive plants in this interactive quiz. Build confidence before encountering them in real life.
                  </p>
                  <Link
                    to="/quiz"
                    onClick={scrollToTop}
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="mr-2">Start</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default EducationPage;
