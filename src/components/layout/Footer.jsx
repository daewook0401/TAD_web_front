import React from 'react';
import '../../styles/layout/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              TAD
            </div>
            <p className="footer__description">
              현대적이고 깔끔한 게임 전적 관리 시스템
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="footer__section-title">서비스</h3>
            <ul className="footer__links">
              <li><a href="/matches" className="footer__link">전적</a></li>
              <li><a href="/board" className="footer__link">게시판</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer__section-title">연락처</h3>
            <ul className="footer__links">
              <li><a href="mailto:support@tad.com" className="footer__link">support@tad.com</a></li>
              <li><a href="#" className="footer__link">Discord</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2025 TAD. All rights reserved.
          </p>
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">개인정보처리방침</a>
            <a href="#" className="footer__legal-link">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
