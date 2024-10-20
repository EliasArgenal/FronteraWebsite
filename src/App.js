import React, { useState } from 'react';
import './App.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config'; // Firebase config
import logo from './SmartWallet.png'; // You can use a banking-related logo instead of React's

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [errorMessage, setErrorMessage] = useState('');

  // Handle user login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true); // Set user as logged in
      alert('Logged in successfully');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle user registration (sign-up)
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true); // Automatically log in after sign-up
      alert('Account created successfully');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Function to handle clicking "Transfer Funds" action
  const handleTransferFunds = () => {
    alert('Transfer Funds functionality coming soon!');
    // Add the logic to navigate to or handle transfer funds page here
  }

  // Function to handle clicking "Pay Bills" action
  const handlePayBills = () => {
    alert('PayBills functionality coming soon!');
    // Add the logic to navigate to or handle transfer funds page here
  }





  return (
    <div className="App">
      <header className="App-header">
      <div className="logo-container">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">SmartWallet</h1>
      </div>
        
        {/* Conditional rendering: Show login/signup form if not logged in, else show dashboard */}
        {!isLoggedIn ? (
          <div>
            <h2>{isRegistering ? 'Sign Up' : 'Login'}</h2>
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

            <button onClick={isRegistering ? handleSignUp : handleLogin}>
              {isRegistering ? 'Sign Up' : 'Login'}
              
            </button>
            
            <button onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Already have an account? Log in' : 'Need an account? Sign up'}
            </button>
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
              <button onClick={handleTransferFunds}>Transfer Funds</button>
              <button onClick={handlePayBills}>Pay Bills</button>
              <button>View Statements</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
