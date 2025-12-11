import React, { useState } from 'react';

const UserRankingPage = () => {
  const [filterRank, setFilterRank] = useState('all');

  const users = [
    { rank: 1, name: '김태희', rolNickname: 'Faker', tier: 'S', rating: 2950, wins: 234, losses: 89, winRate: 72 },
    { rank: 2, name: '이상혁', rolNickname: 'Khan', tier: 'S', rating: 2880, wins: 198, losses: 76, winRate: 72 },
    { rank: 3, name: '박상호', rolNickname: 'ShowMaker', tier: 'S', rating: 2820, wins: 187, losses: 82, winRate: 70 },
    { rank: 4, name: '정지훈', rolNickname: 'Canyon', tier: 'A+', rating: 2750, wins: 176, losses: 89, winRate: 66 },
    { rank: 5, name: '조석민', rolNickname: 'Gumayusi', tier: 'A+', rating: 2680, wins: 164, losses: 95, winRate: 63 },
    { rank: 6, name: '강나', rolNickname: 'Keria', tier: 'A', rating: 2610, wins: 152, losses: 108, winRate: 59 },
    { rank: 7, name: '이준호', rolNickname: 'Viper', tier: 'A', rating: 2540, wins: 189, losses: 124, winRate: 60 },
    { rank: 8, name: '이형석', rolNickname: 'Deft', tier: 'A', rating: 2470, wins: 176, losses: 132, winRate: 57 },
    { rank: 9, name: '박준영', rolNickname: 'Peanut', tier: 'B+', rating: 2400, wins: 145, losses: 156, winRate: 48 },
    { rank: 10, name: '최지훈', rolNickname: 'Impact', tier: 'B+', rating: 2330, wins: 132, losses: 178, winRate: 43 },
    { rank: 11, name: '오충완', rolNickname: 'Flame', tier: 'B', rating: 2260, wins: 118, losses: 195, winRate: 38 },
    { rank: 12, name: '정민준', rolNickname: 'Ssumday', tier: 'B', rating: 2190, wins: 105, losses: 210, winRate: 33 },
  ];

  const filteredUsers = filterRank === 'all' ? users : users.filter(u => u.tier === filterRank);

  const getTierColor = (tier) => {
    const tierColors = {
      'S': 'text-red-600 bg-red-100',
      'A+': 'text-orange-600 bg-orange-100',
      'A': 'text-yellow-600 bg-yellow-100',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-purple-600 bg-purple-100',
      'C': 'text-gray-600 bg-gray-100',
      'D': 'text-gray-600 bg-gray-50',
    };
    return tierColors[tier] || 'text-gray-600 bg-gray-100';
  };

  const getTierBgGradient = (tier) => {
    const gradients = {
      'S': 'from-red-400 to-red-600',
      'A+': 'from-orange-400 to-orange-600',
      'A': 'from-yellow-400 to-yellow-600',
      'B+': 'from-blue-600 to-blue-600',
      'B': 'from-purple-400 to-purple-600',
      'C': 'from-gray-400 to-gray-600',
      'D': 'from-gray-300 to-gray-500',
    };
    return gradients[tier] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">유저 등급</h1>
          <p className="text-gray-700 mt-2">플레이어들의 등급을 확인하세요</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">등급 필터:</span>
          <button
            onClick={() => setFilterRank('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filterRank === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
            }`}
          >
            전체
          </button>
          {['S', 'A+', 'A', 'B+', 'B', 'C', 'D'].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterRank(tier)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filterRank === tier
                  ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white`
                  : `bg-white text-gray-700 border border-gray-300 hover:border-blue-600`
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">상위 유저</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredUsers.slice(0, 3).map((user, idx) => (
              <div
                key={user.rank}
                className={`relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
                  idx === 0 ? 'md:col-span-1 md:row-span-2' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${getTierBgGradient(user.tier)} p-8 rounded-lg shadow-xl text-center text-white border-2 border-white/30`}>
                  <div className="text-6xl font-bold mb-4">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                  <h3 className="text-2xl font-bold mb-1 text-white">{user.name}</h3>
                  <p className="text-lg mb-3 text-white/90">{user.rolNickname}</p>
                  <div className="space-y-2 text-white/90">
                    <p className="text-sm font-medium">평점 {user.rating}</p>
                    <p className="text-sm font-medium">승률 {user.winRate}%</p>
                    <p className="text-sm font-bold text-white">{user.tier} 등급</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Rankings Table */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">순위</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">사용자명</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">롤 닉네임</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">등급</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">평점</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">경기</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">승률</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.rank}
                    className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    {/* 순위 */}
                    <td className="px-6 py-4 text-sm font-semibold">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold border border-blue-300">
                          {user.rank}
                        </span>
                      </div>
                    </td>

                    {/* 사용자명 */}
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      <div className="flex items-center">{user.name}</div>
                    </td>

                    {/* 롤 닉네임 */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center">{user.rolNickname}</div>
                    </td>

                    {/* 등급 */}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center">
                        <span
                          className={`inline-block px-3 py-1 rounded font-bold text-xs ${getTierColor(
                            user.tier,
                          )}`}
                        >
                          {user.tier}
                        </span>
                      </div>
                    </td>

                    {/* 평점 */}
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      <div className="flex justify-center">{user.rating}</div>
                    </td>

                    {/* 경기 */}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center gap-1 font-semibold">
                        <span className="text-green-600">{user.wins}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-red-600">{user.losses}</span>
                      </div>
                    </td>

                    {/* 승률 */}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${user.winRate}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900">{user.winRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* Tier Distribution */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gray-50  rounded-lg shadow p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">등급 분포</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {['S', 'A+', 'A', 'B+', 'B', 'C', 'D'].map((tier) => {
              const count = users.filter(u => u.tier === tier).length;
              return (
                <div key={tier} className={`rounded-lg p-4 text-center ${getTierColor(tier)}`}>
                  <p className="font-bold text-lg mb-1">{tier}</p>
                  <p className="font-bold text-2xl">{count}</p>
                  <p className="text-xs opacity-75 mt-1">유저</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRankingPage;
