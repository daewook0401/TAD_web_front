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
      // 추후 추가될 페이지들
      // {
      //   path: '/about',
      //   element: <AboutPage />,
      // },
      // {
      //   path: '/faq',
      //   element: <FAQPage />,
      // },
      // {
      //   path: '/contact',
      //   element: <ContactPage />,
      // },
      // {
      //   path: '/mypage',
      //   element: <MyPage />,
      // },
    ],
  },
]);
