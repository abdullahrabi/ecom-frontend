import React, { useEffect } from "react";
import Turnstile from "react-turnstile";
import './CaptchaModel';

const CaptchaModal = ({ onVerify, onClose }) => {
  // disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="captcha-modal-overlay" onClick={onClose}>
      <div
        className="captcha-modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside captcha
      >
        <button className="captcha-close-btn" onClick={onClose}>
          ✖
        </button>
        <Turnstile
          sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
          onVerify={(token) => {
            onVerify(token);
            onClose(); // close modal after success
          }}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default CaptchaModal;
