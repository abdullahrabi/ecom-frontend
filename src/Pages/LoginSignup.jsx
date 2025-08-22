import React, { useState, useContext } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import CaptchaModal from '../Components/CaptchaModel/CaptchaModel.jsx';
import login_icon from '../Components/Assests/Login.jpg';
import google_icon from '../Components/Assests/google.jpg';
import eye_icon from '../Components/Assests/eye_icon.png';
import eye_off_icon from '../Components/Assests/eye_off_icon.png';

const PasswordInput = ({ placeholder, onChange, value, id, name }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-input-container" style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        id={id}
        name={name}
      />
      <button type="button" onClick={() => setVisible(!visible)} className="eye-icon-button">
        <img src={visible ? eye_icon : eye_off_icon} alt="Toggle visibility" />
      </button>
    </div>
  );
};

// LoginForm
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
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <PasswordInput placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <div className="loginsignup-remember">
        <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
        <label>Remember me</label>
      </div>
      <button type="submit" className="login-button">Login</button>
      <button type="button" className="toggle-button" onClick={onToggle}>Sign Up</button>
    </form>
  );
};

// SignupForm
const SignupForm = ({ onToggle, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit("signup", { email, password, username });
  };

  return (
    <form className="loginsignup-container" onSubmit={handleSubmit} autoComplete="on">
      <h1>Sign Up</h1>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <PasswordInput placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <button type="submit" className="login-button">Sign Up</button>
      <button type="button" className="toggle-button" onClick={onToggle}>Login</button>
    </form>
  );
};

// Main Component
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
          updateToken(res.data.token, rememberMe);
          toast.success("Login Successful");
          navigate('/');
        }
      } else if (pendingAction.type === "signup") {
        const { email, password, username } = pendingAction.data;
        const res = await axios.post(
          'https://dept-store-auth-server.vercel.app/api/auth/register',
          { name: username, email, password }
        );
        if (res.data?.message) {
          toast.success(res.data.message);
          setIsSwapped(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setPendingAction(null);
      setShowCaptcha(false);
    }
  };

  const leftAnimation = useSpring({ transform: isSwapped ? 'translateX(100%)' : 'translateX(0%)', opacity: isSwapped ? 0.8 : 1 });
  const rightAnimation = useSpring({ transform: isSwapped ? 'translateX(-100%)' : 'translateX(0%)', opacity: isSwapped ? 0.8 : 1 });

  return (
    <div className="loginsignup-page">
      <animated.div className="loginsignup-left" style={leftAnimation}>
        {isSwapped ? <SignupForm onToggle={handleToggle} onSubmit={handleFormSubmit} /> : <LoginForm onToggle={handleToggle} onSubmit={handleFormSubmit} />}
      </animated.div>
      <animated.div className="loginsignup-right" style={rightAnimation}>
        <img src={login_icon} alt="Welcome" />
      </animated.div>
      {showCaptcha && <CaptchaModal onVerify={handleCaptchaVerify} onClose={() => setShowCaptcha(false)} />}
    </div>
  );
};

export default LoginSignup;
