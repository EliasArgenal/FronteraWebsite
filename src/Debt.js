import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Debt.css';
import { db } from './firebase-config';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

function Debt() {
  const navigate = useNavigate();
  const [debts, setDebts] = useState([]);
  const [newDebt, setNewDebt] = useState({ name: '', amount: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  // Reference to the Firestore collection
  const debtsCollectionRef = collection(db, 'debts');

  // Fetch debts from Firestore when the component mounts
  useEffect(() => {
    const fetchDebts = async () => {
      const data = await getDocs(debtsCollectionRef);
      setDebts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchDebts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewDebt({
      ...newDebt,
      [e.target.name]: e.target.value,
    });
  };

  // Add a new debt to Firestore
  const handleAddDebt = async () => {
    if (newDebt.name && newDebt.amount && newDebt.description) {
      try {
        const docRef = await addDoc(debtsCollectionRef, newDebt);
        const addedDebt = { ...newDebt, id: docRef.id };
        setDebts([...debts, addedDebt]);
        setNewDebt({ name: '', amount: '', description: '' });
        setShowForm(false);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  // Delete a debt entry
  const handleDeleteDebt = async (id) => {
    try {
      await deleteDoc(doc(db, 'debts', id));
      setDebts(debts.filter((debt) => debt.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Toggle the form modal
  const handleAddNewClick = () => {
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setNewDebt({ name: '', amount: '', description: '' });
    setShowForm(false);
  };

  return (
    <div className="debt-page">
      {/* Back to Dashboard Button */}
      <button className="back-to-dashboard" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      {/* Button to show form (modal) when clicked */}
      <button className="add-new-btn" onClick={handleAddNewClick}>
        Add New
      </button>

      {/* Modal for adding a new debt entry */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Debt</h2>
            <input
              type="text"
              name="name"
              placeholder="Debt Name"
              value={newDebt.name}
              onChange={handleChange}
              className="input"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newDebt.amount}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newDebt.description}
              onChange={handleChange}
              className="input"
            />
            <button className="confirm-btn" onClick={handleAddDebt}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table displaying debt entries */}
      <table className="table">
        <thead>
          <tr>
            <th>Debt Name</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt) => (
            <tr key={debt.id}>
              <td>{debt.name}</td>
              <td>{debt.amount}</td>
              <td>{debt.description}</td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => handleDeleteDebt(debt.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Debt;