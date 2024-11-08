// app/update-inventory/page.tsx
'use client';

import { useEffect, useState } from 'react';
import './update-inventory.css';


interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number | null;
  count: number;
  type: boolean | null;
}

export default function UpdateInventoryPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'update' | 'remove' | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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

  const handleAddItem = async () => {
    const name = prompt('Enter the name of the item:');
    const category = prompt('Enter the category:');
    const count = parseInt(prompt('Enter inventory count:') || '0', 10);

    let type = false;
    let price = 0;
    if (category === 'entree_side') {
      price = parseFloat(prompt('Enter the price:') || '0');
      const typeInput = prompt('Is this an entree item? Enter "t" for true or "f" for false:');
      type = typeInput?.toLowerCase() === 't';
    }
    

    if (name && category) {
      // Create a new item object to send to the backend
      const newItem = { name, category, price, count, type };
  
      try {
        const response = await fetch('http://localhost:5000/api/menu-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add new menu item');
        }
  
        // Reload the menu items from the backend if the insert was successful
        const addedItem = await response.json();
        setMenuItems([...menuItems, addedItem]); // Assuming backend returns the added item
  
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) {
      alert('Please select an item to update');
      return;
    }
    console.log('thign',selectedItem)
    const newCount = parseInt(prompt('Enter new inventory count:', selectedItem.count.toString()) || '0', 10);

    let newPrice = selectedItem.price;
    if (selectedItem.category === 'entree_side' || selectedItem.category === 'drink_table' || selectedItem.category === 'appetizers') {
      const inputPrice = prompt('Enter new price:', selectedItem.price?.toString() || '0');
      newPrice = parseFloat(inputPrice || '0');
      console.log('*****Price', newPrice);
    }

    //const updatedItem = { ...selectedItem, name: newName, category: newCategory, price: newPrice, count: newCount, type: newType };
    try {
      // Send PUT request to backend
      const response = await fetch(`http://localhost:5000/api/menu-items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedItem.name,
          category: selectedItem.category,
          price: newPrice,
          count: newCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }

      // Update local state with new item data
      const result = await response.json();
      setMenuItems(menuItems.map(item => (item.name === selectedItem.name ? result : item)));
      setSelectedItem(null); // Deselect item after update

    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleRemoveItem = () => {
    if (!selectedItem) {
      alert('Please select an item to remove');
      return;
    }

    if (confirm('Are you sure you want to remove this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null); // Deselect item after removal
    }
  };

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h1 className="title">Update Inventory</h1>
      
      {/* Action buttons */}
      <div className="actions">
        <button className="btn add" onClick={handleAddItem}>Add</button>
        <button className="btn update" onClick={handleUpdateItem} disabled={!selectedItem}>Update</button>
        <button className="btn remove" onClick={handleRemoveItem} disabled={!selectedItem}>Remove</button>
      </div>

      {/* Inventory Table */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Inventory Count</th>
            <th>Entree?</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr 
              key={item.name} 
              onClick={() => handleSelectItem(item)} 
              style={{ 
                cursor: 'pointer', 
                backgroundColor: selectedItem?.name === item.name ? '#d3d3d3' : '', // Darken more when selected
                transition: 'background-color 0.3s ease', // Smooth transition
              }}
            >
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price !== undefined && item.price !== null ? item.price.toFixed(2) : 'N/A'}</td>
              <td>{item.count}</td>
              <td>{item.type === true ? 'Yes' : item.type === false ? 'No' : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
