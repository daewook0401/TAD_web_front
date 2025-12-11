import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './provider/AuthContext';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import InfoPage from './pages/InfoPage';
import BoardPage from './pages/BoardPage';
import MyMatchesPage from './pages/matches/MyMatchesPage';
import SearchMatchesPage from './pages/matches/SearchMatchesPage';
import TeamRankingPage from './pages/matches/TeamRankingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="617855234940-dp6iq2v93alink0ttpmgadohvbhj0fo5.apps.googleusercontent.com">
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/info/:category" element={<BoardPage />} />
            <Route path="/matches/my" element={<MyMatchesPage />} />
            <Route path="/matches/search" element={<SearchMatchesPage />} />
            <Route path="/matches/team" element={<TeamRankingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* 추후 추가될 페이지들 */}
            {/* <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/mypage" element={<MyPage />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
