import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/layout/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: '내전 전적',
      path: '/matches/search',
      basePath: '/matches',
      hasDropdown: true,
      subItems: [
        { label: '내전 기록 등록', path: '/matches/upload', requiresAuth: true },
        { label: '내 전적 확인', path: '/matches/my', requiresAuth: true },
        { label: '전적 검색', path: '/matches/search' },
        { label: '팀 순위', path: '/matches/team' },
      ],
    },
    {
      label: '게시판',
      path: '/board',
      basePath: '/board',
      hasDropdown: true,
      subItems: [
        { label: '롤 게시판', path: '/board/lol' },
        { label: '메이플 게시판', path: '/board/maple' },
        { label: '자유 게시판', path: '/board/free' },
      ],
    },
  ];

  const isActiveLink = (basePath) => location.pathname.startsWith(basePath);

  const handleProtectedNavigation = (event, subItem) => {
    if (subItem.requiresAuth && !isAuthenticated) {
      event.preventDefault();
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }

    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header" onMouseLeave={() => setActiveDropdown(null)}>
      <nav className="header__nav">
        <Link to="/" className="header__logo" onClick={closeMobileMenu}>
          <span className="header__logo-text">TAD</span>
        </Link>

        <div className="header__menu">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="header__menu-item"
              onMouseEnter={() => setActiveDropdown(item.hasDropdown ? item.path : null)}
            >
              <Link
                to={item.path}
                className={`header__menu-link ${isActiveLink(item.basePath) ? 'header__menu-link--active' : ''}`}
              >
                {item.label}
              </Link>

              {item.hasDropdown && activeDropdown === item.path && (
                <div className="header__dropdown">
                  <div className="header__dropdown-section">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="header__dropdown-link"
                        onClick={(event) => {
                          handleProtectedNavigation(event, subItem);
                          setActiveDropdown(null);
                        }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="header__actions">
          {isAuthenticated ? (
            <div className="header__user">
              <button
                onClick={() => setIsUserDropdownOpen((value) => !value)}
                className="header__user-btn"
              >
                <div className="header__user-avatar">{user?.nickname?.charAt(0) || 'U'}</div>
                <span className="header__user-name">
                  {user?.nickname || '사용자'}
                  {isAdmin() && <span className="header__admin-badge">관리자</span>}
                </span>
                <svg className="header__user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserDropdownOpen && (
                <div className="header__user-dropdown">
                  <Link to="/mypage" className="header__user-menu-item" onClick={() => setIsUserDropdownOpen(false)}>
                    마이페이지
                  </Link>
                  <Link
                    to="/matches/upload"
                    className="header__user-menu-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    내전 기록 등록
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="header__user-menu-item" onClick={() => setIsUserDropdownOpen(false)}>
                      관리자 페이지
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="header__user-menu-item"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="header__login-btn">
              로그인
            </Link>
          )}
        </div>

        <button
          className="header__mobile-btn"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMobileMenuOpen}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          <div className="header__mobile-menu-inner">
            {navItems.map((item) => (
              <div key={item.path} className="header__mobile-section">
                <Link
                  to={item.path}
                  className={`header__mobile-link header__mobile-link--main ${isActiveLink(item.basePath) ? 'header__mobile-link--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
                <div className="header__mobile-subitems">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className="header__mobile-link"
                      onClick={(event) => handleProtectedNavigation(event, subItem)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="header__mobile-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/mypage" className="header__mobile-link" onClick={closeMobileMenu}>
                    마이페이지
                  </Link>
                  <Link to="/matches/upload" className="header__mobile-link" onClick={closeMobileMenu}>
                    내전 기록 등록
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="header__mobile-link" onClick={closeMobileMenu}>
                      관리자 페이지
                    </Link>
                  )}
                  <button
                    className="header__mobile-link"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link to="/login" className="header__mobile-login" onClick={closeMobileMenu}>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
