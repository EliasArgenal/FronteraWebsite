import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Debt.css';

function Debt() {
  const navigate = useNavigate();

  return (
    <div className="debt-page">
      <button className="back-to-dashboard" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default Debt;
