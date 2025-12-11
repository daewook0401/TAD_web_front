import React from 'react';
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
    <div className="bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full px-6">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                환영합니다.
              </h1>
              <h2 className="text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TAD 사이트입니다
              </h2>
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              당신의 게임 전적을 한곳에서 관리하고, 실시간으로 분석하며, 다른 플레이어들과 소통하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                to="/signup"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                시작하기
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
              >
                자세히 알아보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Matches Table */}
      <section className="py-20">
        <div className="w-full px-6">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">최근 내전 전적</h2>
                <p className="text-gray-600">최근 경기 기록을 확인하세요</p>
              </div>
              <Link
                to="/matches/my"
                className="px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
              >
                전체보기 →
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">날짜</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">게임</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">결과</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">K/D/A</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">게임시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchesData.map((match) => (
                      <tr key={match.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-700">{match.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{match.game}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            match.result === '승리'
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-red-100 text-red-700 border border-red-300'
                          }`}>
                            {match.result}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{match.kda}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{match.duration}</td>
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
      <section className="py-20 bg-white">
        <div className="w-full px-6">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">최신 정보 글</h2>
                <p className="text-gray-600">게임 정보와 팁을 확인하세요</p>
              </div>
              <Link
                to="/info"
                className="px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
              >
                전체보기 →
              </Link>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">카테고리</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">제목</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">작성자</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">조회수</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoData.map((article) => (
                      <tr key={article.id} className="border-b border-gray-200 hover:bg-white transition-colors duration-200">
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{article.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{article.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{article.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{article.date}</td>
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
