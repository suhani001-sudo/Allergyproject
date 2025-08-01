import React, { useEffect } from "react";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Splash screen lasts 3 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1>Food Allergy Awareness</h1>
        <p>Empowering Safe Food Choices</p>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
