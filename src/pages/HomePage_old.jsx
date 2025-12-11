import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // 더미 데이터
  const matchesData = [
    { id: 1, date: '2025-12-06', game: 'League of Legends', result: '승리', kda: '12/2/8', duration: '35분' },
    { id: 2, date: '2025-12-05', game: 'League of Legends', result: '패배', kda: '8/5/6', duration: '28분' },
    { id: 3, date: '2025-12-05', game: 'Mapleland', result: '승리', kda: '15/1/10', duration: '42분' },
    { id: 4, date: '2025-12-04', game: 'League of Legends', result: '승리', kda: '10/3/9', duration: '31분' },
    { id: 5, date: '2025-12-04', game: 'Mapleland', result: '패배', kda: '7/8/5', duration: '25분' },
  ];

  const infoData = [
    { id: 1, category: 'League of Legends', title: '새로운 챔피언 공략', author: '게임마스터', views: 1523, date: '2025-12-06' },
    { id: 2, category: 'League of Legends', title: '시즌 9 메타 분석', author: '프로게이머', views: 2341, date: '2025-12-05' },
    { id: 3, category: 'Mapleland', title: '효율적인 레벨링 팁', author: '시스템운영자', views: 892, date: '2025-12-04' },
    { id: 4, category: 'League of Legends', title: '랭크 올리는 법', author: '경험자', views: 3456, date: '2025-12-03' },
    { id: 5, category: 'Mapleland', title: '보스 레이드 가이드', author: '길드마스터', views: 1205, date: '2025-12-02' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Welcome Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl"></div>

        <div className="w-full px-6">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                환영합니다.
              </h1>
              <h2 className="text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TAD 사이트입니다
              </h2>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              당신의 게임 전적을 한곳에서 관리하고, 실시간으로 분석하며, 다른 플레이어들과 소통하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                to="/signup"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                시작하기
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-400 transition-colors duration-200"
              >
                자세히 알아보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Matches Table */}
      <section className="py-20 bg-gray-800">
        <div className="w-full px-6">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">최근 내전 전적</h2>
                <p className="text-gray-400">최근 경기 기록을 확인하세요</p>
              </div>
              <Link
                to="/matches/my"
                className="px-6 py-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-200"
              >
                전체보기 →
              </Link>
            </div>

            <div className="bg-gray-800 backdrop-blur-lg rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">날짜</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">게임</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">결과</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">K/D/A</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">게임시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchesData.map((match) => (
                      <tr key={match.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-300">{match.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{match.game}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            match.result === '승리'
                              ? 'bg-green-500 text-green-400 border border-green-500'
                              : 'bg-red-500 text-red-400 border border-red-500'
                          }`}>
                            {match.result}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{match.kda}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{match.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Articles Table */}
      <section className="py-20">
        <div className="w-full px-6">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">최신 정보 글</h2>
                <p className="text-gray-400">게임 정보와 팁을 확인하세요</p>
              </div>
              <Link
                to="/info"
                className="px-6 py-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-200"
              >
                전체보기 →
              </Link>
            </div>

            <div className="bg-gray-800 backdrop-blur-lg rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">카테고리</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">제목</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">작성자</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">조회수</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoData.map((article) => (
                      <tr key={article.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-3 py-1 bg-blue-500 text-blue-400 border border-blue-500 rounded-full text-xs font-semibold">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{article.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{article.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{article.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{article.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
