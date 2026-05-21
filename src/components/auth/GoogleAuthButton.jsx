import { GoogleLogin } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthButton = ({ text = 'continue_with', onCredential, onError }) => {
  if (!googleClientId) {
    return (
      <button type="button" className="google-btn" disabled>
        <span className="google-btn__text">Google 로그인 설정 필요</span>
      </button>
    );
  }

  return (
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onCredential(credentialResponse.credential);
            return;
          }
          onError?.();
        }}
        onError={() => onError?.()}
        text={text}
        theme="outline"
        size="large"
        shape="rectangular"
        locale="ko"
        width="100%"
      />
    </div>
  );
};

export default GoogleAuthButton;
