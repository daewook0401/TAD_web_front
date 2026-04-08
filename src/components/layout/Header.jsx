import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';
import '../../styles/layout/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navItems = [
    {
      label: '내전 전적',
      path: '/matches/search',
      hasDropdown: true,
      subItems: [
        { label: '내 전적 확인', path: '/matches/my', requiresAuth: true },
        { label: '전적 검색', path: '/matches/search' },
        { label: '팀 랭킹', path: '/matches/team' },
      ]
    },
    {
      label: '게시판',
      path: '/board',
      hasDropdown: true,
      subItems: [
        { label: '롤 게시판', path: '/board/lol' },
        { label: '메이플랜드 게시판', path: '/board/maple' },
        { label: '자유 게시판', path: '/board/free' },
      ]
    },
  ];

  const handleSubItemClick = (e, subItem) => {
    if (subItem.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
    }
  };

  return (
    <header
      className="site-header"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          <span className="header__logo-text">TAD</span>
        </Link>

        <div className="header__menu">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="header__menu-item"
              onMouseEnter={() => setActiveDropdown(item.hasDropdown ? item.path : null)}
            >
              <Link to={item.path} className="header__menu-link">
                {item.label}
              </Link>
              
              {item.hasDropdown && activeDropdown === item.path && (
                <div className="header__dropdown">
                  <div className="header__dropdown-section">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={(e) => {
                          handleSubItemClick(e, subItem);
                          setActiveDropdown(null);
                        }}
                        className="header__dropdown-link"
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
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="header__user-btn"
              >
                <div className="header__user-avatar">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="header__user-name">
                  {user?.name || '사용자'}
                </span>
                <svg
                  className="header__user-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isUserDropdownOpen && (
                <div className="header__user-dropdown">
                  <Link
                    to="/mypage"
                    className="header__user-menu-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    마이페이지
                  </Link>
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

        <button className="header__mobile-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
};

export default Header;
