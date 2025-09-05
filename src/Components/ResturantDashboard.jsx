import React from "react";

function ResturantDashboard({ onLogout }) {
  return (
    <div>
      <h1>Welcome Restaurant Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default ResturantDashboard;
