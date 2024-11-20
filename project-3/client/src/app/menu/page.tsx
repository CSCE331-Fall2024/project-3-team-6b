// client/src/app/menu/page.tsx
'use client';

import { useEffect, useState } from 'react';
import MenuGrid from '@/components/menu/MenuGrid';
import { MenuItem } from '@/types';
import { menuItems as initialMenuItems } from '@/utils/menuItems';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Temporary data for testing
  

  useEffect(() => {
    // Simulating API call with dummy data
    setMenuItems(initialMenuItems);
    setIsLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'entree', name: 'Entrees' },
    { id: 'side', name: 'Sides' },
    { id: 'appetizer', name: 'Appetizers'},
    { id: 'drink', name: 'Drinks' },
    { id: 'combo', name: 'Combos' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
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

      <div className="flex justify-center items-center min-h-screen">

      <div className="w-full lg:w-3/4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--panda-red)]"></div>
        </div>
      ) : (
        
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredItems.map(item => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
          <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div className="min-h-[100px]"> {/* Adjust min height as needed */}
              <h3 className="text font-bold">{item.name}</h3>
              <p className="text-red-500 mb-2">{item.description}</p> {/* Full text shown */}
            </div>
            <p className="text-[var(--panda-red)] font-bold">${item.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
      )}
      </div>
      </div>
      
    </div>
  );
}