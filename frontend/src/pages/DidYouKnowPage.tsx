import React from 'react';
import TaxonThreatChart from '../components/TaxonThreatChart';
import SeasonalMetrics from '../components/SeasonalMetrics';
import MagicBento, { CardData } from '../components/MagicBento';
import { Link } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther';
import SimpleHeader from '../components/SimpleHeader';

// Utility function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const getAustralianSeason = (date: Date): 'Summer' | 'Autumn' | 'Winter' | 'Spring' => {
  const month = date.getMonth() + 1; // 1-12
  if (month === 12 || month === 1 || month === 2) return 'Summer';
  if (month >= 3 && month <= 5) return 'Autumn';
  if (month >= 6 && month <= 8) return 'Winter';
  return 'Spring';
};

const DidYouKnowPage: React.FC = () => {
  const currentSeason = getAustralianSeason(new Date());
  // Seasonal data for the MagicBento cards (uses currentSeason for copy)
  const springCardData: CardData[] = [
    {
      color: '#1a1a1a',
      title: 'Lantana',
      description: `This plant has been found thousands of times this ${currentSeason.toLowerCase()}.`,
      label: 'High Risk',
      imageSrc: '/top10/Lantana.png',
      priority: 'High Priority',
      statLine: `Found 5,574 times across 6 different areas this ${currentSeason.toLowerCase()}.`,
      substats: ['#1 most common', 'Found in 6 locations'],
      size: 'xl'
    },
    {
      color: '#1a1a1a',
      title: 'Buffel Grass',
      description: `Widespread ${currentSeason.toLowerCase()} growth with active spread risk.`,
      label: 'High Risk',
      imageSrc: '/top10/BuffelGrass.png',
      priority: 'High Priority',
      statLine: `Found 4,103 times across 6 different areas this ${currentSeason.toLowerCase()}.`,
      substats: ['#2 most common', 'Found in 6 locations'],
      size: 'xl',
      imageHeight: 220
    },
    {
      color: '#1a1a1a',
      title: 'Gamba Grass',
      description: `Rapid ${currentSeason.toLowerCase()} activity observed across multiple regions.`,
      label: 'High Risk',
      imageSrc: '/top10/GambaGrass.png',
      priority: 'High Priority',
      statLine: `Found 2,175 times across 2 different areas this ${currentSeason.toLowerCase()}.`,
      substats: ['#3 most common', 'Found in 2 locations'],
      size: 'xl',
      imageHeight: 280
    },
    {
      color: '#1a1a1a',
      title: 'Bitou Bush',
      description: 'Peak flowering season with spread potential.',
      label: 'Medium Risk',
      imageSrc: '/top10/BitouBush.png',
      priority: 'Medium Priority',
      statLine: `Observed frequently near coasts during ${currentSeason.toLowerCase()}.`,
      substats: ['Common along dunes'],
      size: 'lg'
    },
    {
      color: '#1a1a1a',
      title: 'Gorse',
      description: `${currentSeason} growth surge; monitor hedgerows closely.`,
      label: 'Medium Risk',
      imageSrc: '/top10/Gorse.png',
      priority: 'Medium Priority',
      statLine: `Increasing presence in rural edges this ${currentSeason.toLowerCase()}.`,
      size: 'md'
    }
  ];

  return (
    <div className="relative min-h-screen bg-neutral-50">

            {/* Simple Header */}
            <SimpleHeader />

      {/* Hero Section - Edge to Edge */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-12 sm:py-16 lg:py-20 pt-20 sm:pt-24 lg:pt-32 w-full overflow-visible">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <LiquidEther
            colors={['#22c55e', '#16a34a', '#15803d', '#166534']}
            mouseForce={16}
            cursorSize={130}
            isViscous={false}
            viscous={20}
            iterationsViscous={16}
            iterationsPoisson={16}
            dt={0.016}
            BFECC={true}
            resolution={0.6}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.8}
            takeoverDuration={0.3}
            autoResumeDelay={2000}
            autoRampDuration={0.8}
          />
        </div>
        
        {/* Dark overlay for text readability - with pointer-events-none to allow mouse events through */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
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
                  Learn about problem plants that affect farms and properties across Australia. See real stories and pictures of the impact.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Happening This Spring - MagicBento + Summary/CTA */}
      <section className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What's Happening This Season
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover which problem plants are most active during spring and what you need to watch for on your property.
            </p>
          </div>

          {/* Summary banner */}
          <div className="mb-10">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-3xl" role="img" aria-label="leaf">🌿</span>
                <div className="text-4xl sm:text-5xl font-extrabold text-green-700">13,865</div>
              </div>
              <div className="text-green-800 text-lg sm:text-xl mb-2">problem plants found this {currentSeason.toLowerCase()}</div>
              <div className="text-green-700">That's a lot of plants causing problems for farmers and property owners across Australia!</div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <MagicBento
              cardData={springCardData}
              textAutoHide={false}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              glowColor="22, 197, 94"
              particleCount={8}
              enableTilt={false}
              clickEffect={true}
              enableMagnetism={false}
            />
          </div>

          {/* Urgency trio */}
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h3 className="text-center text-2xl font-semibold text-gray-900 mb-6">How Urgent Are These Plants?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-red-200 bg-red-100 p-6 text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-4xl font-bold text-red-700">5</div>
                <div className="mt-1 font-semibold text-red-800">Act Now</div>
                <p className="mt-2 text-sm text-red-700">These plants need quick action to stop them spreading</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-100 p-6 text-center">
                <div className="text-3xl mb-2">👀</div>
                <div className="text-4xl font-bold text-amber-700">0</div>
                <div className="mt-1 font-semibold text-amber-800">Keep Watch</div>
                <p className="mt-2 text-sm text-amber-700">Check on these plants regularly to make sure they don't spread</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-100 p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-4xl font-bold text-emerald-700">0</div>
                <div className="mt-1 font-semibold text-emerald-800">Under Control</div>
                <p className="mt-2 text-sm text-emerald-700">These plants are being managed well and aren't spreading</p>
              </div>
            </div>
          </div>

          {/* CTA panel */}
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-100 p-6 sm:p-8 text-center">
            <div className="text-2xl font-semibold text-green-900 mb-2">Want to Check Your Local Area?</div>
            <p className="text-green-800 max-w-3xl mx-auto mb-6">See what problem plants are active in your specific area and when they're most likely to spread.</p>
            <a href="/epic5" className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors">
              Check My Area
              <span className="ml-2">➜</span>
            </a>
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

          {/* Seasonal Information Section */}
          <SeasonalMetrics />

          {/* Simple Chart Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How Problem Plants Affect Australia</h2>
              <p className="text-gray-600">See which types of plants cause the most problems across the country</p>
            </div>
            <TaxonThreatChart />
          </div>

          {/* Simple Plant Stories */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Real Stories from Australian Farms</h2>
              <p className="text-lg text-gray-600">See how problem plants affect properties just like yours</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Story 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-red-600 text-2xl">🌿</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Lantana Takes Over</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">"Within two years, Lantana had covered half my property. It was impossible to walk through some areas."</p>
                <div className="text-xs text-gray-500">- Farmer from Queensland</div>
              </div>

              {/* Story 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-orange-600 text-2xl">🌿</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Blackberry Bush Problem</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">"The blackberry bushes got so thick, they blocked access to my dam. I had to cut a new path."</p>
                <div className="text-xs text-gray-500">- Property owner from Victoria</div>
              </div>

              {/* Story 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-yellow-600 text-2xl">🌿</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Gorse Spreading Fast</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">"Gorse started in one corner and now it's spreading to my neighbor's property too."</p>
                <div className="text-xs text-gray-500">- Landowner from Tasmania</div>
              </div>
            </div>
          </section>

          {/* Simple Next Steps */}
          <section className="relative py-12 sm:py-16 bg-gradient-to-br from-green-50 via-white to-green-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Help Your Property?</h3>
              <p className="text-lg text-gray-600 mb-8">Here's what you can do next:</p>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <span className="text-green-600 text-xl">🗺️</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Check Your Area</h4>
                </div>
                <p className="text-gray-600 mb-4">See what problem plants are found near your property</p>
                <Link
                  to="/map"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300"
                >
                  View Map
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <span className="text-blue-600 text-xl">📅</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Know the Seasons</h4>
                </div>
                <p className="text-gray-600 mb-4">Learn when problem plants are most active in your area</p>
                <Link
                  to="/epic5"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300"
                >
                  Check Seasons
                </Link>
              </div>
            </div>
          </section>
        </div>
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
                  <li><Link to="/map" onClick={scrollToTop} className="hover:text-white transition-colors">Species Database</Link></li>
                  <li><Link to="/education" onClick={scrollToTop} className="hover:text-white transition-colors">Educational Resources</Link></li>
                  <li><Link to="/map" onClick={scrollToTop} className="hover:text-white transition-colors">Mapping Tools</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-3 text-sm">Company</h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li><Link to="/" onClick={scrollToTop} className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/insights" onClick={scrollToTop} className="hover:text-white transition-colors">Plant Information</Link></li>
                  <li><Link to="/map" onClick={scrollToTop} className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DidYouKnowPage;


