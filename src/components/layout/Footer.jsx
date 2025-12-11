import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
              TAD
            </div>
            <p className="text-sm text-gray-600">
              현대적이고 깔끔한 게임 전적 관리 시스템
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">소개</a></li>
              <li><a href="/matches" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">전적</a></li>
              <li><a href="/info" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">정보</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">지원</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">문의</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">연락처</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@tad.com" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">support@tad.com</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2025 TAD. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">개인정보처리방침</a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
