import React from 'react';
import { Link, useParams } from 'react-router-dom';

const BoardPage = ({ type = 'board' }) => {
  const { category } = useParams();
  const pageConfig = {
    board: {
      title: '커뮤니티 보드',
      titleSuffix: '게시판',
      description: '게임별 이야기를 분리해서 보고, 필요한 글만 빠르게 확인하세요.',
      linkPrefix: '/board',
      writeButtonLabel: '새 게시물 작성',
      eyebrow: 'Community',
    },
    info: {
      title: '게임 인사이트',
      titleSuffix: '정보글',
      description: '패치, 공략, 추천 루트처럼 다시 찾아볼 만한 정보를 모아둡니다.',
      linkPrefix: '/info',
      writeButtonLabel: '새 정보글 작성',
      eyebrow: 'Game Intel',
    },
  }[type];

  const categories = {
    lol: { name: '롤', icon: 'LOL', color: 'blue', summary: '메타, 챔피언, 내전 전략' },
    maple: { name: '메이플랜드', icon: 'ML', color: 'green', summary: '사냥터, 보스, 육성 루트' },
    free: { name: '자유', icon: 'FR', color: 'purple', summary: '잡담, 모집, 자유 주제' },
  };

  const colorClasses = {
    blue: {
      active: 'border-blue-300 text-blue-600 bg-blue-100',
      muted: 'text-blue-600 bg-blue-100 border-blue-300',
    },
    green: {
      active: 'border-green-300 text-green-600 bg-green-100',
      muted: 'text-green-600 bg-green-100 border-green-300',
    },
    purple: {
      active: 'border-purple-300 text-purple-600 bg-purple-100',
      muted: 'text-purple-600 bg-purple-100 border-purple-300',
    },
  };

  const activeCategory = category && categories[category] ? category : 'lol';
  const currentCategory = categories[activeCategory];

  const posts = [
    {
      id: 1,
      title: type === 'info' ? '롤 패치 핵심 변경점 정리' : '최고의 초반 전략 공유합니다',
      author: '게임마스터',
      date: '2025-12-06',
      views: 342,
      replies: 28,
      category: 'lol',
      tag: type === 'info' ? '패치노트' : '전략',
    },
    {
      id: 2,
      title: type === 'info' ? '메이플랜드 사냥터 추천 루트' : '메이플랜드 파티 구해요',
      author: '관리자',
      date: '2025-12-05',
      views: 512,
      replies: 45,
      category: 'maple',
      tag: type === 'info' ? '가이드' : '모집',
    },
    {
      id: 3,
      title: type === 'info' ? '자유롭게 공유하는 게임 팁 모음' : '오늘 저녁 내전 멤버 모집',
      author: '프로게이머',
      date: '2025-12-04',
      views: 289,
      replies: 15,
      category: 'free',
      tag: type === 'info' ? '팁' : '자유',
    },
  ];
  const filteredPosts = posts.filter((post) => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-600">{pageConfig.eyebrow}</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 lg:text-6xl">
                {pageConfig.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">{pageConfig.description}</p>
            </div>
            <button className="w-fit rounded-xl border border-blue-300 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-sm transition-transform duration-200 hover:scale-[1.02]">
              {pageConfig.writeButtonLabel}
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(categories).map(([categoryKey, categoryItem]) => (
              <Link
                key={categoryKey}
                to={`${pageConfig.linkPrefix}/${categoryKey}`}
                className={`rounded-3xl border p-5 transition-all duration-200 ${
                  activeCategory === categoryKey
                    ? colorClasses[categoryItem.color].active
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black tracking-[0.22em]">{categoryItem.icon}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${colorClasses[categoryItem.color].muted}`}>
                    {categoryItem.name}
                  </span>
                </div>
                <p className="mt-4 text-xl font-black text-gray-900">{categoryItem.name} {pageConfig.titleSuffix}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{categoryItem.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">{currentCategory.name}</p>
              <h2 className="text-2xl font-black text-gray-900">{currentCategory.name} {pageConfig.titleSuffix}</h2>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${colorClasses[currentCategory.color].muted}`}>
              {filteredPosts.length} posts
            </span>
          </div>

          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 py-16 text-center text-gray-600">
                작성된 게시물이 없습니다
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all duration-200 hover:border-blue-300"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${colorClasses[currentCategory.color].muted}`}>
                          {post.tag}
                        </span>
                        <span className="text-xs font-medium text-gray-500">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900">{post.title}</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {post.author} · 조회 {post.views.toLocaleString()} · 댓글 {post.replies}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">읽기</span>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-10 flex justify-center gap-2">
            {['이전', '1', '2', '3', '다음'].map((label) => (
              <button
                key={label}
                className={`rounded-xl border px-4 py-2 text-sm font-bold ${
                  label === '1'
                    ? 'border-blue-300 bg-blue-100 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoardPage;
