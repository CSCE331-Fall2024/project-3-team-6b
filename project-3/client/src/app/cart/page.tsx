'use client';

import { menuItems } from '@/utils/menuItems';
import { MenuItem } from '@/types';
import React, { useState } from 'react';
// Define the menu items


const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('combo');
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [selectedSide, setSelectedSide] = useState<MenuItem | null>(null);
  const [selectedEntrees, setSelectedEntrees] = useState<MenuItem[]>([]);
  const [showSideModal, setShowSideModal] = useState(false);
  const [showEntreeModal, setShowEntreeModal] = useState(false);

  const sideItems = menuItems.filter(item => item.category === 'side');

  const entreeItems = menuItems.filter(item => item.category === 'entree' || item.category === 'appetizer');

  // Filter the menu items based on the selected category
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    if (item.category === 'combo') {
        const comboItem = {
          ...item,
          selectedSide,
          selectedEntrees,
        };
        setCartItems([...cartItems, comboItem]);
      } else {
        setCartItems([...cartItems, item]);
      }
  };

  const renderCartItemDetails = (item: MenuItem) => {
    if (item.category === 'combo') {
      return (
        <div className="text-gray-600 text-sm mt-2">
          <p><strong>Side:</strong> {item.selectedSide ? item.selectedSide.name : 'None'}</p>
          <p><strong>Entrees:</strong> {item.selectedEntrees && item.selectedEntrees.length > 0
            ? item.selectedEntrees.map(entree => entree.name).join(', ')
            : 'None'}
          </p>
        </div>
      );
    }
    return null;
  };
  

  // Remove item from cart
  const removeFromCart = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };

  const handleSideSelect = (side: MenuItem) => {
    setSelectedSide(side);
    setShowSideModal(false);
  };

  const handleEntreeSelect = (entree: MenuItem) => {
    if (modalItem?.name === 'Bowl' && selectedEntrees.length < 1) {
      setSelectedEntrees([entree]);
    } else if (modalItem?.name === 'Plate' && selectedEntrees.length < 2) {
      setSelectedEntrees([...selectedEntrees, entree]);
    } else if (modalItem?.name === 'Bigger Plate' && selectedEntrees.length < 3) {
      setSelectedEntrees([...selectedEntrees, entree]);
    }
    
    if (
      (modalItem?.name === 'Bowl' && selectedEntrees.length === 0) ||
      (modalItem?.name === 'Plate' && selectedEntrees.length === 1) ||
      (modalItem?.name === 'Bigger Plate' && selectedEntrees.length === 2)
    ) {
      setShowEntreeModal(false);
    }
  };

  // Calculate the total cost
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  // Handle modal opening and closing
  const openModal = (item: MenuItem) => {
    setModalItem(item);
    setSelectedSide(null);
    setSelectedEntrees([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalItem(null);
    setSelectedSide(null);
    setSelectedEntrees([]);
    setShowModal(false);
  };

  // Handle bowl, plate, and bigger plate orders
  const orderBowl = () => {
    openModal({
      id: 'bowl',
      name: 'Bowl',
      description: '1 Side & 1 Entree',
      price: 8.30,
      category: 'combo',
      imageUrl: '/images/combos/bowl.png',
      available: true,
    });
  };

  const orderPlate = () => {
    openModal({
      id: 'plate',
      name: 'Plate',
      description: '1 Side & 2 Entrees',
      price: 9.80,
      category: 'combo',
      imageUrl: '/images/combos/plate.png',
      available: true,
    });
  };

  const orderBiggerPlate = () => {
    openModal({
      id: 'biggerPlate',
      name: 'Bigger Plate',
      description: '1 Side & 3 Entrees',
      price: 11.30,
      category: 'combo',
      imageUrl: '/images/combos/biggerPlate.png',
      available: true,
    });
  };

  const handleCheckout = () => {
    console.log('Checking out with items:', cartItems);
    console.log('Total amount:', total.toFixed(2));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Menu items grid */}
        <div className="w-full lg:w-3/4">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* Category buttons */}
            
                
            <button 
              className="btn-primary px-4 py-2 rounded-md bg-[var(--panda-red)] text-white"
              onClick={() => setSelectedCategory('combo')}
            >
              Combos
            </button>
            
            <button 
              className="btn-primary px-4 py-2 rounded-md bg-[var(--panda-red)] text-white"
              onClick={() => setSelectedCategory('entree')}
            >
              Entrees
            </button>
            
            <button 
              className="btn-primary px-4 py-2 rounded-md bg-[var(--panda-red)] text-white"
              onClick={() => setSelectedCategory('side')}
            >
              Sides
            </button>
            
            <button 
              className="btn-primary px-4 py-2 rounded-md bg-[var(--panda-red)] text-white"
              onClick={() => setSelectedCategory('appetizer')}
            >
              Appetizers
            </button>
            
            <button 
              className="btn-primary px-4 py-2 rounded-md bg-[var(--panda-red)] text-white"
              onClick={() => setSelectedCategory('drink')}
            >
              Drinks
            </button>
            
            <button 
              className="btn-primary px-4 py-2 rounded-md bg-[var(--panda-red)] text-white"
              onClick={() => setSelectedCategory('all')}
            >
              All Items
            </button>
          
                
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {filteredItems.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div className="min-h-[100px]"> {/* Adjust min height as needed */}
          <h3 className="text font-bold">{item.name}</h3>
          <p className="text-red-500 mb-2">{item.description}</p> {/* Full text shown */}
        </div>
        <div>
          <p className="text-[var(--panda-red)] font-bold">${item.price.toFixed(2)}</p>
          <button
            className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md mt-2 w-full"
            onClick={() => {
              if (item.name === 'Bowl') {
                orderBowl();
              } else if (item.name === 'Plate') {
                orderPlate();
              } else if (item.name === 'Bigger Plate') {
                orderBiggerPlate();
              } else {
                addToCart(item);
              }
            }}
          >
            {item.category === 'combo' ? 'Create' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


        
        </div>

        {/* Checkout column */}
        <div className="w-full md:w-1/4 mt-8 md:mt-0 md:ml-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold mb-4">Your Cart</h2>
            <ul>
              {cartItems.map((item, index) => (
                <li key={item.id} className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-md font-bold">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                    {renderCartItemDetails(item)}
                  </div>
                  <button
                    className="text-[var(--panda-red)] hover:text-red-600"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mt-4">
              <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
              <div className="flex justify-between mt-4">
                
              </div>
            </div>
          </div>
          <button
              onClick={handleCheckout}
              className="w-full bg-[var(--panda-red)] text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700 transition-colors"
            >
              Checkout
            </button>
        </div>
      </div>

      {/* Modal for bowl, plate, and bigger plate orders */}
      {showModal && modalItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">{modalItem.name}</h2>
            <p className="text-gray-500 mb-4">{modalItem.description}</p>
            <p className="text-[var(--panda-red)] font-bold mb-8">${modalItem.price.toFixed(2)}</p>
            
            

            {/* Selected Side Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">Side</h4>
                  {!selectedSide && (
                    <button
                      className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => setShowSideModal(true)}
                    >
                      Choose Side
                    </button>
                  )}
                </div>
                {selectedSide ? (
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                    <img 
                      src={selectedSide.imageUrl} 
                      alt={selectedSide.name} 
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-grow">
                      <h5 className="font-semibold">{selectedSide.name}</h5>
                      <p className="text-gray-600 text-sm">{selectedSide.description}</p>
                    </div>
                    <button
                      className="text-[var(--panda-white)] hover:text-red-700 text-sm"
                      onClick={() => {
                        setSelectedSide(null);
                        setShowSideModal(true);
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-center">
                    No side selected
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">
                    Entrees ({selectedEntrees.length}/
                    {modalItem.name === 'Bowl' ? '1' : 
                     modalItem.name === 'Plate' ? '2' : '3'})
                  </h4>
                  {selectedEntrees.length < (
                    modalItem.name === 'Bowl' ? 1 : 
                    modalItem.name === 'Plate' ? 2 : 3
                  ) && (
                    <button
                      className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => setShowEntreeModal(true)}
                    >
                      {selectedEntrees.length === 0 ? 'Choose Entrees' : 'Add Another Entree'}
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {selectedEntrees.length > 0 ? (
                    selectedEntrees.map((entree, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center">
                        <img 
                          src={entree.imageUrl} 
                          alt={entree.name} 
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="ml-4 flex-grow">
                          <h5 className="font-semibold">{entree.name}</h5>
                          <p className="text-gray-600 text-sm">{entree.description}</p>
                        </div>
                        <button
                          className="text-[var(--panda-white)] hover:text-red-700 text-sm"
                          onClick={() => {
                            setSelectedEntrees(selectedEntrees.filter((_, i) => i !== index));
                            setShowEntreeModal(true);
                          }}
                        >
                          Change
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-center">
                      No entrees selected
                    </div>
                  )}
                </div>
              </div>
            

            {/* Confirm/Cancel */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md"
                onClick={() => {
                  addToCart(modalItem);
                  closeModal();
                }}
              >
                Add to Cart
              </button>
              <button className="text-[var(--panda-white)] hover:text-r-600" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

{showSideModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Choose a Side</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowSideModal(false)}
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {sideItems.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border-2 
                    ${selectedSide?.id === item.id ? 'border-[var(--panda-red)]' : 'border-transparent'}`}
                  onClick={() => handleSideSelect(item)}
                >
                  <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Updated Entree Selection Modal */}
      {showEntreeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">Choose your Entrees</h2>
                <p className="text-gray-500">
                  Selected: {selectedEntrees.length} / 
                  {modalItem?.name === 'Bowl' ? '1' : 
                    modalItem?.name === 'Plate' ? '2' : '3'}
                </p>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowEntreeModal(false)}
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {entreeItems.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border-2 
                    ${selectedEntrees.some(e => e.id === item.id) ? 'border-[var(--panda-red)]' : 'border-transparent'}`}
                  onClick={() => handleEntreeSelect(item)}
                >
                  <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuPage;
