import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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

  return (
    <header >
      <nav >
        <div >
          <Link to="/" >
            <div >
              TAD
            </div>
          </Link>

          <div >
            {navItems.map((item) => (
              <div
                key={item.path}
                
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.path)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  
                >
                  {item.label}
                  {item.hasDropdown && (
                    <svg
                      
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

                {item.hasDropdown && activeDropdown === item.path && (
                  <div >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div >
            {isAuthenticated ? (
              <div >
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  
                >
                  <div >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span >
                    {user?.name || '사용자'}
                  </span>
                  <svg
                    
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
                  <div >
                    <Link
                      to="/mypage"
                      
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div >
                <Link
                  to="/login"
                  
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          <button >
            <svg
              
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
