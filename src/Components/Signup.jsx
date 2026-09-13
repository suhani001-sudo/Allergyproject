import React from "react";
import AuthCard from "./AuthCard";

const Signup = ({ onSignup, onLogin, onSwitchToLogin }) => {
  return (
    <AuthCard
      initialMode="signup"
      onSignup={onSignup}
      onLogin={onLogin}
      onSwitchToLogin={onSwitchToLogin}
    />
  );
};

export default Signup;
