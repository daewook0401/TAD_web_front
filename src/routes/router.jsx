import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import InfoPage from '../pages/InfoPage';
import BoardPage from '../pages/BoardPage';
import MyMatchesPage from '../pages/matches/MyMatchesPage';
import SearchMatchesPage from '../pages/matches/SearchMatchesPage';
import TeamRankingPage from '../pages/matches/TeamRankingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import AboutPage from '../pages/AboutPage';
import FAQPage from '../pages/FAQPage';
import ContactPage from '../pages/ContactPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout><MainLayout /></RootLayout>,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/info',
        element: <InfoPage />,
      },
      {
        path: '/info/:category',
        element: <BoardPage />,
      },
      {
        path: '/board',
        element: <BoardPage />,
      },
      {
        path: '/matches',
        element: <MyMatchesPage />,
      },
      {
        path: '/matches/my',
        element: <MyMatchesPage />,
      },
      {
        path: '/matches/search',
        element: <SearchMatchesPage />,
      },
      {
        path: '/matches/team',
        element: <TeamRankingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/faq',
        element: <FAQPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
    ],
  },
]);
