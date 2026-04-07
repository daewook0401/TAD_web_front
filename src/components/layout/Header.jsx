import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';

const Header = () => {
  const location = useLocation();
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
      label: '정보 글',
      path: '/info',
      hasDropdown: true,
      subItems: [
        { label: '롤 정보', path: '/info/lol' },
        { label: '메이플랜드 정보', path: '/info/maple' },
        { label: '자유 정보', path: '/info/free' },
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
    { label: '소개', path: '/about', hasDropdown: false },
    { label: 'FAQ', path: '/faq', hasDropdown: false },
    { label: '문의', path: '/contact', hasDropdown: false },
  ];
  const dropdownSections = navItems.filter((item) => item.hasDropdown);

  const isActive = (item) => {
    if (item.subItems?.some((subItem) => location.pathname === subItem.path)) {
      return true;
    }

    if (item.path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  };

  const handleSubItemClick = (e, subItem) => {
    if (subItem.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
    }
  };

  return (
    <header
      className="relative z-50 bg-white border-b border-gray-200 shadow-sm"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-start justify-between">
          <Link to="/" className="flex-shrink-0 py-4">
            <div className="text-2xl font-extrabold tracking-wide text-slate-200 [-webkit-text-stroke:0.35px_rgba(125,179,255,0.35)] drop-shadow-[0_2px_10px_rgba(79,140,255,0.16)]">
              TAD
            </div>
          </Link>

          <div className="hidden md:flex flex-col items-stretch">
            <div className="flex items-center">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  className={item.hasDropdown ? 'w-40' : ''}
                  onMouseEnter={() => setActiveDropdown(item.hasDropdown ? item.path : null)}
                >
                  <Link
                    to={item.path}
                    className={`py-4 text-sm font-medium transition-colors duration-200 flex items-center gap-1 h-full ${
                      item.hasDropdown ? 'w-full justify-center px-4' : 'px-6'
                    } ${
                      isActive(item)
                        ? 'text-blue-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {activeDropdown && (
              <div className="grid w-[480px] grid-cols-3 bg-white/70 px-0 pb-3 pt-1 backdrop-blur-md">
                {dropdownSections.map((section) => (
                  <div
                    key={section.path}
                    className="w-40 space-y-2 px-4 text-center"
                    onMouseEnter={() => setActiveDropdown(section.path)}
                  >
                    {section.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={(e) => {
                          handleSubItemClick(e, subItem);
                          setActiveDropdown(null);
                        }}
                        className="block whitespace-nowrap text-sm font-medium text-gray-500 transition-colors duration-200"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 py-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user?.name || '사용자'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <Link
                      to="/mypage"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 border-t border-gray-200"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-10 items-center rounded-full border border-blue-300 bg-white px-5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-blue-300 hover:text-blue-600"
              >
                로그인
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
