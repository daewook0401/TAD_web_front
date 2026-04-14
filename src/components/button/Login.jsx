import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate('/login')}>
      로그인
    </button>
  );
};

export default Login;
