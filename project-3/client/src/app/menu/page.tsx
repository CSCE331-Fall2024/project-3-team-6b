// page.tsx
'use client';

import { useEffect, useState } from 'react';
import MenuGrid from '@/components/menu/MenuGrid';
import { MenuItem } from '@/types';
import { fetchMenuItems as initialMenuItems } from '@/utils/menuItems';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const items = await initialMenuItems();
      setMenuItems(items);
      setIsLoading(false);
    };

    fetchData();
  }, []);

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


      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--panda-red)]"></div>
          </div>
        ) : (
          <MenuGrid items={filteredItems} />
        )}
      </div>
    </div>
  );
}