// client/src/components/menu/MenuGrid.tsx
'use client';

import Image from 'next/image';
import { MenuItem } from '@/types';

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="relative h-48">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className="text-lg font-bold text-[var(--panda-red)]">
                ${item.price.toFixed(2)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">
              {item.description}
            </p>

            {!item.available && (
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                Currently Unavailable
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}