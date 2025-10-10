import React from 'react';
import { Link } from 'react-router-dom';
import PlantIdentificationQuiz from '../components/PlantIdentificationQuiz';
import LiquidEther from '../components/LiquidEther';
import SimpleHeader from '../components/SimpleHeader';

const QuizPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Simple Header */}
      <SimpleHeader />

      {/* Hero Section with LiquidEther */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
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
            autoIntensity={1.7}
            takeoverDuration={0.25}
            autoResumeDelay={1500}
            autoRampDuration={0.6}
          />
        </div>
        
        {/* Dark overlay for text readability - with pointer-events-none to allow mouse events through */}
        <div className="absolute inset-0 bg-black/17 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="inline-block">
              Test Your Plant Knowledge
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Build confidence in identifying invasive plants and see the positive impact of protecting your land.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Why It Matters Section */}
          <div className="py-12 bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why It Matters</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Every time you spot and remove an invasive species, you help protect Australia's unique wildlife and keep our environment healthy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-green-600 text-xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Build Confidence</h3>
                  <p className="text-sm text-gray-600">
                    Practice identifying invasive plants in a safe environment before encountering them in real life
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-blue-600 text-xl">🏆</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Earn Achievements</h3>
                  <p className="text-sm text-gray-600">
                    Unlock badges and track your progress as you become more skilled at plant identification
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-purple-600 text-xl">📈</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">See the Impact</h3>
                  <p className="text-sm text-gray-600">
                    Visualize how your actions contribute to environmental protection and land restoration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Content */}
          <PlantIdentificationQuiz />
        </div>
      </div>

    </div>
  );
};

export default QuizPage;