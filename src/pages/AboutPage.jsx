import { useState } from 'react';

function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TAD에 오신 것을 환영합니다
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            롤 내전 전적을 기록하고 분석하는 최고의 플랫폼
          </p>
        </div>
      </section>

      {/* What is TAD */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">TAD란?</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                TAD(Team Analysis Dashboard)는 롤 내전 전적을 체계적으로 관리하고 분석할 수 있는 종합 플랫폼입니다.
              </p>
              <p>
                친구들과의 내전 결과를 기록하고, 개인 및 팀 통계를 확인하며, 
                실력 향상을 위한 인사이트를 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">주요 기능</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: '전적 관리',
                description: '내전 결과를 쉽게 기록하고 관리할 수 있습니다.',
              },
              {
                icon: '🔍',
                title: '전적 검색',
                description: '다른 플레이어의 전적을 검색하고 비교할 수 있습니다.',
              },
              {
                icon: '🏆',
                title: '유저 랭킹',
                description: 'S부터 D까지 등급별 랭킹 시스템으로 실력을 평가합니다.',
              },
              {
                icon: '📈',
                title: '통계 분석',
                description: '승률, KDA, 플레이 패턴 등 상세한 통계를 제공합니다.',
              },
              {
                icon: '👥',
                title: '팀 매칭',
                description: '실력에 맞는 균형잡힌 팀 구성을 지원합니다.',
              },
              {
                icon: '🎮',
                title: 'Discord 연동',
                description: 'Discord 봇을 통해 편리하게 전적을 확인할 수 있습니다.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-600 hover:shadow-md transition-all hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">이용 방법</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: '회원가입',
                description: '간단한 정보 입력으로 회원가입을 완료하세요.',
              },
              {
                step: '2',
                title: '전적 기록',
                description: '내전 결과를 입력하고 자동으로 통계가 집계됩니다.',
              },
              {
                step: '3',
                title: '분석 & 성장',
                description: '통계를 확인하고 실력을 향상시켜 보세요.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">팀 소개</h2>
          <p className="text-xl text-gray-700 mb-12">
            롤을 사랑하는 개발자들이 만든 내전 전적 관리 플랫폼
          </p>
          <div className="bg-gray-50  rounded-xl p-8 border border-gray-200 inline-block">
            <p className="text-lg text-gray-700">
              더 나은 서비스를 위해 항상 노력하고 있습니다.<br />
              문의사항이나 제안이 있으시면 언제든 연락 주세요!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">지금 바로 시작하세요!</h2>
          <p className="text-xl text-gray-700 mb-8">
            친구들과의 내전 전적을 관리하고 실력을 향상시켜보세요.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/signup"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
            >
              회원가입
            </a>
            <a
              href="/matches/search"
              className="px-8 py-3 bg-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors"
            >
              전적 검색
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
