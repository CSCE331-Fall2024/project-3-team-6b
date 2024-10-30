'use client';


import React, { useState } from 'react';
import { MenuItem } from '@/types';
// Define the menu items


const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Orange Chicken',
      description: 'Crispy chicken wok-tossed in a sweet and spicy orange sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/the_original_orange_chicken.png',
      available: true,
    },
    {
      id: '2',
      name: 'Beijing Beef',
      description: 'Crispy beef wok-tossed with bell peppers and onions',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/beijing_beef.png',
      available: true,
    },
    {
      id: '3',
      name: 'Black Pepper Chicken',
      description: 'Marinated chicken, celery, and onions in a bold black pepper sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/black_pepper_chicken.png',
      available: true,
    },
    {
      id: '4',
      name: 'Black Pepper Sirloin Steak',
      description: 'Sirloin steak wok-seared with baby broccoli, onions, red bell peppers, and mushrooms in a savory black pepper sauce',
      price: 6.00,
      category: 'entree',
      imageUrl: '/images/entrees/black_pepper_sirloin_steak.png',
      available: true,
    },
    {
      id: '5',
      name: 'Broccoli Beef',
      description: 'Tender beef and fresh broccoli in a ginger soy sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/broccoli_beef.png',
      available: true,
    },
    {
      id: '6',
      name: 'Beijing Beef',
      description: 'Crispy beef wok-tossed with bell peppers and onions',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/beijing_beef.png',
      available: true,
    },
    {
      id: '7',
      name: 'Grilled Teriyaki Chicken',
      description: 'Grilled Chicken hand-sliced to order and served with teriyaki sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/grilled_teriyaki_chicken.png',
      available: true,
    },
    {
      id: '8',
      name: 'Honey Sesame Chicken Breast',
      description: 'Crispy strips of white-meat chicken with veggies ina mildly sweet sauce with organic honey',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/honey_sesame_chicken_breast.png',
      available: true,
    },
    {
      id: '9',
      name: 'Honey Walnut Shrimp',
      description: 'Large tempura-battered shrimp, work-tossed in a honey sauce and topped with glazed walnuts',
      price: 6.00,
      category: 'entree',
      imageUrl: '/images/entrees/honey_walnut_shrimp.png',
      available: true,
    },
    {
      id: '10',
      name: 'Hot Ones Blazing Bourbon Chicken',
      description: 'Crispy boneless chicken bites and veggies wok-tossed in an extra spicy and sweet bourbon sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/hot_ones_blazing_bourbon_chicken.png',
      available: true,
    },
    {
      id: '11',
      name: 'Kung Pao Chicken',
      description: 'A Sichuan-inspired dish with chicken, peanuts and vegetables, finished with chili pepppers',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/kung_pao_chicken.png',
      available: true,
    },
    {
      id: '12',
      name: 'Mushroom Chicken',
      description: 'A delicate combination of chicken, mushrooms and zucchini wok-tossed with a light ginger soy sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/mushroom_chicken.png',
      available: true,
    },
    {
      id: '13',
      name: 'String Bean Chicken Breast',
      description: 'Chicken breast, string beans and onions wok-tossed in a mild ginger soy sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/string_bean_chicken_breast.png',
      available: true,
    },
    {
      id: '14',
      name: 'SweetFire Chicken Breast',
      description: 'Crispy, white-meat chicken, red bell peppers, onions and pineapples in a bright and sweet chili sauce',
      price: 5.00,
      category: 'entree',
      imageUrl: '/images/entrees/sweetfire_chicken_breast.png',
      available: true,
    },
    {
      id: '15',
      name: 'Chow Mein',
      description: 'Stir-fried wheat noodles with onions and celery',
      price: 5.00,
      category: 'side',
      imageUrl: '/images/sides/chow_mein.png',
      available: true,
    },
    {
      id: '16',
      name: 'Fried Rice',
      description: 'Prepared steamed white rice with soy sauce, eggs, peas, carrots and green onions',
      price: 5.00,
      category: 'side',
      imageUrl: '/images/sides/fried_rice.png',
      available: true,
    },
    {
      id: '17',
      name: 'Super Greens',
      description: 'A healthful medley of broccoli, kale, and cabbage',
      price: 5.00,
      category: 'side',
      imageUrl: '/images/sides/super_greens.png',
      available: true,
    },
    {
      id: '18',
      name: 'White Steamed Rice',
      description: 'White rice',
      price: 5.00,
      category: 'side',
      imageUrl: '/images/sides/white_steamed_rice.png',
      available: true,
    },
    {
      id: '19',
      name: 'Apple Pie Roll',
      description: 'Juicy apples and fall spices in a crispy rolled pastry, finished with cinnamon sugar',
      price: 2.80,
      category: 'appetizer',
      imageUrl: '/images/appetizers/apple_pie_roll.png',
      available: true,
    },
    {
      id: '20',
      name: 'Chicken Egg Roll',
      description: 'Cabbage, carrots, green onions and chicken in a crispy wonton wrapper',
      price: 2.5,
      category: 'appetizer',
      imageUrl: '/images/appetizers/chicken_egg_roll.png',
      available: true,
    },
    {
      id: '21',
      name: 'Cream Cheese Rangoon',
      description: 'Wonton wrappers filled with cream cheese and served with sweet and sour sauce',
      price: 3.00,
      category: 'appetizer',
      imageUrl: '/images/appetizers/cream_cheese_rangoon.png',
      available: true,
    },
    {
      id: '22',
      name: 'Veggie Sprint Roll',
      description: 'Cabbage, celery, carrots, green onions and Chinese noodles in a crispy wonton wrapper',
      price: 2.00,
      category: 'appetizer',
      imageUrl: '/images/appetizers/veggie_spring_roll.png',
      available: true,
    },
    {
      id: '23',
      name: 'Barqs Root Beer',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/barqs_root_beer.png',
      available: true,
    },
    {
      id: '24',
      name: 'Coca Cola',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/coca_cola.png',
      available: true,
    },
    {
      id: '25',
      name: 'Coca Cola Cherry',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/coke_mexico.png',
      available: true,
    },
    {
      id: '26',
      name: 'Coke Zero',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/coke_zero.png',
      available: true,
    },
    {
      id: '27',
      name: 'Dasani',
      description: '',
      price: 1.00,
      category: 'drink',
      imageUrl: '/images/drinks/dasani.png',
      available: true,
    },
    {
      id: '28',
      name: 'Diet Coke',
      description: '',
      price: 1.98,
      category: 'drink',
      imageUrl: '/images/drinks/diet_coke.png',
      available: true,
    },
    {
      id: '29',
      name: 'Dr Pepper',
      description: '',
      price: 1.99,
      category: 'drink',
      imageUrl: '/images/drinks/dr_pepper.png',
      available: true,
    },
    {
      id: '30',
      name: 'Fanta',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/fanta_orange.png',
      available: true,
    },
    {
      id: '31',
      name: 'Fuze Raspberry Iced Tea',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/fize_raspberry_iced_tea.png',
      available: true,
    },
    {
      id: '32',
      name: 'Minute Maid Apple Juice',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/minute_maid_apple_juice.png',
      available: true,
    },
    {
      id: '33',
      name: 'Minute Maid Lemonade',
      description: '',
      price: 1.50,
      category: 'drink',
      imageUrl: '/images/drinks/minute_maid_lemonade.png',
      available: true,
    },
    {
      id: '34',
      name: 'Mango Tea',
      description: '',
      price: 2.00,
      category: 'drink',
      imageUrl: '/images/drinks/passion_mango_black_tea.png',
      available: true,
    },
    {
      id: '35',
      name: 'Peach Lychee Refresher',
      description: '',
      price: 2.00,
      category: 'drink',
      imageUrl: '/images/drinks/peach_lychee_flavored_refresher.png',
      available: true,
    },
    {
      id: '36',
      name: 'Pomegranate Pineapple Flavored Lemonade',
      description: '',
      price: 2.00,
      category: 'drink',
      imageUrl: '/images/drinks/pomegranite_pineapple_flavored_lemonade.png',
      available: true,
    },
    {
      id: '37',
      name: 'Smartwater',
      description: '',
      price: 2.00,
      category: 'drink',
      imageUrl: '/images/drinks/smartwater.png',
      available: true,
    },
    {
      id: '38',
      name: 'Sprite',
      description: '',
      price: 2.00,
      category: 'drink',
      imageUrl: '/images/drinks/sprite.png',
      available: true,
    },
    {
      id: '39',
      name: 'Watermelon Mange Flavored Refresher',
      description: '',
      price: 2.00,
      category: 'drink',
      imageUrl: '/images/drinks/watermelon_mango_flavored_refresher.png',
      available: true,
    },
    {
      id: '40',
      name: 'Sprite',
      description: '',
      price: 2.00,
      category: 'drink',
      imageUrl: '/images/drinks/sprite.png',
      available: true,
    },
    {
      id: '41',
      name: 'Bowl',
      description: '1 Side & 1 Entree',
      price: 8.30,
      category: 'combo',
      imageUrl: '/images/combos/bowl.png',
      available: true,
    },
    {
      id: '42',
      name: 'Plate',
      description: '1 Side & 2 Entrees',
      price: 9.80,
      category: 'combo',
      imageUrl: '/images/combos/plate.png',
      available: true,
    },
    {
      id: '43',
      name: 'Bigger Plate',
      description: '1 Side & 3 Entrees',
      price: 11.30,
      category: 'combo',
      imageUrl: '/images/combos/biggerPlate.png',
      available: true,
    }
  ];



const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    setCartItems([...cartItems, item]);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>

      <div className="flex flex-col md:flex-row">
        {/* Menu items grid */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-center space-x-4 mb-8">
            {/* Category buttons */}
            
                <button className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md" onClick={() => setSelectedCategory('all')}>
                  All Items
                </button>
                <button className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md" onClick={() => setSelectedCategory('entree')}>
                  Entrees
                </button>
                <button className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md" onClick={() => setSelectedCategory('side')}>
                  Sides
                </button>
                <button className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md" onClick={() => setSelectedCategory('appetizer')}>
                Appetizers
                </button>
                
                <button className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md" onClick={() => setSelectedCategory('drink')}>
                  Drinks
                </button>
                <button className="bg-[var(--panda-red)] text-white px-4 py-2 rounded-md" onClick={() => setSelectedCategory('combo')}>
                  Combos
                </button>

                
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-bold">{item.name}</h3>
      <p className="text-gray-500 mb-2">{item.description}</p>
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
                      className="text-[var(--panda-red)] hover:text-red-700 text-sm"
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
                          className="text-[var(--panda-red)] hover:text-red-700 text-sm"
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
              <button className="text-[var(--panda-red)] hover:text-red-600" onClick={closeModal}>
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
