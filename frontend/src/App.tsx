import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EducationPage from './pages/EducationPage';
import SpeciesDetailPage from './pages/SpeciesDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="species/:stateName" element={<SpeciesDetailPage />} />
        <Route path="species-detail/:speciesName" element={<SpeciesDetailPage />} />
        <Route path="map" element={<div>Map Page - Coming Soon</div>} />
        <Route path="more" element={<div>More Page - Coming Soon</div>} />
      </Route>
    </Routes>
  );
}

export default App;
