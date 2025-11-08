import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthContext";

const Login = () => {
  const { login, logout } = useContext(AuthContext);
  const API_URL = window.ENV?.API_URL;
  const navigate = useNavigate();
  // 💡 [해결] setMsg를 선언합니다.
  const [msg, setMsg] = useState("");
  const handleGoogleSuccess = (credentialResponse) => {
    axios.post(`${API_URL}auth/google-login`, {
      token: credentialResponse.credential,
    })
    .then((response) => {
      if (response.status === 200) {
        login(credentialResponse.credential);
        navigate("/");
      }
    })
    .catch((err) => {
      console.error(err);
      setMsg("구글 로그인 실패");
    });
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setMsg("구글 로그인 실패")}
      />
    </>
  );
};

export default Login;