import React, { useEffect } from "react";
import Turnstile from "react-turnstile";
import './CaptchaModel';

const CaptchaModal = ({ onVerify, onClose }) => {
  // disable scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="captcha-modal-overlay">
      <div className="captcha-modal-content">
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
