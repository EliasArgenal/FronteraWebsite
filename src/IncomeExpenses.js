import { db } from './firebase-config';
import { deleteDoc, doc } from 'firebase/firestore'; // Import for deleting Firestore documents
import React, { useState } from 'react';
import './IncomeExpenses.css'; // Optional: Use this for custom styling
import { useNavigate } from 'react-router-dom';


function IncomeExpenses() {
  const [entries, setEntries] = useState([]); // Initial state is an empty array for the table
  const [newEntry, setNewEntry] = useState({ type: '', amount: '', category: '', comments: '' });
  const [showForm, setShowForm] = useState(false); // State to toggle modal visibility
  const navigate = useNavigate();
  const categories = ['Housing', 'Transportation', 'Food', 'Healthcare','Insurance & Pensions', 'Entertainment',
    'Education', 'Clothing/Personal', 'Savings & Investments', 'Debt Payments', 'Misc'];
  const incomeorexpense = ['Income', 'Expense'];
  const handleChange = (e) => {
    setNewEntry({
      ...newEntry,
      [e.target.name]: e.target.value,
    });
  };


  const handleAddEntry = () => {
    setEntries([...entries, newEntry]);
    setNewEntry({ type: '', amount: '', category: '', comments: '' }); // Reset form after adding
    setShowForm(false); // Close modal after confirming
  };

  const handleAddNewClick = () => {
    setShowForm(true);  // Show modal when "Add" is clicked
  };

  const handleCloseModal = () => {
    setNewEntry({ type: '', amount: '', category: '', comments: '' }); // Reset form values
    setShowForm(false); // Close the modal
  };

  // Remove an entry from Firestore and local state
  const handleRemoveEntry = async (id) => {
    try {
      console.log("Attempting to delete entry with id:", id); // Log the entry ID being deleted
  
      // Remove from Firestore
      const docRef = doc(db, 'entries', id);
      await deleteDoc(docRef);
      console.log("Entry successfully deleted from Firestore.");
  
      // Remove from local state
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
      console.log("Entry removed from local state.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  

  return (
    <div className="income-expenses">

      {/*Back to dashboard button*/}
      <button className="back-to-dashboard" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      {/* Button to show form (modal) when clicked */}
      <button className="add-new-btn" onClick={handleAddNewClick}>
        Add New
      </button>

      {/* Modal for adding a new entry */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Entry</h2>
            {/* Income / Expenses dropdown menu */}
            <select name="type" value={newEntry.type} onChange={handleChange} className="input">
            <option value="" disabled selected>Income / Expense</option> {/* Placeholder option */}
            {incomeorexpense.map((incomeorexpense, index) => (
            <option key={index} value={incomeorexpense}>
            {incomeorexpense}
            </option>
            ))}
            </select>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newEntry.amount}
              onChange={handleChange}
            />
            {/* Category dropdown menu */}
            <select name="category" value={newEntry.category} onChange={handleChange} className="input">
            <option value="" disabled selected>Category</option> {/* Placeholder option */}
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

      {/* Table displaying entries */}
      <table className="table">
      <thead>
        <tr>
            <th>Income/Expense</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Comments</th>
            <th>Remove</th> {/* Column header for the remove button */}
            </tr>
  </thead>
  <tbody>
    {entries.map((entry, index) => (
      <tr key={index}>
        <td>{entry.type}</td>
        <td>{entry.amount}</td>
        <td>{entry.category}</td>
        <td>{entry.comments}</td>
        <td>
          <button
            className="remove-btn"
            onClick={() => handleRemoveEntry(entry.id)}
          >
            X
          </button> {/* Button to remove the row */}
        </td>
       </tr>
       ))}
  </tbody>
</table>

    </div>
  );
}

export default IncomeExpenses;
