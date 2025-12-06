import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { 
      label: '소개', 
      path: '/about', 
      hasDropdown: false 
    },
    { 
      label: '내전 전적', 
      path: '/matches/my',
      hasDropdown: true,
      subItems: [
        { label: '내 전적 확인', path: '/matches/my' },
        { label: '전적 확인', path: '/matches/search' },
        { label: '유저 등급', path: '/matches/team' },
      ]
    },
    { 
      label: '정보', 
      path: '/info', 
      hasDropdown: true,
      subItems: [
        { label: '롤', path: '/info/lol' },
        { label: '메이플랜드', path: '/info/maple' },
        { label: '기타', path: '/info/other' },
      ]
    },
    { 
      label: 'FAQ', 
      path: '/faq', 
      hasDropdown: true,
      subItems: [
        { label: '자주 묻는 질문', path: '/faq/general' },
        { label: '계정 관련', path: '/faq/account' },
        { label: '기술 지원', path: '/faq/technical' },
        { label: '결제 관련', path: '/faq/payment' },
      ]
    },
    { 
      label: '문의', 
      path: '/contact', 
      hasDropdown: false 
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              TAD
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-0 relative">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative group"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.path)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center gap-1 h-full border-b-2 ${
                    isActive(item.path)
                      ? 'text-blue-600 border-blue-600'
                      : activeDropdown === item.path
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-700 border-transparent hover:text-blue-600'
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.path ? 'rotate-180' : ''
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
                  )}
                </Link>

                {item.hasDropdown && (
                  <div className="absolute left-0 w-48 bg-white rounded-b-lg shadow-lg border border-t-0 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-0">
                    {item.subItems.map((subItem, index) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                          index !== item.subItems.length - 1 ? 'border-b border-gray-100' : ''
                        } ${index === 0 ? 'rounded-t-lg' : ''} ${
                          index === item.subItems.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                    <Link
                      to="/mypage"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 border-t border-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  회원가입
                </Link>
              </div>
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
