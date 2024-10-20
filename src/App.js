import React, { useState } from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'; // to switch between pages
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('Logged out successfully');
  };
 

  return (
    <Router>
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
            <Routes>
              <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />
              <Route path="/debt" element={<Debt />} />
              <Route path="/income-expenses" element={<IncomeExpenses />} />
              <Route path="/savings-budgeting" element={<SavingsBudgeting />} />
              <Route path="/tbd" element={<TBD />} />
            </Routes>
          )}
        </header>
      </div>
    </Router>
  );
}

export default App;

// Dashboard Component
function Dashboard({ handleLogout }) {
  return (
    <div className="dashboard">
      <h2>User's Dashboard</h2>
      <div className="button-grid">
        <Link to="/debt">
          <button className="dashboard-btn">Debt</button>
        </Link>
        <Link to="/income-expenses">
          <button className="dashboard-btn">Income & Expenses</button>
        </Link>
        <Link to="/savings-budgeting">
          <button className="dashboard-btn">Savings & Budgeting</button>
        </Link>
        <Link to="/tbd">
          <button className="dashboard-btn">TBD</button>
        </Link>
      </div>
      <button className="logout-btn" onClick={handleLogout}>Log Out</button>
    </div>
  );
}

// Individual Page Components
function Debt() {
  return (
    <div className="page">
      <h1>Debt</h1>
      <Link to="/">
        <button className="home-btn">Home</button>
      </Link>
    </div>
  );
}

function IncomeExpenses() {
  return (
    <div className="page">
      <h1>Income & Expenses</h1>
      <Link to="/">
        <button className="home-btn">Home</button>
      </Link>
    </div>
  );
}

function SavingsBudgeting() {
  return (
    <div className="page">
      <h1>Savings & Budgeting</h1>
      <Link to="/">
        <button className="home-btn">Home</button>
      </Link>
    </div>
  );
}

function TBD() {
  return (
    <div className="page">
      <h1>TBD</h1>
      <Link to="/">
        <button className="home-btn">Home</button>
      </Link>
    </div>
  );
}
