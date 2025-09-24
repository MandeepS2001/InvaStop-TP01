import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGate from './components/AuthGate';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EducationPage from './pages/EducationPage';
import SpeciesDetailPage from './pages/SpeciesDetailPage';
import MapPage from './pages/MapPage';
import DidYouKnowPage from './pages/DidYouKnowPage';
import Epic5Page from './pages/Epic5Page';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AuthGate><Layout /></AuthGate>}>
        <Route index element={<HomePage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="species/:speciesName" element={<SpeciesDetailPage />} />
        <Route path="species-detail/:speciesName" element={<SpeciesDetailPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="insights" element={<DidYouKnowPage />} />
        <Route path="epic5" element={<Epic5Page />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="more" element={<div>More Page - Coming Soon</div>} />
      </Route>
    </Routes>
  );
}

export default App;
