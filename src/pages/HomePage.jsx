import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const summaryCards = [
    { label: '기록된 내전', value: '1,248', description: '팀 단위 경기 데이터' },
    { label: '활성 플레이어', value: '320+', description: '최근 30일 기준' },
    { label: '평균 분석 시간', value: '3초', description: '검색부터 결과까지' },
  ];

  const featureCards = [
    {
      title: '내전 전적 관리',
      description: '승패, KDA, 게임 시간까지 한 화면에서 정리해 팀 흐름을 빠르게 확인합니다.',
    },
    {
      title: '카테고리 커뮤니티',
      description: '롤, 메이플랜드, 자유 게시판을 나눠 정보와 이야기가 섞이지 않게 구성했습니다.',
    },
    {
      title: '랭킹과 검색',
      description: '플레이어별 기록과 팀 랭킹을 이어서 확인할 수 있는 전적 허브를 지향합니다.',
    },
  ];

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
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 px-6 py-24">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-blue-300 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 backdrop-blur-md">
              내전 기록, 커뮤니티, 랭킹을 한 번에
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-gray-900 lg:text-7xl">
                게임 기록을 더 보기 좋게,
                <span className="block text-blue-300">TAD에서 정리하세요.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-gray-600">
                흩어진 내전 기록과 게임 정보를 깔끔한 대시보드로 모았습니다. 지금은 보여주는 힘에 집중한, 가볍고 세련된 게임 허브입니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/matches/search"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3 text-center text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.02]"
              >
                전적 둘러보기
              </Link>
              <Link
                to="/board/lol"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3 text-center text-sm font-bold text-gray-700 transition-colors duration-200 hover:border-blue-300 hover:text-blue-600"
              >
                커뮤니티 보기
              </Link>
            </div>

            <div className="grid max-w-3xl grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-gray-200 bg-white/70 p-5 backdrop-blur-md">
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-gray-900">{card.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white/70 p-5 shadow-xl backdrop-blur-md">
            <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600">Live Preview</p>
                  <h2 className="text-2xl font-black text-gray-900">오늘의 전적 흐름</h2>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
                  Demo
                </span>
              </div>

              <div className="space-y-3">
                {matchesData.slice(0, 3).map((match) => (
                  <div key={match.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{match.game}</p>
                        <p className="text-xs text-gray-500">{match.date} · {match.duration}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        match.result === '승리'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}>
                        {match.result}
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-xs font-semibold text-gray-500">KDA</p>
                      <p className="text-2xl font-black text-blue-300">{match.kda}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {featureCards.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                <div className="mb-5 h-1.5 w-12 rounded-full bg-blue-500" />
                <h3 className="text-xl font-black text-gray-900">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">최근 내전 전적</h2>
                <p className="text-gray-600">승패와 KDA를 한눈에 훑어보세요.</p>
              </div>
              <Link
                to="/matches/my"
                className="px-6 py-2 text-blue-600 font-bold transition-colors duration-200"
              >
                전체보기
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">최신 정보 글</h2>
                <p className="text-gray-600">게임별 업데이트와 팁을 빠르게 확인하세요.</p>
              </div>
              <Link
                to="/info"
                className="px-6 py-2 text-blue-600 font-bold transition-colors duration-200"
              >
                전체보기
              </Link>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
