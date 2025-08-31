import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

const SpeciesDetailPage: React.FC = () => {
  const { speciesId } = useParams();

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

      {/* Main Content Area */}
      <div className="pt-24">
        {/* Main Content Section */}
        <section className="bg-green-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Panel - Text and Button */}
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Feral Fox
                </h1>
                <p className="text-xl mb-8 text-green-100 italic">
                  Feral Animals
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg transition-colors font-semibold text-lg">
                  Report Now !
                </button>
              </div>

              {/* Right Panel - Fox Image */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Placeholder for fox image */}
                  <div className="w-96 h-96 bg-orange-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🦊</div>
                      <div className="text-orange-600 font-semibold">Red Fox Image</div>
                      <div className="text-orange-500 text-sm">High-resolution photo of a red fox</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              About Feral Fox
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                European foxes Vulpes vulpes are the most wide-spread carnivore in the world. 
                They were introduced to mainland Australia in the 1850s for recreational hunting 
                and spread rapidly. Feral foxes are now abundant in all states and territories 
                except Tasmania.
              </p>
              
              {/* Additional Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Scientific Name</h3>
                  <p className="text-gray-700 italic">Vulpes vulpes</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Introduced</h3>
                  <p className="text-gray-700">1850s</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Distribution</h3>
                  <p className="text-gray-700">All states and territories except Tasmania</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
                  <p className="text-gray-700">Abundant and widespread</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Education Button */}
        <section className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link 
              to="/education" 
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              ← Back to Education
            </Link>
          </div>
        </section>
      </div>

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

export default SpeciesDetailPage;
