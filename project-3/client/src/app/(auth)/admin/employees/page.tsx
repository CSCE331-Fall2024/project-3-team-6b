// app/update-inventory/page.tsx
'use client';

import Modal from './Modal'; // Assuming you have a Modal component

import { useEffect, useState } from 'react';
import './employee.css'; // Make sure to import the necessary CSS



interface Employee {
    employee_id: string;
    name: string;
    salary: number;
    position: string;
  }

export default function UpdateEmployeesPage() {
  const [Employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'update' | 'remove' | null>(null);
  const [selectedItem, setSelectedItem] = useState<Employee | null>(null);
  const [modalVisible, setModalVisible] = useState(false);  // Track modal visibility
  const [activeTab, setActiveTab] = useState<string>('entree_side'); // Tracks the selected category tab

 

  // Function to fetch the menu items
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data: Employee[] = await response.json();
      setEmployees(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

// useEffect to load items on component mount
useEffect(() => {
  fetchEmployees();
}, []);

  // Handle add, update, and remove actions
  const handleAddItem = async () => {
    setModalAction('add');
    setModalVisible(true);
  };

  // Modify handleUpdateItem to show the modal for updating
  const handleUpdateItem = () => {
    if (!selectedItem) {
      alert('Please select an item to update');
      return;
    }
    
    setModalAction('update'); // Action for updating
    setModalVisible(true); // Open the modal with selected item data
  };

  // Modify handleRemoveItem to show the modal for removing
  const handleRemoveItem = () => {
    if (!selectedItem) {
      alert('Please select an item to remove');
      return;
    }
    
    setModalAction('remove'); // Action for removing
    setModalVisible(true); // Open the modal for confirmation
  };
  
  const handleSelectItem = (item: Employee) => {
    if (selectedItem && selectedItem.name === item.name) {
      // If the clicked item is already selected, deselect it
      setSelectedItem(null);
    } else {
      // Otherwise, select the clicked item
      setSelectedItem(item);
    }
  };
  

  // Modal component for adding, updating, or removing items
  const handleSaveItem = async (data: Partial<Employee>) => {
    let response;
    //try this delete later if no work
    // Check and format price if it's a number
    // if (data.price !== undefined && typeof data.price === 'number') {
    //   console.log('Formatting price:', data.price); // Log the original price
    //   data.price = parseFloat(data.price.toFixed(2)); // Format to 2 decimal places
    // } else {
    //     console.log('Price is not a number or is undefined:', data.price); // Log if not a number
    // }
    if (modalAction === 'add') {
      response = await fetch('http://localhost:4000/api/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else if (modalAction === 'update' && selectedItem) {
      response = await fetch('http://localhost:4000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedItem, ...data })
      });
      console.log(JSON.stringify(data));
    } else if (modalAction === 'remove' && selectedItem) {
      response = await fetch(`http://localhost:4000/api/employees`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedItem, ...data })
      });
    }

    if (response?.ok) {
      // Refetch data from backend after the action
      await fetchEmployees();
      setModalVisible(false); // Close modal after saving
      setSelectedItem(null); // Deselect item
    } else {
      console.error(`Failed to ${modalAction} item`);
    }
  };
  
  
  
  

  return (
    <div>
      <h1>Manage Employees</h1>

      {loading && <p>Loading employees...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

    
      

      {/* Action Buttons */}
      <div className="button-group">
        <button className="btn-add" onClick={handleAddItem}>Add Employee</button>
        <button className="btn-update" onClick={handleUpdateItem}>Update Employee</button>
        <button className="btn-remove" onClick={handleRemoveItem}>Remove Remove</button>
      </div>

      {/* Table displaying menu items for the active category */}
      <table className="menu-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Salary</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {Employees
            .map((item) => (
              <tr
                key={item.name}
                className={selectedItem?.name === item.name ? 'selected' : ''}
                onClick={() => handleSelectItem(item)}
              >
                <td>{item.employee_id}</td>
                <td>{item.name}</td>
                <td>{item.salary}</td>
                <td>{item.position}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalVisible && (
        <>
          <div className="overlay" onClick={() => setModalVisible(false)} />
          <Modal
            onClose={() => setModalVisible(false)}
            onSave={handleSaveItem}
            onConfirmRemove={() => handleSaveItem(selectedItem!)} // for removing item
            initialData={(modalAction === 'update' || modalAction === 'remove') && selectedItem ? selectedItem : undefined}
            action={modalAction}
          />
        </>
      )}
    </div>
  );
}
