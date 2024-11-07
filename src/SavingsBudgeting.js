import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SavingsBudgeting.css';

function SavingsBudgeting() {
  const navigate = useNavigate();

  return (
    <div className="savings-budgeting-page">
      <button className="back-to-dashboard" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default SavingsBudgeting;
