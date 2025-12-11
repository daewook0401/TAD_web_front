import React from 'react';
import { Link } from 'react-router-dom';

const InfoPage = () => {
  const categories = [
    {
      id: 'lol',
      name: '롤',
      icon: '🎮',
      description: '롤(League of Legends) 게임에 대한 정보를 공유합니다',
      postCount: 245,
      color: 'blue'
    },
    {
      id: 'maple',
      name: '메이플랜드',
      icon: '🍁',
      description: '메이플랜드 게임에 대한 정보를 공유합니다',
      postCount: 128,
      color: 'green'
    },
    {
      id: 'other',
      name: '기타',
      icon: '⭐',
      description: '다른 게임들에 대한 정보를 공유합니다',
      postCount: 89,
      color: 'purple'
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">정보</h1>
          <p className="text-xl text-gray-600">
            다양한 게임들에 대한 정보와 팁을 공유하고 커뮤니티와 소통하세요
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/info/${category.id}`}
                className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl">{category.icon}</span>
                  <span className={`inline-block px-3 py-1 bg-${category.color}-100 text-${category.color}-700 rounded-full text-xs font-semibold`}>
                    {category.postCount}개 게시물
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  {category.name}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {category.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  보기
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            이 게시판의 특징
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">커뮤니티 소통</h3>
              <p className="text-gray-600">
                다른 플레이어들과 게임 정보, 팁, 경험을 공유하세요
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">최신 정보</h3>
              <p className="text-gray-600">
                게임의 최신 업데이트와 변경사항을 빠르게 확인할 수 있습니다
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">전문 가이드</h3>
              <p className="text-gray-600">
                프로게이머들의 전략과 가이드를 배울 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoPage;
