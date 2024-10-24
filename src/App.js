import IncomeExpenses from './IncomeExpenses'; // Income & Expenses feature
import React, { useState } from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'; // to switch between pages
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import { auth,googleProvider } from './firebase-config'; // Firebase config
import {doc,setDoc, updateDoc,} from "firebase/firestore";
import {db} from "./firebase-config"; // import firestore instance
import logo from './SmartWallet.png'; // You can use a banking-related logo instead of React's
import { useEffect } from 'react';  // Add this to the top of your imports in App.js





function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [errorMessage, setErrorMessage] = useState('');
 //const [currentUser, setCurrentUser] = useState(null);


  //const userId = 'userID123';  // Assume this comes from user auth or context

    const handleGoogleSignIn = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        setIsLoggedIn(true);
        //setCurrentUser(user);
        alert(`Welcome ${user.displayName}!`);
        console.log('User Info:', user); // You can also check other user properties here
        await storeUserData(user.uid,user.email);
      
      } catch (error) {
        console.error('Error during Google sign-in:', error);
        alert(`Error: ${error.message}`);
      }
    };
    

  // Handle user login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      //setCurrentUser(user);
      setIsLoggedIn(true); // Set user as logged in
      // alert('Logged in successfully'); <- removed login popups

      // Call storeUserData after user login or registration
      await storeUserData(user.uid, user.email);

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle user registration (sign-up)
  const handleSignUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      //setCurrentUser(user);
      setIsLoggedIn(true); // Automatically log in after sign-up
      alert('Account created successfully');
      console.log('User UID',user.uid);
      await storeUserData(user.uid,user.email);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // alert('Logged out successfully'); <- removed logout popups
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
              <Route path="/income-expenses" element={<IncomeExpenses />} />
              <Route path="/debt" element={<Debt />} />
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

// Function to store user data in Firestore
async function storeUserData(userId, email) {
  try {
    const userRef = doc(db, 'Users', userId); // Use user's ID as the document ID

    // Set user data in Firestore
    await setDoc(userRef, {
      email: email,
      budget: null,  // You can set a default budget
      createdAt: new Date(),
    });

    console.log('User data stored successfully!');
  } catch (e) {
    console.error('Error storing user data:', e);
  }
}

// Function to update the user's budget
async function updateUserBudget(userId, newBudget) {
  try {
    const userRef = doc(db, 'Users', userId);  // Reference to the user document

    // Update the budget field in Firestore
    await updateDoc(userRef, { budget: newBudget, });

    console.log('Budget updated successfully!');
  } catch (e) {
    console.error('Error updating budget:', e);
  }
}