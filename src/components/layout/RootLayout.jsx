import { AuthProvider } from '../../provider/AuthContext';

function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default RootLayout;
