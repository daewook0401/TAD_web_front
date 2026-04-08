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
    <div >
      {/* Welcome Section */}
      <section >
        <div ></div>
        <div ></div>

        <div >
          <div >
            <div >
              <h1 >
                환영합니다.
              </h1>
              <h2 >
                TAD 사이트입니다
              </h2>
            </div>
            <p >
              당신의 게임 전적을 한곳에서 관리하고, 실시간으로 분석하며, 다른 플레이어들과 소통하세요.
            </p>
            <div >
              <Link
                to="/signup"
                
              >
                시작하기
              </Link>
              <Link
                to="/about"
                
              >
                자세히 알아보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Matches Table */}
      <section >
        <div >
          <div >
            <div >
              <div>
                <h2 >최근 내전 전적</h2>
                <p >최근 경기 기록을 확인하세요</p>
              </div>
              <Link
                to="/matches/my"
                
              >
                전체보기 →
              </Link>
            </div>

            <div >
              <div >
                <table >
                  <thead>
                    <tr >
                      <th >날짜</th>
                      <th >게임</th>
                      <th >결과</th>
                      <th >K/D/A</th>
                      <th >게임시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchesData.map((match) => (
                      <tr key={match.id} >
                        <td >{match.date}</td>
                        <td >{match.game}</td>
                        <td >
                          <span >
                            {match.result}
                          </span>
                        </td>
                        <td >{match.kda}</td>
                        <td >{match.duration}</td>
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
      <section >
        <div >
          <div >
            <div >
              <div>
                <h2 >최신 정보 글</h2>
                <p >게임 정보와 팁을 확인하세요</p>
              </div>
              <Link
                to="/info"
                
              >
                전체보기 →
              </Link>
            </div>

            <div >
              <div >
                <table >
                  <thead>
                    <tr >
                      <th >카테고리</th>
                      <th >제목</th>
                      <th >작성자</th>
                      <th >조회수</th>
                      <th >날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoData.map((article) => (
                      <tr key={article.id} >
                        <td >
                          <span >
                            {article.category}
                          </span>
                        </td>
                        <td >{article.title}</td>
                        <td >{article.author}</td>
                        <td >{article.views.toLocaleString()}</td>
                        <td >{article.date}</td>
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
