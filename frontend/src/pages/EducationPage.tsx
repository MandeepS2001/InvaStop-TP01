import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const EducationPage: React.FC = () => {
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
              <Link to="/education" className="text-white hover:text-green-200 transition-colors font-semibold">
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
        {/* Top Section */}
        <section className="bg-green-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Panel - Illustration */}
              <div className="bg-gray-200 rounded-2xl p-8">
                <div className="relative h-96">
                  {/* Placeholder for layered paper-cut style illustration */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-300 via-green-400 to-green-500 rounded-xl">
                    {/* Background - Rolling hills */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-green-300 rounded-b-xl"></div>
                    
                    {/* Midground - City buildings and trees */}
                    <div className="absolute bottom-8 left-4 right-4 flex justify-between">
                      <div className="w-16 h-24 bg-green-600 rounded-t-lg"></div>
                      <div className="w-12 h-20 bg-green-500 rounded-t-lg"></div>
                      <div className="w-20 h-28 bg-green-700 rounded-t-lg"></div>
                      <div className="w-14 h-22 bg-green-600 rounded-t-lg"></div>
                    </div>
                    
                    {/* Foreground - Grass */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-400 rounded-b-xl"></div>
                    
                    {/* Hot air balloon */}
                    <div className="absolute top-8 right-8">
                      <div className="w-8 h-10 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-6 bg-orange-300 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Content */}
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  How to help ?
                </h1>
                <p className="text-xl mb-8 text-green-100 leading-relaxed">
                  Don't let governments off the hook, help us call for real action that protects our natural environment from invasive species.
                </p>
                <button className="text-white underline text-lg hover:text-green-200 transition-colors">
                  Show More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mid Section - Animals Grid */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Text Block */}
              <div className="text-center lg:text-left">
                <div className="space-y-4 text-gray-700 italic text-2xl font-medium">
                  <div>Feeling familiar?</div>
                  <div>Click on.</div>
                  <div>and Check</div>
                  <div>out more !</div>
                </div>
              </div>

              {/* Right Image Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Top Row */}
                <div className="space-y-4">
                  {/* Red Fox */}
                  <Link to="/species/red-fox" className="block">
                    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="w-full h-32 bg-orange-200 rounded-lg flex items-center justify-center">
                        <div className="text-orange-600 text-sm text-center">
                          Red Fox
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Rabbit */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="w-full h-32 bg-brown-200 rounded-lg flex items-center justify-center">
                      <div className="text-brown-600 text-sm text-center">
                        Rabbit
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Goats */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-gray-600 text-sm text-center">
                        Goats
                      </div>
                    </div>
                  </div>
                  
                  {/* Toad */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="w-full h-32 bg-green-200 rounded-lg flex items-center justify-center">
                      <div className="text-green-600 text-sm text-center">
                        🐸<br/>Toad
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Wildcat */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="w-full h-32 bg-yellow-200 rounded-lg flex items-center justify-center">
                      <div className="text-yellow-600 text-sm text-center">
                        🐱<br/>Wildcat
                      </div>
                    </div>
                  </div>
                  
                  {/* Wild Boars */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="w-full h-32 bg-brown-200 rounded-lg flex items-center justify-center">
                      <div className="text-brown-600 text-sm text-center">
                        🐗<br/>Wild Boars
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default EducationPage;
