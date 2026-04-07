import React from 'react';
import { Link } from 'react-router-dom';

const InfoPage = () => {
  const categories = [
    {
      id: 'lol',
      name: '롤',
      code: 'LOL',
      description: '패치 노트, 메타 분석, 챔피언 공략을 빠르게 훑어보세요.',
      postCount: 245,
      accent: 'bg-blue-100 text-blue-600 border-blue-300',
    },
    {
      id: 'maple',
      name: '메이플랜드',
      code: 'ML',
      description: '사냥터, 직업별 성장 루트, 보스 준비 정보를 정리합니다.',
      postCount: 128,
      accent: 'bg-green-100 text-green-600 border-green-300',
    },
    {
      id: 'free',
      name: '자유',
      code: 'FR',
      description: '게임 전반에 대한 팁과 커뮤니티성 정보를 자유롭게 모읍니다.',
      postCount: 89,
      accent: 'bg-purple-100 text-purple-600 border-purple-300',
    },
  ];

  const features = [
    { title: '읽기 쉬운 정보', description: '게시판과 분리해 다시 찾아볼 만한 글만 모으는 구조입니다.' },
    { title: '게임별 분류', description: '롤, 메이플랜드, 자유 카테고리를 독립적으로 탐색할 수 있습니다.' },
    { title: '가벼운 커뮤니티', description: '복잡한 기능보다 빠른 진입과 깔끔한 목록 경험에 집중했습니다.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-600">Game Intel</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-gray-900 lg:text-6xl">정보 허브</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            게임별로 흩어진 공략과 업데이트를 한곳에 모아, 필요한 정보만 빠르게 확인할 수 있게 구성했습니다.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/info/${category.id}`}
              className="group rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm transition-all duration-200 hover:border-blue-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black tracking-[0.24em] text-gray-500">{category.code}</span>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${category.accent}`}>
                  {category.postCount} posts
                </span>
              </div>
              <h3 className="mt-8 text-3xl font-black text-gray-900">{category.name}</h3>
              <p className="mt-4 min-h-20 leading-7 text-gray-600">{category.description}</p>
              <div className="mt-6 text-sm font-bold text-blue-600">
                정보글 보기
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-bold text-blue-600">Structure</p>
            <h2 className="mt-2 text-3xl font-black text-gray-900">정보글의 기준</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <div className="mb-5 h-1.5 w-12 rounded-full bg-blue-500" />
                <h3 className="text-xl font-black text-gray-900">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoPage;
