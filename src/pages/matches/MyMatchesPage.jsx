import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthContext';

const MyMatchesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [filterGame, setFilterGame] = useState('all');

  // 로그인되지 않으면 로그인 페이지로 이동
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const matches = [
    { id: 1, date: '2025-12-06 14:30', game: 'League of Legends', result: '승리', kda: '12/2/8', duration: '35분', champion: 'Ahri', tier: 'Gold' },
    { id: 2, date: '2025-12-06 13:45', game: 'League of Legends', result: '패배', kda: '8/5/6', duration: '28분', champion: 'Lux', tier: 'Silver' },
    { id: 3, date: '2025-12-05 20:15', game: 'Mapleland', result: '승리', kda: '15/1/10', duration: '42분', champion: 'Warrior', tier: 'Platinum' },
    { id: 4, date: '2025-12-05 19:20', game: 'League of Legends', result: '승리', kda: '10/3/9', duration: '31분', champion: 'Evelynn', tier: 'Gold' },
    { id: 5, date: '2025-12-04 18:45', game: 'Mapleland', result: '패배', kda: '7/8/5', duration: '25분', champion: 'Archer', tier: 'Silver' },
    { id: 6, date: '2025-12-04 17:30', game: 'League of Legends', result: '승리', kda: '14/4/7', duration: '36분', champion: 'Syndra', tier: 'Gold' },
  ];

  const filteredMatches = filterGame === 'all' ? matches : matches.filter(m => m.game === filterGame);

  const stats = {
    totalMatches: matches.length,
    wins: matches.filter(m => m.result === '승리').length,
    losses: matches.filter(m => m.result === '패배').length,
    winRate: Math.round((matches.filter(m => m.result === '승리').length / matches.length) * 100),
    avgKda: '10.3',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">내 전적 확인</h1>
              <p className="text-gray-600 mt-2">당신의 게임 경기 기록을 확인하세요</p>
            </div>
            {isAuthenticated && (
              <div className="bg-blue-600 rounded-lg p-4 border border-blue-700">
                <p className="text-sm text-blue-100">사용자</p>
                <p className="text-xl font-bold text-gray-900">{user?.name || '사용자'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">총 경기</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalMatches}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">승리</p>
            <p className="text-3xl font-bold text-green-600">{stats.wins}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">패배</p>
            <p className="text-3xl font-bold text-red-600">{stats.losses}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">승률</p>
            <p className="text-3xl font-bold text-blue-600">{stats.winRate}%</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">평균 K/D/A</p>
            <p className="text-3xl font-bold text-purple-600">{stats.avgKda}</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">게임 필터:</span>
          <button
            onClick={() => setFilterGame('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filterGame === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterGame('League of Legends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filterGame === 'League of Legends'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900'
                : 'bg-gray-50 text-gray-700 border border-gray-300 hover:border-blue-500'
            }`}
          >
            League of Legends
          </button>
          <button
            onClick={() => setFilterGame('Mapleland')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filterGame === 'Mapleland'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900'
                : 'bg-gray-50 text-gray-700 border border-gray-300 hover:border-blue-500'
            }`}
          >
            Mapleland
          </button>
        </div>
      </div>

      {/* Matches Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gray-50  rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">날짜</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">게임</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">결과</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">챔피언/직업</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">K/D/A</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">게임시간</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">티어</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <tr key={match.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-700">{match.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{match.game}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          match.result === '승리'
                            ? 'bg-green-500 text-green-400'
                            : 'bg-red-500 text-red-400'
                        }`}>
                          {match.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{match.champion}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{match.kda}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{match.duration}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 bg-blue-500 text-blue-600 rounded text-xs font-semibold border border-blue-500">
                          {match.tier}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-600">
                      경기 기록이 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMatchesPage;
