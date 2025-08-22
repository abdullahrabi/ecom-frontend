import React, { useState, useContext } from 'react';
import './CSS/LoginSignup.css';
import { useSpring, animated } from '@react-spring/web';
import login_icon from '../Components/Assests/Login.jpg';
import google_icon from '../Components/Assests/google.jpg';
import eye_icon from '../Components/Assests/eye_icon.png';
import eye_off_icon from '../Components/Assests/eye_off_icon.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import CaptchaModal from '../Components/CaptchaModel/CaptchaModel.jsx';

// -------- Password Input --------
const PasswordInput = ({ placeholder, onChange, value, id, name }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="password-input-container" style={{ position: 'relative' }}>
      <input
        type={passwordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setPasswordVisible(!passwordVisible)}
        className="eye-icon-button"
      >
        <img src={passwordVisible ? eye_icon : eye_off_icon} alt="Toggle visibility" />
      </button>
    </div>
  );
};

// -------- Login Form --------
const LoginForm = ({ onToggle, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit("login", { email, password, rememberMe });
  };

  return (
    <form className="loginsignup-container" onSubmit={handleSubmit} autoComplete="on">
      <h1>Login</h1>
      <div className="loginsignup-fields">
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          autoComplete="email"
          id="login-email"
          name="email"
        />
        <PasswordInput 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          id="login-password"
          name="password"
        />
      </div>
      <div className="loginsignup-remember">
        <input 
          type="checkbox" 
          checked={rememberMe} 
          onChange={(e) => setRememberMe(e.target.checked)} 
          id="remember-me"
          name="rememberMe"
        />
        <label htmlFor="remember-me">Remember me</label>
        <a href="#">Forgot your password?</a>
      </div>
      <button type="submit" className="login-button">Login</button>
      <button type="button" className="toggle-button" onClick={onToggle}>
        Don’t have an account? Sign up here
      </button>
      <h3>OR</h3>
      <div className="google-form">
        <img src={google_icon} alt="Google login" />
        <button type="button" className="google-button">Continue with Google</button>
      </div>
    </form>
  );
};

// -------- Signup Form --------
const SignupForm = ({ onToggle, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit("signup", { email, password, username });
  };

  return (
    <form className="loginsignup-container" onSubmit={handleSubmit} autoComplete="on">
      <h1>Sign Up</h1>
      <div className="loginsignup-fields">
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          autoComplete="email"
          id="signup-email"
          name="email"
        />
        <PasswordInput 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          id="signup-password"
          name="password"
        />
        <input 
          type="text" 
          placeholder="Username" 
          required 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          id="signup-username"
          name="username"
        />
      </div>
      <button type="submit" className="login-button">Sign Up</button>
      <button type="button" className="toggle-button" onClick={onToggle}>
        Already have an account? Login here
      </button>
      <h3>OR</h3>
      <div className="google-form">
        <img src={google_icon} alt="Google signup" />
        <button type="button" className="google-button">Continue with Google</button>
      </div>
    </form>
  );
};

// -------- Main LoginSignup --------
const LoginSignup = () => {
  const [isSwapped, setIsSwapped] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { updateToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleToggle = () => setIsSwapped(!isSwapped);

  const handleFormSubmit = (type, data) => {
    setPendingAction({ type, data });
    setShowCaptcha(true);
  };

  const handleCaptchaVerify = async (captchaToken) => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "login") {
        const { email, password, rememberMe } = pendingAction.data;
        const res = await axios.post(
          'https://dept-store-auth-server.vercel.app/api/auth/login',
          { email, password }
        );

        if (res.data?.token) {
          // Store token properly
          updateToken(res.data.token, rememberMe);
          toast.success("Login Successfully");
          navigate('/'); // navigate after login
        }
      } else if (pendingAction.type === "signup") {
        const { email, password, username } = pendingAction.data;
        const res = await axios.post(
          'https://dept-store-auth-server.vercel.app/api/auth/register',
          { name: username, email, password }
        );

        if (res.data?.message) {
          toast.success(res.data.message);
          navigate('/login');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setPendingAction(null);
      setShowCaptcha(false);
    }
  };

  const leftAnimation = useSpring({
    transform: isSwapped ? 'translateX(100%)' : 'translateX(0%)',
    opacity: isSwapped ? 0.8 : 1,
    config: { tension: 1000, friction: 60 },
  });

  const rightAnimation = useSpring({
    transform: isSwapped ? 'translateX(-100%)' : 'translateX(0%)',
    opacity: isSwapped ? 0.8 : 1,
    config: { tension: 1000, friction: 60 },
  });

  return (
    <div className="loginsignup-page">
      <animated.div className="loginsignup-left" style={leftAnimation}>
        {isSwapped ? (
          <SignupForm onToggle={handleToggle} onSubmit={handleFormSubmit} />
        ) : (
          <LoginForm onToggle={handleToggle} onSubmit={handleFormSubmit} />
        )}
      </animated.div>

      <animated.div className="loginsignup-right" style={rightAnimation}>
        <img src={login_icon} alt="Welcome" />
      </animated.div>

      {showCaptcha && (
        <CaptchaModal
          onVerify={handleCaptchaVerify}
          onClose={() => setShowCaptcha(false)}
        />
      )}
    </div>
  );
};

export default LoginSignup;
