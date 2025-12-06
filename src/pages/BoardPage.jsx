import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const BoardPage = () => {
  const { category } = useParams();
  
  const categories = {
    lol: { name: '롤', icon: '🎮', color: 'blue' },
    maple: { name: '메이플랜드', icon: '🍁', color: 'green' },
    other: { name: '기타', icon: '⭐', color: 'purple' },
  };

  const currentCategory = categories[category] || categories.lol;

  // 더미 데이터
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '최고의 초반 전략 공유합니다',
      author: '게임마스터',
      date: '2025-12-06',
      views: 342,
      replies: 28,
      category: 'lol'
    },
    {
      id: 2,
      title: '신규 업데이트 정보',
      author: '관리자',
      date: '2025-12-05',
      views: 512,
      replies: 45,
      category: 'lol'
    },
    {
      id: 3,
      title: '랭크전 팁 공유',
      author: '프로게이머',
      date: '2025-12-04',
      views: 289,
      replies: 15,
      category: 'lol'
    },
  ]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{currentCategory.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{currentCategory.name}</h1>
              <p className="text-gray-600 mt-2">게임 정보와 팁을 공유하는 게시판입니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            <Link
              to="/info/lol"
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
                category === 'lol'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              🎮 롤
            </Link>
            <Link
              to="/info/maple"
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
                category === 'maple'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-green-600'
              }`}
            >
              🍁 메이플랜드
            </Link>
            <Link
              to="/info/other"
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
                category === 'other'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-purple-600'
              }`}
            >
              ⭐ 기타
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Write Button */}
          <div className="mb-8 flex justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              새 게시물 작성
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">작성된 게시물이 없습니다</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>조회 {post.views}</span>
                        <span>•</span>
                        <span>댓글 {post.replies}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {post.replies > 0 ? post.replies : '0'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              이전
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              다음
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoardPage;
