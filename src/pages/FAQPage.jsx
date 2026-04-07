import { useState } from 'react';

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: 'general', name: '일반', icon: '❓' },
    { id: 'account', name: '계정', icon: '👤' },
    { id: 'match', name: '내전/전적', icon: '🎮' },
    { id: 'ranking', name: '랭킹/등급', icon: '🏆' },
    { id: 'technical', name: '기술적 문제', icon: '⚙️' },
  ];

  const faqData = {
    general: [
      {
        question: 'TAD는 무엇인가요?',
        answer: 'TAD(Team Analysis Dashboard)는 롤 내전 전적을 관리하고 분석할 수 있는 플랫폼입니다. 친구들과의 내전 결과를 기록하고, 통계를 확인하며, 실력 향상을 위한 인사이트를 얻을 수 있습니다.',
      },
      {
        question: '서비스는 무료인가요?',
        answer: '네, TAD의 모든 기능은 완전히 무료로 제공됩니다. 회원가입만 하시면 모든 기능을 사용하실 수 있습니다.',
      },
      {
        question: '모바일에서도 사용 가능한가요?',
        answer: '네, TAD는 반응형 웹으로 제작되어 PC, 태블릿, 모바일 등 모든 기기에서 원활하게 사용 가능합니다.',
      },
      {
        question: 'Discord 봇은 어떻게 사용하나요?',
        answer: 'Discord 서버에 TAD 봇을 초대한 후, 명령어를 통해 전적 조회, 랭킹 확인 등의 기능을 사용할 수 있습니다. 자세한 사용법은 봇 초대 후 /help 명령어를 입력해주세요.',
      },
    ],
    account: [
      {
        question: '회원가입은 어떻게 하나요?',
        answer: '화면 우측 상단의 "회원가입" 버튼을 클릭하고, 이름, 이메일, 비밀번호를 입력하시면 바로 가입이 완료됩니다.',
      },
      {
        question: '비밀번호를 잊어버렸어요.',
        answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면 가입하신 이메일로 비밀번호 재설정 링크가 전송됩니다.',
      },
      {
        question: '계정 정보를 수정하고 싶어요.',
        answer: '로그인 후 마이페이지에서 이름, 롤 닉네임 등의 정보를 수정할 수 있습니다.',
      },
      {
        question: '회원 탈퇴는 어떻게 하나요?',
        answer: '마이페이지 하단의 "회원 탈퇴" 버튼을 통해 탈퇴하실 수 있습니다. 탈퇴 시 모든 기록이 삭제되며 복구가 불가능합니다.',
      },
    ],
    match: [
      {
        question: '내전 결과는 어떻게 기록하나요?',
        answer: '"내 전적" 메뉴에서 "전적 추가" 버튼을 클릭하고, 게임 결과(승/패), 챔피언, KDA 등의 정보를 입력하시면 됩니다.',
      },
      {
        question: '잘못 입력한 전적을 수정/삭제할 수 있나요?',
        answer: '네, "내 전적" 페이지에서 각 기록의 수정/삭제 버튼을 통해 관리할 수 있습니다.',
      },
      {
        question: '다른 사람의 전적은 어떻게 확인하나요?',
        answer: '"전적 검색" 메뉴에서 닉네임 또는 이메일로 검색하시면 해당 유저의 전적을 확인할 수 있습니다.',
      },
      {
        question: '통계는 어떻게 계산되나요?',
        answer: '승률, 평균 KDA, 가장 많이 플레이한 챔피언 등이 자동으로 계산됩니다. 모든 통계는 실시간으로 업데이트됩니다.',
      },
    ],
    ranking: [
      {
        question: '유저 등급은 어떻게 결정되나요?',
        answer: '승률, KDA, 플레이 횟수 등을 종합적으로 고려하여 S, A, B, C, D 등급으로 분류됩니다. 등급은 매일 자정에 업데이트됩니다.',
      },
      {
        question: '랭킹은 어떤 기준으로 정해지나요?',
        answer: '레이팅 점수를 기준으로 순위가 결정됩니다. 레이팅은 승패 결과와 상대 팀의 평균 실력을 고려하여 계산됩니다.',
      },
      {
        question: 'S등급이 되려면 어떻게 해야 하나요?',
        answer: '높은 승률(70% 이상)을 유지하고, 좋은 KDA(3.0 이상)를 기록하며, 꾸준히 게임에 참여하시면 S등급에 도달할 수 있습니다.',
      },
      {
        question: '등급이 떨어질 수도 있나요?',
        answer: '네, 최근 전적이 좋지 않으면 등급이 하락할 수 있습니다. 하지만 다시 좋은 성적을 거두면 등급이 올라갑니다.',
      },
    ],
    technical: [
      {
        question: '로그인이 안 돼요.',
        answer: '이메일과 비밀번호를 다시 확인해주세요. 문제가 지속되면 브라우저 캐시를 삭제하거나 다른 브라우저를 사용해보세요.',
      },
      {
        question: '페이지가 로딩되지 않아요.',
        answer: '인터넷 연결을 확인하고, 페이지를 새로고침(F5) 해보세요. 문제가 계속되면 문의 페이지를 통해 알려주세요.',
      },
      {
        question: '어떤 브라우저를 사용해야 하나요?',
        answer: 'Chrome, Firefox, Safari, Edge 등 최신 버전의 모든 주요 브라우저에서 사용 가능합니다.',
      },
      {
        question: '데이터가 사라졌어요.',
        answer: '로그아웃되었을 수 있습니다. 다시 로그인해주세요. 그래도 해결되지 않으면 즉시 문의해주세요.',
      },
    ],
  };

  const toggleItem = (category, index) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-300">
            자주 묻는 질문 (FAQ)
          </h1>
          <p className="text-xl text-gray-700">
            궁금하신 내용을 찾아보세요
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-blue-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData[activeCategory].map((item, index) => {
            const itemKey = `${activeCategory}-${index}`;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(activeCategory, index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-lg pr-4">{item.question}</span>
                  <span className={`text-2xl transition-transform ${openItems[itemKey] ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openItems[itemKey] && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">찾으시는 답변이 없나요?</h2>
          <p className="text-gray-700 mb-6">
            문의 페이지를 통해 직접 질문해주시면 빠르게 답변 드리겠습니다.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            문의하기
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
