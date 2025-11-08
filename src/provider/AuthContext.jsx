import { useState, useEffect, createContext, Children } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const AuthContext = createContext();
const GOOGLE_CLIENT = window.ENV?.GOOGLE_CLIENT;
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token_UUID : {}
  });
  const isAuthenticated = Object.keys(auth.token_UUID).length > 0;
  
  const login = (token_UUID) => {
    setAuth({
      token_UUID
    });
    sessionStorage.setItem("token_UUID", JSON.stringify(token_UUID));
  };

  const logout = () => {
    setAuth({
      token_UUID: {}
    });
    sessionStorage.removeItem("token_UUID");
    navigate("/");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
      <AuthContext.Provider value={{ auth, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  )
}