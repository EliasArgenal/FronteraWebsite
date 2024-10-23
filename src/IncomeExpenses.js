import { deleteDoc, doc } from 'firebase/firestore'; // New import for deleting Firestore documents
import React, { useState } from 'react';
import './IncomeExpenses.css'; // Optional: Use this for custom styling

function IncomeExpenses() {
  const [entries, setEntries] = useState([]); // Initial state is an empty array for the table
  const [newEntry, setNewEntry] = useState({ type: '', amount: '', category: '', comments: '' });

  const handleChange = (e) => {
    setNewEntry({
      ...newEntry,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddEntry = () => {
    setEntries([...entries, newEntry]);
    setNewEntry({ type: '', amount: '', category: '', comments: '' }); // Reset form after adding
  };

  // Remove an entry from Firestore and local state
  const handleRemoveEntry = async (id) => {
    try {
      // Remove from Firestore
      const docRef = doc(db, 'entries', id);
      await deleteDoc(docRef);
  
      // Remove from local state
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };



  return (
    <div className="income-expenses">
      <h1>Income & Expenses</h1>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Income/Expense</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Comments</th>
            <th>Remove</th> {/* New column header for the remove button */}
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
  </button> {/* Pass the entry's ID for deletion */}
</td>
    </tr>
  ))}
        </tbody>
      </table>

      {/* Form for adding new entries */}
      <div className="add-entry-form">
        <input
          type="text"
          name="type"
          placeholder="Income/Expense"
          value={newEntry.type}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newEntry.amount}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newEntry.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="comments"
          placeholder="Comments"
          value={newEntry.comments}
          onChange={handleChange}
        />
        <button onClick={handleAddEntry}>Add</button>
      </div>
    </div>
  );
}

export default IncomeExpenses;
