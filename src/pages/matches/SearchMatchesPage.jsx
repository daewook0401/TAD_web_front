import React, { useState } from 'react';

const SearchMatchesPage = () => {
  const [searchPlayer, setSearchPlayer] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const playerDatabase = [
    { id: 1, name: 'ProGamer123', totalMatches: 234, winRate: 58, avgKda: '12.4', mainGame: 'League of Legends', tier: 'Diamond' },
    { id: 2, name: 'MapleKing', totalMatches: 189, winRate: 62, avgKda: '14.2', mainGame: 'Mapleland', tier: 'Platinum' },
    { id: 3, name: 'SilverLord', totalMatches: 456, winRate: 51, avgKda: '9.8', mainGame: 'League of Legends', tier: 'Silver' },
    { id: 4, name: 'GoldRush', totalMatches: 312, winRate: 55, avgKda: '11.3', mainGame: 'Both', tier: 'Gold' },
    { id: 5, name: 'NewbiePlayer', totalMatches: 78, winRate: 48, avgKda: '8.2', mainGame: 'League of Legends', tier: 'Bronze' },
  ];

  const handleSearch = () => {
    if (!searchPlayer.trim()) {
      alert('플레이어 이름을 입력해주세요');
      return;
    }
    const result = playerDatabase.find(p => p.name.toLowerCase() === searchPlayer.toLowerCase());
    setSearchResult(result || null);
    setHasSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">전적 확인</h1>
          <p className="text-gray-700 mt-2">다른 플레이어의 전적을 검색해보세요</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">플레이어 검색</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchPlayer}
                onChange={(e) => setSearchPlayer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="플레이어 이름을 입력하세요 (예: ProGamer123)"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                검색
              </button>
            </div>
          </div>

          {/* Suggested Players */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">인기 플레이어 예시</p>
            <div className="flex flex-wrap gap-2">
              {playerDatabase.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    setSearchPlayer(player.name);
                    setSearchResult(player);
                    setHasSearched(true);
                  }}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200 border border-gray-300"
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {searchResult ? (
            <div className="space-y-8">
              {/* Player Profile */}
              <div className="bg-gray-50  rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-2">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-gray-900 text-4xl font-bold mb-4">
                      {searchResult.name.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{searchResult.name}</h2>
                    <p className="text-sm text-gray-700">주 게임: {searchResult.mainGame}</p>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-600 text-sm mb-1">총 경기</p>
                      <p className="text-3xl font-bold text-gray-900">{searchResult.totalMatches}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-600 text-sm mb-1">승률</p>
                      <p className="text-3xl font-bold text-green-400">{searchResult.winRate}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-600 text-sm mb-1">평균 K/D/A</p>
                      <p className="text-3xl font-bold text-blue-600">{searchResult.avgKda}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-600 text-sm mb-1">현재 티어</p>
                      <p className="text-3xl font-bold text-purple-400">{searchResult.tier}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50  rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">게임별 통계</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-700 font-medium">League of Legends</p>
                        <p className="text-sm text-gray-600">155 경기</p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-700 font-medium">Mapleland</p>
                        <p className="text-sm text-gray-600">79 경기</p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50  rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">최근 7일</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">이번 주 경기</p>
                      <p className="text-2xl font-bold text-gray-900">23</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">승리</p>
                      <p className="text-2xl font-bold text-green-400">14</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">패배</p>
                      <p className="text-2xl font-bold text-red-400">9</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <p className="text-gray-700 font-medium">승률</p>
                      <p className="text-2xl font-bold text-blue-600">60.9%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50  rounded-lg shadow-lg p-12 border border-gray-200 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">검색 결과 없음</h3>
              <p className="text-gray-600">"{searchPlayer}"에 해당하는 플레이어를 찾을 수 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchMatchesPage;
