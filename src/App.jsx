import React, { useState } from "react";
import SplashScreen from "./Components/Splashscreen";
import './App.css';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <div className="main-content">
          {/* Your actual app content starts here */}
          <h2>Welcome to the Menu Tagging System!</h2>
        </div>
      )}
    </>
  );
};

export default App;
