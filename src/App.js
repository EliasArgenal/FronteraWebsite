import React, { useState } from 'react';
import './App.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import { auth,googleProvider } from './firebase-config'; // Firebase config
import logo from './SmartWallet.png'; // You can use a banking-related logo instead of React's

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [errorMessage, setErrorMessage] = useState('');

  
    const handleGoogleSignIn = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        alert(`Welcome ${user.displayName}!`);
        console.log('User Info:', user); // You can also check other user properties here
      } catch (error) {
        console.error('Error during Google sign-in:', error);
        alert(`Error: ${error.message}`);
      }
    };
    

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

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('Logged out successfully');
  };

  // Button handlers for dashboard options
    // Debt button
  const handleDebtClick = () => {
    alert('Under construction!'); // to be edited
  };
    // Income&expenses button
  const handleIncomeExpensesClick = () => {
    alert('Under construction!'); // to be edited
  };
  
    // Savings & budgeting button
  const handleSavingsBudgetingClick = () => {
    alert('Under construction!'); // to be edited
  };
  
    // TBD button
  const handleTBDClick = () => {
    alert('Under construction!'); // Placeholder action for TBD button
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">SmartWallet</h1>
        </div>

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
            <button onClick={handleGoogleSignIn} className="google-signin">
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="dashboard">
            <h2>User's Dashboard</h2>
            <div className="button-grid">
              <button className="dashboard-btn" onClick={handleDebtClick}>Debt</button>
              <button className="dashboard-btn" onClick={handleIncomeExpensesClick}>Income & Expenses</button>
              <button className="dashboard-btn" onClick={handleSavingsBudgetingClick}>Savings & Budgeting</button>
              <button className="dashboard-btn" onClick={handleTBDClick}>TBD</button>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
