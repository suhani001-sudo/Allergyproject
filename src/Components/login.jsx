import React from "react";
import AuthCard from "./AuthCard";

const Login = ({ onLogin, onSignup, onSwitchToSignup }) => {
  return (
    <AuthCard
      initialMode="login"
      onLogin={onLogin}
      onSignup={onSignup}
      onSwitchToSignup={onSwitchToSignup}
    />
  );
};

export default Login;
