import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../provider/AuthContext';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function RootLayout({ children }) {
  const content = (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

  if (!googleClientId) {
    return content;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  );
}

export default RootLayout;
