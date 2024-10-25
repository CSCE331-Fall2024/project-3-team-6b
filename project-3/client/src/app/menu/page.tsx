// client/src/app/menu/page.tsx
'use client';

import { useEffect, useState } from 'react';
import MenuGrid from '@/components/menu/MenuGrid';
import { MenuItem } from '@/types';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Temporary data for testing
  const dummyData: MenuItem[] = [
    {
      id: '1',
      name: 'Orange Chicken',
      description: 'Crispy chicken wok-tossed in a sweet and spicy orange sauce',
      price: 11.99,
      category: 'entree',
      imageUrl: '/images/placeholder.png',
      available: true,
    },
    {
      id: '2',
      name: 'Beijing Beef',
      description: 'Crispy beef wok-tossed with bell peppers and onions',
      price: 12.99,
      category: 'entree',
      imageUrl: '/images/placeholder.png',
      available: true,
    },
    {
      id: '3',
      name: 'Chow Mein',
      description: 'Stir-fried wheat noodles with onions and celery',
      price: 4.99,
      category: 'side',
      imageUrl: '/images/placeholder.png',
      available: true,
    },
  ];

  useEffect(() => {
    // Simulating API call with dummy data
    setMenuItems(dummyData);
    setIsLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'entree', name: 'Entrees' },
    { id: 'side', name: 'Sides' },
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
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-[var(--panda-red)] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--panda-red)]"></div>
        </div>
      ) : (
        <MenuGrid items={filteredItems} />
      )}
    </div>
  );
}