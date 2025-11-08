import { useState } from 'react'
import './App.css'
import UserLayout from './components/layout/user/UserLayout'
import { AuthProvider } from './provider/AuthContext'
import MainPage from './pages/UserInterface/Main/MainPage'
import { Route, Routes } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  const [count, setCount] = useState(0)

  return (
    <GoogleOAuthProvider clientId="617855234940-dp6iq2v93alink0ttpmgadohvbhj0fo5.apps.googleusercontent.com">
    <AuthProvider>
      <Routes>
        <Route element={<UserLayout/>}>
          <Route path="/" element={<MainPage />} />
        </Route>
      </Routes>
    </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
