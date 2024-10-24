import React, { useState } from 'react';
import './Statements.css'; // Optional: Add custom styling

function Statements() {
  const [statements, setStatements] = useState([
    { date: '2024-01-01', description: 'Payment received', amount: 500 },
    { date: '2024-02-01', description: 'Rent', amount: -1000 },
  ]); // Sample statements

  return (
    <div className="statements">
      <h1>Statements</h1>

      {/* Table displaying statements */}
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {statements.map((statement, index) => (
            <tr key={index}>
              <td>{statement.date}</td>
              <td>{statement.description}</td>
              <td>{statement.amount < 0 ? '-' : ''}${Math.abs(statement.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Statements;