// context/CaptchaContext.js
import React, { createContext, useState, useEffect } from "react";

export const CaptchaContext = createContext();

const CaptchaProvider = ({ children }) => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    if (showCaptcha && !document.querySelector("#turnstile-script")) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.id = "turnstile-script";
      document.body.appendChild(script);
    }

    if (showCaptcha) {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);

          window.turnstile.render("#captcha-container", {
            sitekey: process.env.REACT_APP_TURNSTILE_SITE_KEY, // use env variable
            callback: function () {
              setCaptchaVerified(true);
              setShowCaptcha(false);
            },
          });
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [showCaptcha]);

  return (
    <CaptchaContext.Provider
      value={{ showCaptcha, setShowCaptcha, captchaVerified, setCaptchaVerified }}
    >
      {children}

      {/* Only render container when captcha is enabled */}
      {showCaptcha && (
        <div
          id="captcha-container"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          }}
        ></div>
      )}
    </CaptchaContext.Provider>
  );
};

export default CaptchaProvider;
