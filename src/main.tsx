import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { BurgerEditor } from './components/BurgerEditor';
import { ImpactScreen } from './components/ImpactScreen';
import { AnimalDeathsScreen } from './components/AnimalDeathsScreen';
import { CompareScreen } from './components/CompareScreen';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={null} />
          <Route path="build" element={<BurgerEditor />} />
          <Route path="checkout" element={null} />
          <Route path="compare" element={<CompareScreen />} />
          <Route path="impact" element={<ImpactScreen />} />
          <Route path="deaths" element={<AnimalDeathsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
