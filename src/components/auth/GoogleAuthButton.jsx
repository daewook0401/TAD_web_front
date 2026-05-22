import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DEFAULT_BUTTON_WIDTH = 360;

const GoogleAuthButton = ({ text = 'continue_with', onCredential, onError }) => {
  const wrapperRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(DEFAULT_BUTTON_WIDTH);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const syncWidth = () => {
      const width = Math.floor(wrapper.getBoundingClientRect().width);
      if (width > 0) {
        setButtonWidth(width);
      }
    };

    syncWidth();

    const resizeObserver = new ResizeObserver(syncWidth);
    resizeObserver.observe(wrapper);

    return () => resizeObserver.disconnect();
  }, []);

  if (!googleClientId) {
    return (
      <button type="button" className="google-btn" disabled>
        <span className="google-btn__text">Google 로그인 설정 필요</span>
      </button>
    );
  }

  return (
    <div className="google-login-wrapper" ref={wrapperRef}>
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
        logo_alignment="left"
        locale="ko"
        width={buttonWidth}
      />
    </div>
  );
};

export default GoogleAuthButton;
