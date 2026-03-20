import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { SkillsListPage } from './pages/SkillsListPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { SkillPublishPage } from './pages/SkillPublishPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { RankingsPage } from './pages/RankingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/skills" element={<SkillsListPage />} />
            <Route path="/skills/:id" element={<SkillDetailPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/skills/publish" element={<SkillPublishPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
