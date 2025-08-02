import React, { useEffect } from "react";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo-container">
          <img src="/images/whilogo.png" className="logo" alt="Logo" />
          <div className="loader"></div>
        </div>
        <h1>we care what’s on your plate.</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
