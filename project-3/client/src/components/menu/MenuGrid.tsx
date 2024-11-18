import React from 'react';
import Image from 'next/image';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/cashier/dialog"

interface MenuItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  available: boolean;
}

interface NutritionInfo {
  servingSize: string;
  calories: number;
  caloriesFromFat: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbs: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
}

// Mapping between numerical IDs and nutrition data keys
const nutritionIdMap: { [key: string]: string } = {
  '1': 'orange-chicken',
  '2': 'beijing-beef',
  '3': 'broccoli-beef',
  '4': 'black-pepper-chicken',
  '5': 'broccoli-beef'
};

const nutritionData: { [key: string]: NutritionInfo } = {
  'orange-chicken': {
    servingSize: '5.7 oz',
    calories: 420,
    caloriesFromFat: 180,
    totalFat: 21,
    saturatedFat: 4,
    transFat: 0,
    cholesterol: 95,
    sodium: 620,
    totalCarbs: 43,
    dietaryFiber: 0,
    sugars: 18,
    protein: 15
  },
  'beijing-beef': {
    servingSize: '5.6 oz',
    calories: 690,
    caloriesFromFat: 360,
    totalFat: 40,
    saturatedFat: 8,
    transFat: 0.5,
    cholesterol: 65,
    sodium: 890,
    totalCarbs: 57,
    dietaryFiber: 4,
    sugars: 25,
    protein: 26
  },
  'broccoli-beef': {
    servingSize: '5.4 oz',
    calories: 130,
    caloriesFromFat: 40,
    totalFat: 4,
    saturatedFat: 1,
    transFat: 0,
    cholesterol: 15,
    sodium: 710,
    totalCarbs: 13,
    dietaryFiber: 3,
    sugars: 3,
    protein: 10
  },
  'black-pepper-chicken': {
    servingSize: '6.1 oz',
    calories: 250,
    caloriesFromFat: 130,
    totalFat: 14,
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 120,
    sodium: 930,
    totalCarbs: 12,
    dietaryFiber: 2,
    sugars: 5,
    protein: 19
  }
};

const NutritionPanel = ({ itemId, itemName }: { itemId: string; itemName: string }) => {
  const nutritionKey = nutritionIdMap[itemId];
  const nutrition = nutritionData[nutritionKey];
  
  if (!nutrition) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Nutrition information not available</p>
        <p className="text-xs mt-2">Please contact support if this is an error.</p>
      </div>
    );
  }

  const nutritionItems = [
    { label: 'Serving Size', value: nutrition.servingSize, unit: '' },
    { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
    { label: 'Total Fat', value: nutrition.totalFat, unit: 'g' },
    { label: 'Saturated Fat', value: nutrition.saturatedFat, unit: 'g' },
    { label: 'Trans Fat', value: nutrition.transFat, unit: 'g' },
    { label: 'Cholesterol', value: nutrition.cholesterol, unit: 'mg' },
    { label: 'Sodium', value: nutrition.sodium, unit: 'mg' },
    { label: 'Total Carbs', value: nutrition.totalCarbs, unit: 'g' },
    { label: 'Dietary Fiber', value: nutrition.dietaryFiber, unit: 'g' },
    { label: 'Sugars', value: nutrition.sugars, unit: 'g' },
    { label: 'Protein', value: nutrition.protein, unit: 'g' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {nutritionItems.map((item) => (
        <div key={item.label} className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">{item.label}</div>
          <div className="text-lg font-semibold">
            {item.value}
            <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
          </div>
        </div>
      ))}
      <div className="col-span-2 text-xs text-gray-500 mt-2">
        * Percent Daily Values are based on a 2,000 calorie diet.
      </div>
    </div>
  );
};

const MenuGrid = ({ items }: { items: MenuItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="absolute top-2 right-2 z-10">
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all shadow-md">
                  <Info className="h-5 w-5 text-gray-600 hover:text-[var(--panda-red)]" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>Nutrition Information</span>
                    <span className="text-sm font-normal text-gray-500">
                      ({item.name})
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <NutritionPanel itemId={item.id} itemName={item.name} />
              </DialogContent>
            </Dialog>
          </div>

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
};

export default MenuGrid;