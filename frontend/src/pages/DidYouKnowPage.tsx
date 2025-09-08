import React from 'react';
import TaxonThreatChart from '../components/TaxonThreatChart';
import { Link } from 'react-router-dom';

const DidYouKnowPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">
      <header className="bg-green-800 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">InvaStop</Link>
          <nav className="hidden md:flex items-center gap-3">
            <Link to="/" className="px-3 py-1 rounded hover:bg-green-700">Home</Link>
            <Link to="/education" className="px-3 py-1 rounded hover:bg-green-700">Species Profile</Link>
            <Link to="/map" className="px-3 py-1 rounded hover:bg-green-700">Map</Link>
            <span className="px-3 py-1 rounded bg-green-600 border border-green-400">Did you Know?</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">Did you Know?</h1>
        <p className="text-gray-600 mb-6">Data-rich insights about invasive species in Australia.</p>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-10">
          <TaxonThreatChart />
        </div>

        {/* Additional insights placeholders using existing data */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-2">Top impacted group</h2>
            <p className="text-gray-600 text-sm">Plants remain the most impacted group across Australia.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-2">Species with broadest impact</h2>
            <p className="text-gray-600 text-sm">Red Fox shows wide impact across mammals and birds.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DidYouKnowPage;


