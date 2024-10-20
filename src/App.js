import React, { useState } from 'react';
import './App.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config'; // Firebase config
import logo from './logo.svg'; // You can use a banking-related logo instead of React's

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true); // Set user as logged in
      setErrorMessage('');  // Clear error message on success
    } catch (error) {
      setErrorMessage(error.message); // Display error message if login fails
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {!isLoggedIn ? (
          <div className="login-form">
            <h2>Banking Login</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        ) : (
          <div className="dashboard">
            <h2>Welcome to Your Dashboard</h2>
            <div className="account-info">
              <h3>Account Overview</h3>
              <p>Balance: $5,000.00</p>
              <p>Account Number: 1234-5678-9101-1121</p>
            </div>

            <div className="transactions">
              <h3>Recent Transactions</h3>
              <ul>
                <li>Deposit: $500 on Oct 19, 2024</li>
                <li>Withdrawal: $100 on Oct 18, 2024</li>
                <li>Payment: $150 on Oct 17, 2024</li>
              </ul>
            </div>

            <div className="actions">
              <button>Transfer Funds</button>
              <button>Pay Bills</button>
              <button>View Statements</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
