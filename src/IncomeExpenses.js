import { db } from './firebase-config';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'; // Include Firestore methods
import React, { useState, useEffect } from 'react';
import './IncomeExpenses.css';
import { useNavigate } from 'react-router-dom';

function IncomeExpenses() {
  const [entries, setEntries] = useState([]); // State for table entries
  const [newEntry, setNewEntry] = useState({ type: '', amount: '', category: '', comments: '' });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const categories = ['Housing', 'Transportation', 'Food', 'Healthcare', 'Insurance & Pensions', 'Entertainment',
    'Education', 'Clothing/Personal', 'Savings & Investments', 'Debt Payments', 'Misc'];
  const incomeorexpense = ['Income', 'Expense'];

  // Fetch data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'incomeExpenses'), (snapshot) => {
      const fetchedEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(fetchedEntries);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleChange = (e) => {
    setNewEntry({
      ...newEntry,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddEntry = async () => {
    try {
      // Add entry to Firestore
      const docRef = await addDoc(collection(db, 'incomeExpenses'), {
        type: newEntry.type,
        amount: Number(newEntry.amount), // Ensure numeric data type
        category: newEntry.category,
        comments: newEntry.comments,
        timestamp: new Date(), // Add timestamp
      });

      console.log('Document written with ID:', docRef.id);

      // Reset form and close modal
      setNewEntry({ type: '', amount: '', category: '', comments: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleAddNewClick = () => {
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setNewEntry({ type: '', amount: '', category: '', comments: '' });
    setShowForm(false);
  };

  const handleRemoveEntry = async (id) => {
    try {
      await deleteDoc(doc(db, 'incomeExpenses', id));
      console.log(`Document with ID ${id} deleted.`);
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
                <button className="remove-btn" onClick={() => handleRemoveEntry(entry.id)}>
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
