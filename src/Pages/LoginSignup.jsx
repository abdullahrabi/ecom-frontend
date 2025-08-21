import React, { useState, useEffect, useContext } from 'react';
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
import CaptchaModal from '../Components/CaptchaModal'; // import modal

// Password Input Component
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
        <img 
          src={passwordVisible ? eye_icon : eye_off_icon} 
          alt="Toggle visibility" 
        />
      </button>
    </div>
  );
};

// Login Form Component
const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { updateToken } = useContext(ShopContext);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setShowCaptcha(true); // Show captcha modal before login request
  };

  const handleCaptchaVerify = async (captchaToken) => {
    try {
      const response = await axios.post(
        'https://dept-store-auth-server.vercel.app/api/auth/login',
        { email, password }
      );

      if (response && response.data && response.data.token) {
        const { token } = response.data;

        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        setPassword('');
        updateToken(token);
        toast.success("Login Successfully");
        navigate('/');
      } else {
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during login. Please try again later.");
      }
    }
  };

  return (
    <>
      <form className="loginsignup-container" onSubmit={handleLoginSubmit} autoComplete="on">
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
        <button className="toggle-button" onClick={onToggle}>
          Don’t have an account? Sign up here
        </button>
        <h3>OR</h3>
        <div className="google-form">
          <img src={google_icon} alt="Google login" />
          <button type="button" className="google-button">Continue with Google</button>
        </div>
      </form>

      {showCaptcha && (
        <CaptchaModal
          onVerify={(token) => handleCaptchaVerify(token)}
          onClose={() => setShowCaptcha(false)}
        />
      )}
    </>
  );
};

// Signup Form Component
const SignupForm = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setShowCaptcha(true); // Show captcha before signup request
  };

  const handleCaptchaVerify = async (captchaToken) => {
    try {
      const response = await axios.post(
        'https://dept-store-auth-server.vercel.app/api/auth/register',
        { name: username, email, password }
      );

      if (response && response.data && response.data.message) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during signup. Please try again later.");
      }
    }
  };

  return (
    <>
      <form className="loginsignup-container" onSubmit={handleSignupSubmit} autoComplete="on">
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
        <button className="toggle-button" onClick={onToggle}>
          Already have an account? Login here
        </button>
        <h3>OR</h3>
        <div className="google-form">
          <img src={google_icon} alt="Google signup" />
          <button type="button" className="google-button">Continue with Google</button>
        </div>
      </form>

      {showCaptcha && (
        <CaptchaModal
          onVerify={(token) => handleCaptchaVerify(token)}
          onClose={() => setShowCaptcha(false)}
        />
      )}
    </>
  );
};

// Main LoginSignup Component
const LoginSignup = () => {
  const [isSwapped, setIsSwapped] = useState(false);

  const handleToggle = () => setIsSwapped(!isSwapped);

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

  useEffect(() => {
    const handleBeforeUnload = () => localStorage.clear();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="loginsignup-page">
      <animated.div className="loginsignup-left" style={leftAnimation}>
        {isSwapped ? <SignupForm onToggle={handleToggle} /> : <LoginForm onToggle={handleToggle} />}
      </animated.div>

      <animated.div className="loginsignup-right" style={rightAnimation}>
        <img src={login_icon} alt="Welcome" />
      </animated.div>
    </div>
  );
};

export default LoginSignup;
