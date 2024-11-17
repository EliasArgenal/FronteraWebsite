import { auth, db } from './firebase-config';
import { setDoc, addDoc, collection, deleteDoc, doc, onSnapshot , Timestamp} from 'firebase/firestore'; // Include Firestore methods
import React, { useState, useEffect } from 'react';
import './IncomeExpenses.css';
import { useNavigate } from 'react-router-dom';
//import {Timestamp} from 'firebase/firestore';



function IncomeExpenses() {
  const [entries, setEntries] = useState([]); // State for table entries
  const [newEntry, setNewEntry] = useState({ type: '', amount: '', category: '', comments: '' });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const categories = ['Housing', 'Transportation', 'Food', 'Healthcare', 'Insurance & Pensions', 'Entertainment',
    'Education', 'Clothing/Personal', 'Savings & Investments', 'Debt Payments', 'Misc'];
  const incomeorexpense = ['Income', 'Expense'];


  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
  
    // References for Income and Expenses sub-collections
    const incomeRef = collection(db, 'Users', user.uid, 'incomeExpenses', 'Income');
    const expensesRef = collection(db, 'Users', user.uid, 'incomeExpenses', 'Expenses');
  
    // Reset entries before fetching
    setEntries([]);
  
    // Subscribe to both Income and Expenses sub-collections
    const unsubscribeIncome = onSnapshot(incomeRef, (snapshot) => {
      const incomeEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'Income', // Add type to distinguish entries
        ...doc.data(),
      }));
  
      setEntries((prevEntries) => [...prevEntries, ...incomeEntries]);
    });
  
    const unsubscribeExpenses = onSnapshot(expensesRef, (snapshot) => {
      const expenseEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'Expense', // Add type to distinguish entries
        ...doc.data(),
      }));
  
      setEntries((prevEntries) => [...prevEntries, ...expenseEntries]);
    });
  
    // Cleanup both listeners on unmount
    return () => {
      unsubscribeIncome();
      unsubscribeExpenses();
    };
  }, []);
  

/*
  // Fetch data from Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const incomeExpensesRef = collection(db, 'Users', user.uid, 'incomeExpenses');
    const unsubscribe = onSnapshot(incomeExpensesRef, (snapshot) => {
      const fetchedEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(fetchedEntries);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
*/




  const handleChange = (e) => {
    setNewEntry({
      ...newEntry,
      [e.target.name]: e.target.value,
    });
  };




  const handleAddEntry = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert('User not logged in. Please log in to add entries.');
      return;
    }

    try {
      // Ensure the user's document exists
      const userDocRef = doc(db, 'Users', user.uid);
      await setDoc(userDocRef, { initialized: true }, { merge: true });

      // Determine the subcollection to use (Income or Expenses)
      const subCollectionName = newEntry.type === 'Income' ? 'Income' : 'Expenses';

      // Reference the subcollection
      const transactionRef = collection(db, 'Users', user.uid, 'incomeExpenses', subCollectionName);

      // Add a new transaction document
      await addDoc(transactionRef, {
        amount: Number(newEntry.amount), // Ensure numeric type
        category: newEntry.category,
        comments: newEntry.comments || '',
        timestamp: Timestamp.fromDate(new Date()),
      });

      console.log(`${newEntry.type} transaction added successfully!`);

      // Reset form and close modal
      setNewEntry({ type: '', amount: '', category: '', comments: '' });
      setShowForm(false);
    } catch (error) {
      console.error(`Error adding ${newEntry.type} transaction: `, error);
    }
  };



  const handleAddNewClick = () => {
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setNewEntry({ type: '', amount: '', category: '', comments: '' });
    setShowForm(false);
  };

  const handleRemoveEntry = async (id, type) => {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        console.error('No user is logged in!');
        return;
      }
  
      // Determine the correct subcollection (Income or Expenses)
      const subCollectionName = type === 'Income' ? 'Income' : 'Expenses';
  
      // Delete the document from the corresponding subcollection
      await deleteDoc(doc(db, 'Users', user.uid, 'incomeExpenses', subCollectionName, id));
      console.log(`Document with ID ${id} deleted from ${subCollectionName}.`);
      
    // Remove the deleted entry from the state
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="income-expenses">
      <button className="back-to-dashboard" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <button className="add-new-btn" onClick={handleAddNewClick}>
        Add New
      </button>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Entry</h2>
            <select name="type" value={newEntry.type} onChange={handleChange} className="input">
              <option value="" disabled>Income / Expense</option>
              {incomeorexpense.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newEntry.amount}
              onChange={handleChange}
              style={{ color: 'black', backgroundColor: 'white' }}
            />
            <select name="category" value={newEntry.category} onChange={handleChange} className="input">
              <option value="" disabled>Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="comments"
              placeholder="Comments"
              value={newEntry.comments}
              onChange={handleChange}
            />
            <button className="confirm-btn" onClick={handleAddEntry}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Income/Expense</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Comments</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.type}</td>
              <td>{entry.amount}</td>
              <td>{entry.category}</td>
              <td>{entry.comments}</td>
              <td>
                <button className="remove-btn" onClick={() => handleRemoveEntry(entry.id,entry.type)}>
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncomeExpenses;
