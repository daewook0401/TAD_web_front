import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { analysisAPI } from '../../api/analysisAPI';
import { useAuth } from '../../provider/AuthContext';
import { notificationStorage } from '../../utils/notificationStorage';
import '../../styles/layout/Header.css';

const buildRecordNotification = (record) => {
  const normalizedStatus = record.status === 'CONFIRMED' && !record.confirmedAt && (record.recognizedPlayers ?? 0) > 0
    ? 'DRAFT'
    : record.status;

  if (normalizedStatus !== 'DRAFT' && normalizedStatus !== 'FAILED') {
    return null;
  }

  const isDraft = normalizedStatus === 'DRAFT';
  return {
    key: `${record.gameNumber}:${normalizedStatus}:${record.createdAt || ''}`,
    title: isDraft ? '검수 필요' : '분석 실패',
    message: `게임 #${record.gameNumber}`,
    to: isDraft ? `/matches/review/${record.gameNumber}` : '/matches/my',
  };
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotificationKeys, setReadNotificationKeys] = useState([]);
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

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setNotifications([]);
      setReadNotificationKeys([]);
      setIsNotificationOpen(false);
      return undefined;
    }

    setReadNotificationKeys(notificationStorage.getReadKeys(user.id));
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const response = await analysisAPI.getMyRecords();
        if (cancelled) {
          return;
        }

        const nextNotifications = (response.data ?? [])
          .map(buildRecordNotification)
          .filter(Boolean)
          .slice(0, 8);
        setNotifications(nextNotifications);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, user?.id]);

  const unreadCount = useMemo(() => (
    notifications.filter((notification) => !readNotificationKeys.includes(notification.key)).length
  ), [notifications, readNotificationKeys]);

  const markNotificationAsRead = (notificationKey) => {
    const nextReadKeys = [...new Set([...readNotificationKeys, notificationKey])];
    setReadNotificationKeys(nextReadKeys);
    notificationStorage.saveReadKeys(user?.id, nextReadKeys);
  };

  const markAllNotificationsAsRead = () => {
    const nextReadKeys = [...new Set([
      ...readNotificationKeys,
      ...notifications.map((notification) => notification.key),
    ])];
    setReadNotificationKeys(nextReadKeys);
    notificationStorage.saveReadKeys(user?.id, nextReadKeys);
  };

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
            <>
              <div className="header__notifications">
                <button
                  type="button"
                  className="header__notification-btn"
                  aria-label={`알림 ${unreadCount}개`}
                  onClick={() => {
                    setIsNotificationOpen((value) => !value);
                    setIsUserDropdownOpen(false);
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 01-6 0m6 0H9" />
                  </svg>
                  {unreadCount > 0 && <span className="header__notification-count">{unreadCount}</span>}
                </button>

                {isNotificationOpen && (
                  <div className="header__notification-panel">
                    <div className="header__notification-head">
                      <strong>알림</strong>
                      {notifications.length > 0 && (
                        <button type="button" onClick={markAllNotificationsAsRead}>
                          모두 읽음
                        </button>
                      )}
                    </div>
                    <div className="header__notification-list">
                      {notifications.length > 0 ? notifications.map((notification) => {
                        const isUnread = !readNotificationKeys.includes(notification.key);
                        return (
                          <Link
                            key={notification.key}
                            to={notification.to}
                            className={`header__notification-item ${isUnread ? 'header__notification-item--unread' : ''}`}
                            onClick={() => {
                              markNotificationAsRead(notification.key);
                              setIsNotificationOpen(false);
                            }}
                          >
                            <span>{notification.title}</span>
                            <strong>{notification.message}</strong>
                          </Link>
                        );
                      }) : (
                        <p className="header__notification-empty">새 알림이 없습니다.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="header__user">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen((value) => !value);
                    setIsNotificationOpen(false);
                  }}
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
                        setIsNotificationOpen(false);
                      }}
                      className="header__user-menu-item"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
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
                  {notifications.length > 0 && (
                    <Link to="/matches/my" className="header__mobile-link" onClick={closeMobileMenu}>
                      알림 {unreadCount > 0 ? `${unreadCount}개` : ''}
                    </Link>
                  )}
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
