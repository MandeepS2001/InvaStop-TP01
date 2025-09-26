import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SeasonalRiskIndicator from '../components/SeasonalRiskIndicator';
import LiquidEther from '../components/LiquidEther';
import SimpleHeader from '../components/SimpleHeader';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const speciesList: { 
  name: string; 
  image: string; 
  category: 'plant' | 'animal' | 'insect';
  threatLevel: 'high' | 'medium' | 'critical' | 'low';
  quickFacts: {
    introduced: string;
    impact: string;
    distribution: string;
  };
  relatedSpecies: string[];
}[] = [
  { 
    name: 'Lantana', 
    image: '/top10/Lantana.png',
    category: 'plant',
    threatLevel: 'critical',
    quickFacts: {
      introduced: '1841',
      impact: 'Forms dense thickets, displaces native vegetation',
      distribution: 'QLD, NSW, VIC, WA, NT'
    },
    relatedSpecies: ['Bitou Bush', 'Gorse', 'Buffel Grass']
  },
  { 
    name: 'Bitou Bush', 
    image: '/top10/BitouBush.png',
    category: 'plant',
    threatLevel: 'high',
    quickFacts: {
      introduced: '1908',
      impact: 'Coastal dune invasion, biodiversity loss',
      distribution: 'NSW, VIC, SA, WA'
    },
    relatedSpecies: ['Eucalyptus', 'Acacia/Wattle', 'Banksia']
  },
  { 
    name: 'Eucalyptus', 
    image: '/top10/Eucalyptus.png',
    category: 'plant',
    threatLevel: 'low',
    quickFacts: {
      introduced: 'Native',
      impact: 'Essential for Australian ecosystems and wildlife',
      distribution: 'Throughout Australia'
    },
    relatedSpecies: ['Acacia/Wattle', 'Banksia', 'Melaleuca']
  },
  { 
    name: 'Acacia/Wattle', 
    image: '/top10/Acacia-Wattle.jpg',
    category: 'plant',
    threatLevel: 'low',
    quickFacts: {
      introduced: 'Native',
      impact: 'Important nitrogen fixer, food for native wildlife',
      distribution: 'Throughout Australia'
    },
    relatedSpecies: ['Eucalyptus', 'Banksia', 'Grevillea']
  },
  { 
    name: 'Banksia', 
    image: '/top10/Banksia.jpg',
    category: 'plant',
    threatLevel: 'low',
    quickFacts: {
      introduced: 'Native',
      impact: 'Critical food source for native birds and mammals',
      distribution: 'Western Australia, Eastern Australia'
    },
    relatedSpecies: ['Eucalyptus', 'Acacia/Wattle', 'Grevillea']
  },
  { 
    name: 'Gorse', 
    image: '/top10/Gorse.png',
    category: 'plant',
    threatLevel: 'high',
    quickFacts: {
      introduced: '1830s',
      impact: 'Forms impenetrable thickets, fire hazard',
      distribution: 'VIC, TAS, NSW, SA'
    },
    relatedSpecies: ['Eucalyptus', 'Acacia/Wattle', 'Melaleuca']
  },
  { 
    name: 'Buffel Grass', 
    image: '/top10/BuffelGrass.png',
    category: 'plant',
    threatLevel: 'high',
    quickFacts: {
      introduced: '1870s',
      impact: 'Alters fire regimes, reduces biodiversity',
      distribution: 'All mainland states'
    },
    relatedSpecies: ['Eucalyptus', 'Banksia', 'Grevillea']
  },
  { 
    name: 'Melaleuca', 
    image: '/top10/Melaleuca.jpg',
    category: 'plant',
    threatLevel: 'low',
    quickFacts: {
      introduced: 'Native',
      impact: 'Provides habitat and food for native wildlife',
      distribution: 'Throughout Australia'
    },
    relatedSpecies: ['Eucalyptus', 'Banksia', 'Grevillea']
  },
  { 
    name: 'Grevillea', 
    image: '/top10/Grevillea.png',
    category: 'plant',
    threatLevel: 'low',
    quickFacts: {
      introduced: 'Native',
      impact: 'Attracts native birds and insects, supports biodiversity',
      distribution: 'Throughout Australia'
    },
    relatedSpecies: ['Eucalyptus', 'Acacia/Wattle', 'Melaleuca']
  },
  { 
    name: 'Gamba Grass', 
    image: '/top10/GambaGrass.png',
    category: 'plant',
    threatLevel: 'critical',
    quickFacts: {
      introduced: '1930s',
      impact: 'Extreme fire risk, ecosystem transformation',
      distribution: 'NT, QLD, WA'
    },
    relatedSpecies: ['Eucalyptus', 'Acacia/Wattle', 'Banksia']
  },
];

// Animal species data
const animalSpeciesList: { 
  name: string; 
  image: string; 
  category: 'plant' | 'animal' | 'insect';
  threatLevel: 'high' | 'medium' | 'critical' | 'low';
  quickFacts: {
    introduced: string;
    impact: string;
    distribution: string;
  };
  relatedSpecies: string[];
}[] = [
  { 
    name: 'Common Myna', 
    image: '/top10/CommonMyna.png',
    category: 'animal',
    threatLevel: 'high',
    quickFacts: {
      introduced: '1862',
      impact: 'Competes with native birds, spreads weeds',
      distribution: 'All mainland states'
    },
    relatedSpecies: ['European Rabbit', 'Red Fox', 'Cane Toad']
  },
  { 
    name: 'European Rabbit', 
    image: '/top10/EuropeanRabbit.jpg',
    category: 'animal',
    threatLevel: 'critical',
    quickFacts: {
      introduced: '1859',
      impact: 'Agricultural damage, soil erosion',
      distribution: 'All states except NT'
    },
    relatedSpecies: ['Red Fox', 'Feral Pig', 'Common Myna']
  },
  { 
    name: 'Red Fox', 
    image: '/top10/RedFox.png',
    category: 'animal',
    threatLevel: 'critical',
    quickFacts: {
      introduced: '1855',
      impact: 'Predation on native wildlife',
      distribution: 'All mainland states'
    },
    relatedSpecies: ['European Rabbit', 'Feral Pig', 'Common Myna']
  },
  { 
    name: 'Cane Toad', 
    image: '/top10/CaneToad.png',
    category: 'animal',
    threatLevel: 'critical',
    quickFacts: {
      introduced: '1935',
      impact: 'Poisonous to native predators',
      distribution: 'QLD, NSW, NT, WA'
    },
    relatedSpecies: ['Red Fox', 'Common Myna', 'European Rabbit']
  },
  { 
    name: 'Feral Pig', 
    image: '/top10/FeralPig.png',
    category: 'animal',
    threatLevel: 'high',
    quickFacts: {
      introduced: '1788',
      impact: 'Soil disturbance, crop damage',
      distribution: 'All mainland states'
    },
    relatedSpecies: ['Red Fox', 'European Rabbit', 'Cane Toad']
  },
];

const EducationPage: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plants' | 'animals'>('plants');
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
      case 'critical':
        return 'bg-red-500 text-white shadow-red-500/50';
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
      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
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
                Species Profile
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto">
              Browse the top invasive species we track. Switch between plants and animals to explore different species profiles.
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
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/30">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('plants')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === 'plants'
                        ? 'bg-green-600 text-white shadow-md shadow-green-500/30'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    🌱 Plants
                  </button>
                  <button
                    onClick={() => setActiveTab('animals')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === 'animals'
                        ? 'bg-green-600 text-white shadow-md shadow-green-500/30'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    🐾 Animals
                  </button>
                </div>
              </div>
            </div>

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
                  {(
                    activeTab === 'plants'
                      ? // Invasive first (critical/high), then natives (low/medium)
                        [...speciesList].sort((a, b) => {
                          const rank = (t: string) => (t === 'critical' || t === 'high' ? 0 : 1);
                          const rA = rank(a.threatLevel);
                          const rB = rank(b.threatLevel);
                          return rA - rB || a.name.localeCompare(b.name);
                        })
                      : animalSpeciesList
                  ).map((sp, index) => (
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

        {/* Quiz Section */}
        <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Try Your Skills
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                See how good you are at spotting invasive plants with our fun quiz!
              </p>
            </div>

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
              {/* Removed secondary card per request */}
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-green-600 text-2xl">🏆</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Earn Achievements</h4>
                <p className="text-gray-600">
                  Unlock badges and track your progress as you become more skilled at plant identification
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">🎓</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Build Confidence</h4>
                <p className="text-gray-600">
                  Practice in a safe environment before encountering invasive plants in real life
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">🌱</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Make a Difference</h4>
                <p className="text-gray-600">
                  Every correct identification helps protect Australia's unique biodiversity
                </p>
              </div>
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
