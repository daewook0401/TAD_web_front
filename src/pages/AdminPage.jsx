import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../provider/AuthContext';
import '../styles/pages/MyPage.css';

const adminActions = [
  {
    title: '게시판 관리',
    description: '관리자 권한으로 게시글과 댓글 수정 및 삭제 권한을 바로 점검합니다.',
    to: '/board',
    actionLabel: '게시판 열기',
  },
  {
    title: '내 계정 확인',
    description: '현재 로그인한 계정의 역할과 기본 프로필 정보를 다시 확인합니다.',
    to: '/mypage',
    actionLabel: '마이페이지',
  },
];

const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div className="mypage">
      <div className="mypage__container">
        <h1 className="mypage__title">관리자 페이지</h1>

        <div className="mypage__card">
          <div className="mypage__card-header">
            <h2 className="mypage__card-title">관리자 권한 상태</h2>
          </div>

          <div className="mypage__profile">
            <div className="mypage__avatar">
              {(user?.nickname || 'A').charAt(0)}
            </div>
            <div className="mypage__info">
              <div className="mypage__info-row">
                <span className="mypage__info-label">닉네임</span>
                <span className="mypage__info-value">
                  {user?.nickname}
                  <span className="mypage__admin-badge">관리자</span>
                </span>
              </div>
              <div className="mypage__info-row">
                <span className="mypage__info-label">이메일</span>
                <span className="mypage__info-value">{user?.email}</span>
              </div>
              <div className="mypage__info-row">
                <span className="mypage__info-label">권한</span>
                <span className="mypage__info-value">{(user?.roles || []).join(', ') || 'ROLE_ADMIN'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mypage__card">
          <div className="mypage__card-header">
            <h2 className="mypage__card-title">관리 작업 바로가기</h2>
          </div>

          <div className="mypage__info">
            {adminActions.map((item) => (
              <div key={item.title} className="mypage__info-row">
                <span className="mypage__info-label">{item.title}</span>
                <span className="mypage__info-value">
                  {item.description}{' '}
                  <Link to={item.to}>{item.actionLabel}</Link>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
