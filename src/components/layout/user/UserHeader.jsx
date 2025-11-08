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
    <header className="w-full shadow-md bg-white z-50 relative">
      {/* 상단 헤더 */}
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* 로고 */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navi("/")}>
          <img src={logo} alt="TADlogo" className="h-14 w-auto" onClick={() => handleMenuClick("/")}/>
        </div>

        {/* PC 전용 내비게이션 */}
        <nav className="hidden md:flex space-x-4 items-center list-none">
          <ListItem onClick={() => handleMenuClick("/")}>소개</ListItem>
          <ListItem onClick={() => handleMenuClick("/dashboard")}>대시보드</ListItem>
          <ListItem onClick={clickBoardItem}>게시판</ListItem>
          <ListItem onClick={() => handleMenuClick("/notice")}>공지사항</ListItem>
          <ListItem onClick={() => handleMenuClick("/frequencyAskPage")}>문의하기</ListItem>
        </nav>

        {/* 로그인/회원가입 버튼 (PC) */}
        <div className="hidden md:flex items-center space-x-3">
          {!auth.isAuthenticated ? (
            <>
              <Login/>
            </>
          ) : (
            <>
              {(auth.loginInfo.memberRole === "ROLE_COMMON") ? (
                <button
                  className="cursor-pointer px-4 py-2 rounded-lg bg-main text-black"
                  onClick={() => navi("/mypage")}
                >
                  마이페이지
                </button>
              ) : (
                <button
                  className="cursor-pointer px-4 py-2 rounded-lg bg-main text-black"
                  onClick={() => navi("/admin")}
                >
                  관리자 페이지
                </button>
              )}
              <button
                className="cursor-pointer px-4 py-2 rounded-lg bg-sub text-black"
                onClick={logout}
              >
                로그아웃
              </button>
            </>
          )}
        </div>

        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 py-4 bg-white border-t">
          <ul className="space-y-2 list-none">
            <li className="cursor-pointer" onClick={() => handleMenuClick("/")}>소개</li>
            <li className="cursor-pointer" onClick={() => handleMenuClick("/dashboard")}>대시보드</li>
            <li className="cursor-pointer" onClick={clickBoardItem}>게시판</li>
            <li className="cursor-pointer" onClick={() => handleMenuClick("/notice")}>공지사항</li>
            <li className="cursor-pointer" onClick={() => handleMenuClick("/frequencyAskPage")}>문의하기</li>
          </ul>
          <div className="mt-4 border-t pt-4 space-y-2">
            {!auth.isAuthenticated ? (
              <>
                <Login/>
                <button className="w-full px-4 py-2 bg-sub text-black rounded-lg" onClick={() => navi("/signup")}>
                  회원가입
                </button>
              </>
            ) : (
              <>
                {auth.loginInfo.memberRole === "ROLE_COMMON" ? (
                  <button className="w-full px-4 py-2 bg-main text-white rounded-lg" onClick={() => navi("/mypage")}>
                    마이페이지
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 bg-main text-white rounded-lg" onClick={() => navi("/admin")}>
                    관리자 페이지
                  </button>
                )}
                <button className="w-full px-4 py-2 bg-sub text-white rounded-lg" onClick={logout}>
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 게시판 서브 메뉴 (PC only) */}
      {subNav && (
        <div className="w-full border-t border-gray-200 hidden md:block">
          <nav className="flex items-center justify-center px-6 py-2 bg-white">
            <ul className="flex space-x-4 text-gray-600 list-none">
              <li className="cursor-pointer hover:text-green-600" onClick={() => navi("/auth-board")}>인증게시판</li>
              <li className="cursor-pointer hover:text-green-600" onClick={() => navi("/community/free")}>자유게시판</li>
              <li className="cursor-pointer hover:text-green-600" onClick={() => navi("/community/qna")}>질문 게시판</li>
              <li className="cursor-pointer hover:text-green-600" onClick={() => navi("/community/tips")}>팁</li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
export default UserHeader;