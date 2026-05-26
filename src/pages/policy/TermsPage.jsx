import { Link } from 'react-router-dom';
import '../../styles/pages/PolicyPages.css';

const TermsPage = () => {
  return (
    <main className="policy-page">
      <div className="policy-page__container">
        <header className="policy-page__header">
          <Link to="/" className="policy-page__brand">TAD</Link>
          <p className="policy-page__eyebrow">Terms of Service</p>
          <h1 className="policy-page__title">이용약관</h1>
          <p className="policy-page__meta">시행일: 2026년 5월 26일</p>
        </header>

        <section className="policy-page__section">
          <h2>제1조 목적</h2>
          <p>
            이 약관은 TAD가 제공하는 게임 전적 관리, 이미지 분석, 게시판 및 관련 서비스의 이용 조건과
            회원과 서비스의 권리, 의무, 책임 사항을 정합니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>제2조 계정과 회원가입</h2>
          <p>
            회원은 정확한 이메일과 닉네임 등 필수 정보를 입력해야 하며, 본인 계정을 제3자에게 양도하거나
            공유해서는 안 됩니다. Google 계정으로 가입하는 경우 이메일 인증은 Google 인증 결과로 대체됩니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>제3조 서비스 이용</h2>
          <p>
            회원은 전적 이미지 업로드, 분석 결과 확인, 게시글과 댓글 작성 등 서비스가 제공하는 기능을 사용할 수
            있습니다. 업로드된 이미지와 분석 결과는 전적 관리 및 서비스 품질 개선을 위해 처리될 수 있습니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>제4조 금지 행위</h2>
          <ul>
            <li>타인의 계정, 개인정보, 전적 정보를 무단으로 사용하는 행위</li>
            <li>허위 정보, 악성 코드, 불법 또는 권리 침해 콘텐츠를 게시하거나 업로드하는 행위</li>
            <li>서비스의 정상 운영을 방해하거나 보안 취약점을 악용하는 행위</li>
            <li>자동화 도구로 과도한 요청을 보내거나 분석 시스템을 우회하는 행위</li>
          </ul>
        </section>

        <section className="policy-page__section">
          <h2>제5조 게시물과 업로드 자료</h2>
          <p>
            회원은 자신이 작성하거나 업로드한 자료에 필요한 권리를 보유해야 합니다. 서비스는 운영, 보안, 신고
            대응, 분석 결과 제공에 필요한 범위에서 게시물과 업로드 자료를 저장하고 표시할 수 있습니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>제6조 서비스 변경과 중단</h2>
          <p>
            서비스는 안정적인 운영을 위해 기능을 변경하거나 일시 중단할 수 있습니다. 중요한 변경이 있는 경우
            가능한 방법으로 사전에 안내합니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>제7조 회원 탈퇴</h2>
          <p>
            회원은 마이페이지에서 탈퇴를 요청할 수 있습니다. 탈퇴 시 계정은 비활성화되고 로그인 세션은 종료됩니다.
            법령상 보관이 필요한 정보와 부정 이용 방지를 위한 최소 기록은 정해진 기간 동안 보관될 수 있습니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>제8조 책임 제한</h2>
          <p>
            서비스는 회원이 입력하거나 업로드한 자료를 기반으로 분석 결과를 제공합니다. 분석 결과는 참고용이며,
            회원의 이용 환경, 원본 이미지 품질, 외부 서비스 상태에 따라 정확도가 달라질 수 있습니다.
          </p>
        </section>

        <section className="policy-page__section">
          <h2>제9조 약관 변경</h2>
          <p>
            약관을 변경할 때에는 적용일과 변경 내용을 서비스 화면에 안내합니다. 변경 내용에 동의하지 않는 회원은
            서비스 이용을 중단하고 탈퇴할 수 있습니다.
          </p>
        </section>

        <footer className="policy-page__footer">
          <Link to="/privacy">개인정보처리방침</Link>
          <Link to="/">홈으로 돌아가기</Link>
        </footer>
      </div>
    </main>
  );
};

export default TermsPage;
