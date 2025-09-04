import React from 'react';
import InteractiveMap from '../components/InteractiveMap';

const MapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Invasive Species Map
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See where invasive plants and animals are causing problems across Australia. 
              Click on any state to find out which species are most harmful there.
            </p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InteractiveMap />
      </div>

      {/* Additional Information Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Information</h3>
              <p className="text-gray-600">
                Our map shows up-to-date information about where invasive plants and animals are causing problems across Australia.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem Levels</h3>
              <p className="text-gray-600">
                Each state is colored to show how many problems invasive species are causing there, helping you see which areas need the most help.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">More Details</h3>
              <p className="text-gray-600">
                Click on any state to see which invasive species are causing the most trouble there and learn how to deal with them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
