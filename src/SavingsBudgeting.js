import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SavingsBudgeting.css'; // Optional: Use for custom styling if needed

function SavingsBudgeting() {
  const navigate = useNavigate();

  return (
    <div className="savings-budgeting">
      <button className="back-to-dashboard" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default SavingsBudgeting;
