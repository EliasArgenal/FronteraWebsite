import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Debt.css'; // Optional: Use for custom styling if needed

function Debt() {
  const navigate = useNavigate();

  return (
    <div className="debt">
      <button className="back-to-dashboard" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default Debt;
