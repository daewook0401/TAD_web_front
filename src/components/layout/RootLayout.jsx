import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../provider/AuthContext';

function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId="617855234940-dp6iq2v93alink0ttpmgadohvbhj0fo5.apps.googleusercontent.com">
      <AuthProvider>
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default RootLayout;
