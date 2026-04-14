import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../../assets/TADHeaderLogo.png';
import ListItem from '../../common/ListItem';
import Login from '../../button/Login';
import { useAuth } from '../../../provider/AuthContext';

const UserHeader = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navi = useNavigate();
  const [subNav, setSubNav] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const clickBoardItem = () => {
    setSubNav(!subNav);
    setIsMobileMenuOpen(false);
    navi('/board');
  };

  const handleMenuClick = (path) => {
    setSubNav(false);
    setIsMobileMenuOpen(false);
    navi(path);
  };

  return (
    <header>
      <div>
        <div onClick={() => navi('/')}>
          <img src={logo} alt="TADlogo" onClick={() => handleMenuClick('/')} />
        </div>

        <nav>
          <ListItem onClick={() => handleMenuClick('/')}>소개</ListItem>
          <ListItem onClick={() => handleMenuClick('/matches/my')}>대시보드</ListItem>
          <ListItem onClick={clickBoardItem}>게시판</ListItem>
          <ListItem onClick={() => handleMenuClick('/board')}>공지사항</ListItem>
          <ListItem onClick={() => handleMenuClick('/mypage')}>문의하기</ListItem>
        </nav>

        <div>
          {!isAuthenticated ? (
            <Login />
          ) : (
            <>
              {isAdmin() ? (
                <button onClick={() => navi('/admin')}>
                  관리자 페이지
                </button>
              ) : (
                <button onClick={() => navi('/mypage')}>
                  마이페이지
                </button>
              )}
              <button onClick={logout}>
                로그아웃
              </button>
            </>
          )}
        </div>

        <div>
          <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div>
          <ul>
            <li onClick={() => handleMenuClick('/')}>소개</li>
            <li onClick={() => handleMenuClick('/matches/my')}>대시보드</li>
            <li onClick={clickBoardItem}>게시판</li>
            <li onClick={() => handleMenuClick('/board')}>공지사항</li>
            <li onClick={() => handleMenuClick('/mypage')}>문의하기</li>
          </ul>
          <div>
            {!isAuthenticated ? (
              <>
                <Login />
                <button type="button" onClick={() => navi('/signup')}>
                  회원가입
                </button>
              </>
            ) : (
              <>
                {isAdmin() ? (
                  <button type="button" onClick={() => navi('/admin')}>
                    관리자 페이지
                  </button>
                ) : (
                  <button type="button" onClick={() => navi('/mypage')}>
                    마이페이지
                  </button>
                )}
                <button type="button" onClick={logout}>
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {subNav && (
        <div>
          <nav>
            <ul>
              <li onClick={() => navi('/board')}>전체 게시판</li>
              <li onClick={() => navi('/board/free')}>자유게시판</li>
              <li onClick={() => navi('/board/lol')}>리그오브레전드</li>
              <li onClick={() => navi('/board/maple')}>메이플스토리</li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
