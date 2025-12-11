import { useState } from 'react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'general', label: '일반 문의' },
    { value: 'bug', label: '버그 신고' },
    { value: 'feature', label: '기능 제안' },
    { value: 'account', label: '계정 문의' },
    { value: 'other', label: '기타' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: 실제 API 호출로 대체
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        category: 'general',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 shadow-lg text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold mb-4">문의가 접수되었습니다!</h2>
          <p className="text-gray-700 mb-8">
            빠른 시일 내에 입력하신 이메일로 답변 드리겠습니다.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            다른 문의 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            문의하기
          </h1>
          <p className="text-xl text-gray-700">
            궁금하신 점이나 문제가 있으시면 언제든 문의해주세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center hover:border-blue-600 hover:shadow-md transition-all">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="font-bold text-lg mb-2">이메일</h3>
            <p className="text-gray-600 text-sm">support@tad.com</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center hover:border-blue-600 hover:shadow-md transition-all">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-bold text-lg mb-2">Discord</h3>
            <p className="text-gray-600 text-sm">TAD Official Server</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center hover:border-blue-600 hover:shadow-md transition-all">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="font-bold text-lg mb-2">응답 시간</h3>
            <p className="text-gray-600 text-sm">평균 24시간 이내</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold mb-2">
                문의 유형 *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                제목 *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="문의 제목을 입력해주세요"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                문의 내용 *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="8"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="문의 내용을 상세히 작성해주세요"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? '전송 중...' : '문의 보내기'}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-900 border border-blue-700 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>문의 전 확인해주세요</span>
          </h3>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• FAQ 페이지에서 자주 묻는 질문의 답변을 먼저 확인해보세요.</li>
            <li>• 버그 신고 시에는 발생한 상황을 자세히 설명해주시면 빠른 해결에 도움이 됩니다.</li>
            <li>• 계정 관련 문의는 가입 시 사용한 이메일로 문의해주세요.</li>
            <li>• 평일 09:00-18:00에 문의하시면 더욱 빠른 답변을 받으실 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
