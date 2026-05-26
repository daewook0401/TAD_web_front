import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/authAPI';
import { useAuth } from '../../provider/AuthContext';
import { googleSignupDraft } from '../../utils/googleSignupDraft';
import '../../styles/pages/AuthPages.css';

const GoogleSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const draft = useMemo(() => location.state || googleSignupDraft.get(), [location.state]);
  const [nickname, setNickname] = useState(draft?.nickname || '');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const completeLogin = (data) => {
    login(
      {
        id: data.user.id,
        nickname: data.user.nickname,
        email: data.user.email,
        roles: data.user.roles,
      },
      {
        accessToken: data.accessToken,
      }
    );
    googleSignupDraft.clear();
    navigate('/matches/my');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!draft?.registrationToken) {
      setError('Google 가입 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    const normalizedNickname = nickname.trim();
    if (normalizedNickname.length < 2 || normalizedNickname.length > 20) {
      setError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }

    if (!agreeTerms) {
      setError('이용약관 및 개인정보처리방침에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.completeGoogleSignup({
        registrationToken: draft.registrationToken,
        nickname: normalizedNickname,
        termsAccepted: agreeTerms,
      });

      if (response.data.success) {
        completeLogin(response.data);
        return;
      }

      setError(response.data.message || 'Google 회원가입에 실패했습니다.');
    } catch (err) {
      setError(err.response?.data?.message || 'Google 회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <h2 className="auth-logo__title">TAD</h2>
          <p className="auth-logo__subtitle">게임 전적 관리 플랫폼</p>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Google 가입 완료</h1>
            <p className="auth-card__subtitle">서비스에서 사용할 정보를 확인해주세요</p>
          </div>

          {draft?.profileImageUrl && (
            <div className="auth-profile-preview">
              <img src={draft.profileImageUrl} alt="" className="auth-profile-preview__image" />
            </div>
          )}

          {error && (
            <div className="auth-message auth-message--error">
              <p>{error}</p>
            </div>
          )}

          {!draft?.registrationToken ? (
            <div className="auth-link-section">
              <p className="auth-link-text">Google 로그인 정보를 찾을 수 없습니다.</p>
              <Link to="/login" className="auth-link">로그인으로 돌아가기</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="googleEmail" className="auth-label">이메일</label>
                <input
                  id="googleEmail"
                  type="email"
                  value={draft.email || ''}
                  className="auth-input auth-input--readonly"
                  disabled
                />
              </div>

              <div className="auth-input-group">
                <label htmlFor="googleNickname" className="auth-label">닉네임</label>
                <input
                  id="googleNickname"
                  type="text"
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setError('');
                  }}
                  className="auth-input"
                  placeholder="2~20자 닉네임을 입력하세요"
                  maxLength={20}
                />
              </div>

              <div className="auth-checkbox-group">
                <input
                  id="googleAgreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) => setAgreeTerms(event.target.checked)}
                  className="auth-checkbox"
                />
                <label htmlFor="googleAgreeTerms" className="auth-checkbox-label">
                  <Link to="/terms">이용약관</Link>
                  {' 및 '}
                  <Link to="/privacy">개인정보처리방침</Link>
                  에 동의합니다
                </label>
              </div>

              <button type="submit" disabled={isLoading} className="auth-submit-btn">
                {isLoading ? '가입 중...' : '가입 완료'}
              </button>
            </form>
          )}

          <div className="auth-link-section">
            <p className="auth-link-text">
              다른 계정으로 진행하시겠어요?{' '}
              <Link to="/login" className="auth-link">다시 로그인</Link>
            </p>
          </div>
        </div>

        <div className="auth-footer">
          <p><Link to="/">홈으로 돌아가기</Link></p>
          <p>
            <Link to="/terms">이용약관</Link>
            {' | '}
            <Link to="/privacy">개인정보처리방침</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignupPage;
