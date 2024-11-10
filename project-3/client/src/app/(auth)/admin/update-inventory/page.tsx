// app/update-inventory/page.tsx
'use client';

import Modal from './Modal'; // Assuming you have a Modal component

import { useEffect, useState } from 'react';
import './update-inventory.css'; // Make sure to import the necessary CSS

// Define the MenuItem type (adjust based on your actual type structure)
interface MenuItem {
  name: string;
  category: string;
  price: number;
  count: number;
  type: boolean | null;
}

export default function UpdateInventoryPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'update' | 'remove' | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);  // Track modal visibility

  // // Fetch menu items from the backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu-items');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data: MenuItem[] = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Function to fetch the menu items
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/menu-items');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

// // useEffect to load items on component mount
useEffect(() => {
  fetchMenuItems();
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
  
  const handleSelectItem = (item: MenuItem) => {
    if (selectedItem && selectedItem.name === item.name) {
      // If the clicked item is already selected, deselect it
      setSelectedItem(null);
    } else {
      // Otherwise, select the clicked item
      setSelectedItem(item);
    }
  };
  

  // Modal component for adding, updating, or removing items
  const handleSaveItem = async (data: Partial<MenuItem>) => {
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
      response = await fetch('http://localhost:5000/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else if (modalAction === 'update' && selectedItem) {
      response = await fetch('http://localhost:5000/api/menu-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedItem, ...data })
      });
      console.log(JSON.stringify(data));
    } else if (modalAction === 'remove' && selectedItem) {
      response = await fetch(`http://localhost:5000/api/menu-items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedItem, ...data })
      });
    }

    if (response?.ok) {
      // Refetch data from backend after the action
      await fetchMenuItems();
      setModalVisible(false); // Close modal after saving
      setSelectedItem(null); // Deselect item
    } else {
      console.error(`Failed to ${modalAction} item`);
    }
  };
  
  const handleConfirmRemove = async () => {
    if (!selectedItem) return;
  
    // Send DELETE request to backend to remove the item by name and category
    const response = await fetch('http://localhost:5000/api/menu-items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: selectedItem.name, category: selectedItem.category }), // Send name and category for identification
    });
  
    if (response.ok) {
      // Remove item locally and refresh list
      setMenuItems((prevItems) => prevItems.filter((item) => item.name !== selectedItem.name));
    } else {
      console.error('Failed to remove item');
    }
  
    setModalVisible(false); // Close modal after removing
    setSelectedItem(null); // Clear selection
  };
  
  // Handle row click to select an item
  const handleRowClick = (item: MenuItem) => {
    if (selectedItem?.name === item.name) {
      setSelectedItem(null); // Deselect if the same row is clicked again
    } else {
      setSelectedItem(item); // Select the clicked row
    }
  };

  return (
    <div>
      <h1>Update Inventory</h1>

      {loading && <p>Loading menu items...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Action Buttons */}
      <div className="button-group">
        <button className="btn-add" onClick={handleAddItem}>Add Item</button>
        <button className="btn-update" onClick={handleUpdateItem}>Update Item</button>
        <button className="btn-remove" onClick={handleRemoveItem}>Remove Item</button>
      </div>

      {/* Table displaying menu items */}
      <table className="menu-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Inventory</th>
            <th>Entree?</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr
              key={item.name}
              className={selectedItem?.name === item.name ? 'selected' : ''}
              onClick={() => handleSelectItem(item)}
            >
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.count}</td>
              <td>{item.type === true ? "t" : item.type === false ? "f" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to handle add/update actions */}
      {modalVisible && (
        <>
          <div className="overlay" onClick={() => setModalVisible(false)} /> {/* Grey background */}
          <Modal
            onClose={() => setModalVisible(false)}
            onSave={handleSaveItem} // handleSaveItem will handle add/update logic
            onConfirmRemove={handleConfirmRemove} // for removing item
            initialData={(modalAction === 'update' || modalAction === 'remove') && selectedItem ? selectedItem : undefined} // Ensure selectedItem is passed or undefined
            action={modalAction} // Pass the action (add, update, or remove) to the modal for dynamic content
          />
        </>
      )}



      
    </div>
  );
}
