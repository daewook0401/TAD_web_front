import { Link } from 'react-router-dom';
import '../../styles/pages/PolicyPages.css';

const PrivacyPage = () => {
  return (
    <main className="policy-page">
      <div className="policy-page__container">
        <header className="policy-page__header">
          <Link to="/" className="policy-page__brand">TAD</Link>
          <p className="policy-page__eyebrow">Privacy Policy</p>
          <h1 className="policy-page__title">개인정보처리방침</h1>
          <p className="policy-page__meta">시행일: 2026년 5월 26일</p>
        </header>

        <section className="policy-page__section">
          <h2>1. 수집하는 개인정보</h2>
          <ul>
            <li>회원가입: 이메일, 닉네임, 비밀번호 암호화 값</li>
            <li>Google 로그인: Google 계정 식별 정보, 이메일, 프로필 이미지, 표시 이름</li>
            <li>서비스 이용: 전적 이미지, 분석 결과, 게시글, 댓글, 접속 일시, IP 주소, User-Agent</li>
            <li>인증 유지: access token, refresh token 쿠키, 로그인 세션 정보</li>
          </ul>
        </section>

        <section className="policy-page__section">
          <h2>2. 개인정보 이용 목적</h2>
          <p>
            수집한 정보는 회원 식별과 인증, 전적 분석 결과 제공, 게시판 운영, 보안 로그 관리, 부정 이용 방지,
            장애 대응, 서비스 품질 개선을 위해 사용합니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>3. 보관 기간</h2>
          <p>
            회원 정보는 탈퇴 시 비활성화 또는 익명화합니다. 다만 관계 법령에 따라 보관이 필요한 정보, 분쟁 대응과
            부정 이용 방지를 위한 최소 기록은 필요한 기간 동안 분리 보관할 수 있습니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>4. 제3자 제공과 처리 위탁</h2>
          <p>
            서비스는 법령상 근거가 있거나 회원의 동의가 있는 경우를 제외하고 개인정보를 외부에 제공하지 않습니다.
            이메일 발송, 파일 저장, 분석 처리 등 서비스 운영에 필요한 외부 시스템을 사용할 수 있으며, 이 경우
            필요한 범위 안에서만 정보를 처리합니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>5. 쿠키와 토큰</h2>
          <p>
            로그인 유지를 위해 refresh token을 보안 쿠키로 저장합니다. 브라우저 설정으로 쿠키를 제한할 수 있지만,
            이 경우 로그인 유지와 자동 토큰 재발급이 정상적으로 동작하지 않을 수 있습니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>6. 이용자의 권리</h2>
          <p>
            회원은 마이페이지에서 자신의 프로필을 확인하고 수정할 수 있으며, 계정 탈퇴를 요청할 수 있습니다.
            개인정보 열람, 정정, 삭제, 처리 정지 요청은 서비스 내 문의 절차를 통해 접수할 수 있습니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>7. 안전성 확보 조치</h2>
          <p>
            서비스는 비밀번호 암호화, 인증 토큰 분리 저장, 접근 권한 관리, 접속 기록 보관 등 개인정보 보호를 위한
            기술적, 관리적 조치를 적용합니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>8. 방침 변경</h2>
          <p>
            개인정보처리방침이 변경되는 경우 서비스 화면을 통해 변경 내용과 시행일을 안내합니다. 중요한 변경은
            합리적인 기간을 두고 사전에 고지합니다.
          </p>
        </section>

        <footer className="policy-page__footer">
          <Link to="/terms">이용약관</Link>
          <Link to="/">홈으로 돌아가기</Link>
        </footer>
      </div>
    </main>
  );
};

export default PrivacyPage;
