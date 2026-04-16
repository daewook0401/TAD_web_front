import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import BoardPage from '../pages/BoardPage';
import BoardDetailPage from '../pages/board/BoardDetailPage';
import BoardWritePage from '../pages/board/BoardWritePage';
import MyMatchesPage from '../pages/matches/MyMatchesPage';
import SearchMatchesPage from '../pages/matches/SearchMatchesPage';
import PlayerMatchesPage from '../pages/matches/PlayerMatchesPage';
import MatchUploadPage from '../pages/matches/MatchUploadPage';
import MatchReviewPage from '../pages/matches/MatchReviewPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import MyPage from '../pages/MyPage';
import AdminPage from '../pages/AdminPage';
import RequireAdmin from '../components/auth/RequireAdmin';

export const router = createBrowserRouter([
  {
    element: (
      <RootLayout>
        <MainLayout />
      </RootLayout>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/board', element: <BoardPage /> },
      { path: '/board/write', element: <BoardWritePage /> },
      { path: '/board/post/:postId', element: <BoardDetailPage /> },
      { path: '/board/:category/write', element: <BoardWritePage /> },
      { path: '/board/:category/post/:postId/edit', element: <BoardWritePage /> },
      { path: '/board/:category/post/:postId', element: <BoardDetailPage /> },
      { path: '/board/:category', element: <BoardPage /> },
      { path: '/matches', element: <MyMatchesPage /> },
      { path: '/matches/my', element: <MyMatchesPage /> },
      { path: '/matches/search', element: <SearchMatchesPage /> },
      { path: '/matches/players/:playerName', element: <PlayerMatchesPage /> },
      { path: '/matches/upload', element: <MatchUploadPage /> },
      { path: '/matches/review/:gameId', element: <MatchReviewPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/mypage', element: <MyPage /> },
      {
        path: '/admin',
        element: (
          <RequireAdmin>
            <AdminPage />
          </RequireAdmin>
        ),
      },
    ],
  },
]);
