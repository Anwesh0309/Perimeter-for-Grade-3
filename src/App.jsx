import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameStateProvider } from './context/GameStateContext';
import GradientBackground from './components/GradientBackground';

import HomePage from './pages/HomePage';
import WonderPage from './pages/WonderPage';
import StoryPage from './pages/StoryPage';
import SimulatePage from './pages/SimulatePage';
import WorldSelectPage from './pages/WorldSelectPage';
import QuizRunnerPage from './pages/QuizRunnerPage';
import ReflectPage from './pages/ReflectPage';

export default function App() {
  return (
    <GameStateProvider>
      <BrowserRouter>
        <GradientBackground />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wonder" element={<WonderPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/simulate" element={<SimulatePage />} />
          <Route path="/play" element={<WorldSelectPage />} />
          <Route path="/play/:worldId" element={<QuizRunnerPage />} />
          <Route path="/reflect" element={<ReflectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameStateProvider>
  );
}
