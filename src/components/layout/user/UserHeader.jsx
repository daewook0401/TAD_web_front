import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import logo from "../../../assets/TADHeaderLogo.png";
import ListItem from "../../common/ListItem";
import { AuthContext } from "../../../provider/AuthContext";
import Login from "../../button/Login";
import { GoogleLogin } from "@react-oauth/google";

const UserHeader = () => {
  const { auth, logout } = useContext(AuthContext);
  const navi = useNavigate();
  
  const [subNav, setSubNav ] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clickBoardItem = () => {
    setSubNav(!subNav);
    setIsMobileMenuOpen(false);
    navi("/auth-board");
  };

  const handleMenuClick = (path) => {
    setSubNav(false);
    setIsMobileMenuOpen(false);
    navi(path);
  };
  return (
    <header >
      {/* 상단 헤더 */}
      <div >
        {/* 로고 */}
        <div  onClick={() => navi("/")}>
          <img src={logo} alt="TADlogo"  onClick={() => handleMenuClick("/")}/>
        </div>

        {/* PC 전용 내비게이션 */}
        <nav >
          <ListItem onClick={() => handleMenuClick("/")}>소개</ListItem>
          <ListItem onClick={() => handleMenuClick("/dashboard")}>대시보드</ListItem>
          <ListItem onClick={clickBoardItem}>게시판</ListItem>
          <ListItem onClick={() => handleMenuClick("/notice")}>공지사항</ListItem>
          <ListItem onClick={() => handleMenuClick("/frequencyAskPage")}>문의하기</ListItem>
        </nav>

        {/* 로그인/회원가입 버튼 (PC) */}
        <div >
          {!auth.isAuthenticated ? (
            <>
              <Login/>
            </>
          ) : (
            <>
              {(auth.loginInfo.memberRole === "ROLE_COMMON") ? (
                <button
                  
                  onClick={() => navi("/mypage")}
                >
                  마이페이지
                </button>
              ) : (
                <button
                  
                  onClick={() => navi("/admin")}
                >
                  관리자 페이지
                </button>
              )}
              <button
                
                onClick={logout}
              >
                로그아웃
              </button>
            </>
          )}
        </div>

        {/* 모바일 햄버거 메뉴 */}
        <div >
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg  fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div >
          <ul >
            <li  onClick={() => handleMenuClick("/")}>소개</li>
            <li  onClick={() => handleMenuClick("/dashboard")}>대시보드</li>
            <li  onClick={clickBoardItem}>게시판</li>
            <li  onClick={() => handleMenuClick("/notice")}>공지사항</li>
            <li  onClick={() => handleMenuClick("/frequencyAskPage")}>문의하기</li>
          </ul>
          <div >
            {!auth.isAuthenticated ? (
              <>
                <Login/>
                <button  onClick={() => navi("/signup")}>
                  회원가입
                </button>
              </>
            ) : (
              <>
                {auth.loginInfo.memberRole === "ROLE_COMMON" ? (
                  <button  onClick={() => navi("/mypage")}>
                    마이페이지
                  </button>
                ) : (
                  <button  onClick={() => navi("/admin")}>
                    관리자 페이지
                  </button>
                )}
                <button  onClick={logout}>
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 게시판 서브 메뉴 (PC only) */}
      {subNav && (
        <div >
          <nav >
            <ul >
              <li  onClick={() => navi("/auth-board")}>인증게시판</li>
              <li  onClick={() => navi("/community/free")}>자유게시판</li>
              <li  onClick={() => navi("/community/qna")}>질문 게시판</li>
              <li  onClick={() => navi("/community/tips")}>팁</li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
export default UserHeader;