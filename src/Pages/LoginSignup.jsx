import React, { useState, useEffect } from 'react';
import './CSS/LoginSignup.css'; // Your custom CSS
import { useSpring, animated } from '@react-spring/web'; // React Spring for animations
import login_icon from '../Components/Assests/Login.jpg';
import google_icon from '../Components/Assests/google.jpg';
import eye_icon from '../Components/Assests/eye_icon.png'; // Your custom eye icon
import eye_off_icon from '../Components/Assests/eye_off_icon.png'; // Your custom eye-off icon
import axios from 'axios';
import { toast } from 'react-toastify';  
import { useNavigate } from 'react-router-dom';

// Password Input Component
const PasswordInput = ({ placeholder, onChange, value, id, name }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="password-input-container" style={{ position: 'relative' }}>
      <input
        type={passwordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        id={id}  // Added id
        name={name}  // Added name
        autoComplete="current-password" // Added autoComplete for password
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
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
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Add a check to ensure response and response.data exist
      if (response && response.data && response.data.token) {
        const { token } = response.data;
  
        // Store the JWT token in localStorage or sessionStorage based on "Remember Me"
        if (rememberMe) {
          localStorage.setItem('token', token); // Store token in localStorage
        } else {
          sessionStorage.setItem('token', token); // Store token in sessionStorage
        }
  
        // Clear password from memory
        setPassword('');
  
        toast.success("Login Successfully");
        navigate('/');  // Redirect to homepage after login
      } else {
        // Handle cases where response does not contain the expected data
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (err) {
      console.error(err); // Log the error for debugging purposes
      // Check if error response exists
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during login. Please try again later.");
      }
    }
  };
  

  return (
    <form className="loginsignup-container" onSubmit={handleLoginSubmit} autoComplete="on">
      <h1>Login</h1>
      <div className="loginsignup-fields">
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          autoComplete="email"  // Enable autofill for email
          id="login-email" // Added id
          name="email" // Added name
        />
        <PasswordInput 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          id="login-password" // Added id
          name="password" // Added name
        />
      </div>
      <div className="loginsignup-remember">
        <input 
          type="checkbox" 
          checked={rememberMe} 
          onChange={(e) => setRememberMe(e.target.checked)} 
          id="remember-me" // Added id
          name="rememberMe" // Added name
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
  );
};

// Signup Form Component
const SignupForm = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name: username, email, password });
      
      // Add a check to ensure response and response.data exist
      if (response && response.data && response.data.message) {
        toast.success(response.data.message);
        navigate('/login');  // Redirect to login page after signup
      } else {
        // Handle cases where response does not contain the expected data
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (err) {
      console.error(err); // Log the error for debugging purposes
      // Check if error response exists
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during signup. Please try again later.");
      }
    }
  };
  

  return (
    <form className="loginsignup-container" onSubmit={handleSignupSubmit} autoComplete="on">
      <h1>Sign Up</h1>
      <div className="loginsignup-fields">
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          autoComplete="email"  // Enable autofill for email
          id="signup-email" // Added id
          name="email" // Added name
        />
        <PasswordInput 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          id="signup-password" // Added id
          name="password" // Added name
        />
        <input 
          type="text" 
          placeholder="Username" 
          required 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          id="signup-username" // Added id
          name="username" // Added name
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
  );
};

// Main LoginSignup Component
const LoginSignup = () => {
  const [isSwapped, setIsSwapped] = useState(false);

  const handleToggle = () => {
    setIsSwapped(!isSwapped);
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

  // Clear localStorage on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear(); // Clears localStorage when the tab is closed
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Cleanup on component unmount
    };
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
