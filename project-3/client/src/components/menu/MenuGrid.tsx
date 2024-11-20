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
  '5': 'broccoli-beef',
  '7': 'grilled-teriyaki-chicken',
  '8': 'honey-sesame-chicken-breast',
  '9': 'honey-walnut-shrimp',
  '10': 'hot-ones-blazing-bourbon-chicken',
  '11': 'kung-pao-chicken',
  '12': 'mushroom-chicken',
  '13': 'string-bean-chicken-breast',
  '14': 'sweetfire-chicken-breast',
  '15': 'chow-mein',
  '16': 'fried-rice',
  '17': 'super-greens',
  '18': 'steamed-rice',
  '19': 'apple-pie-roll',
  '20': 'chicken-egg-roll',
  '21': 'cream-cheese-rangoon',
  '22': 'veggie-spring-roll',
  '23': 'barqs-root-beer',
  '24': 'coca-cola',
  '25': 'coca-cola-cherry',
  '26': 'coke-zero',
  '27': 'dasani',
  '28': 'diet coke',
  '29': "dr-pepper",
  '30': 'fanta',
  '31': 'fuze-raspberry-iced-tea',
  '32': 'minute-maid-apple-juice',
  '33': 'minute-maid-lemonade',
  '34': 'mango-tea',
  '35': 'peach-lychee-refresher',
  '36': 'pomegranite-pineapple-flavored-lemonade',
  '37': 'smartwater',
  '38': 'sprite',
  '39': 'watermelon-mango-flavored-refresher',
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
  },
  'grilled-teriyaki-chicken': {
    servingSize: '6.3 oz',
    calories: 275,
    caloriesFromFat: 90,
    totalFat: 10,
    saturatedFat: 2,
    transFat: 0,
    cholesterol: 85,
    sodium: 680,
    totalCarbs: 14,
    dietaryFiber: 0,
    sugars: 8,
    protein: 33
  },
  'honey-sesame-chicken-breast': {
    servingSize: '5.7 oz', // Adjust as needed
    calories: 340,
    caloriesFromFat: 135,
    totalFat: 15,
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 75,
    sodium: 620,
    totalCarbs: 35,
    dietaryFiber: 2,
    sugars: 16,
    protein: 16
  },
  'honey-walnut-shrimp': {
    servingSize: '5.4 oz',
    calories: 360,
    caloriesFromFat: 216,
    totalFat: 24,
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 90,
    sodium: 500,
    totalCarbs: 27,
    dietaryFiber: 1,
    sugars: 15,
    protein: 11
  },
  'hot-ones-blazing-bourbon-chicken': {
    servingSize: '5.9 oz', // Adjust as needed
    calories: 300,
    caloriesFromFat: 90,
    totalFat: 10, // Approximate value based on saturated fat
    saturatedFat: 2,
    transFat: 0,
    cholesterol: 75,
    sodium: 720,
    totalCarbs: 37,
    dietaryFiber: 2,
    sugars: 12,
    protein: 15
  },
  'kung-pao-chicken': {
    servingSize: '5.6 oz', // Adjust as needed
    calories: 290,
    caloriesFromFat: 171,
    totalFat: 19,
    saturatedFat: 3.5,
    transFat: 0,
    cholesterol: 70,
    sodium: 970,
    totalCarbs: 14,
    dietaryFiber: 2,
    sugars: 6,
    protein: 16
  },
  'mushroom-chicken': {
    servingSize: '5.9 oz',
    calories: 220,
    caloriesFromFat: 120,
    totalFat: 13,
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 100,
    sodium: 760,
    totalCarbs: 9,
    dietaryFiber: 1,
    sugars: 4,
    protein: 17
  },
  'string-bean-chicken-breast': {
    servingSize: '5.6 oz',
    calories: 170,
    caloriesFromFat: 60,
    totalFat: 7,
    saturatedFat: 1.5,
    transFat: 0,
    cholesterol: 35,
    sodium: 740,
    totalCarbs: 13,
    dietaryFiber: 2,
    sugars: 5,
    protein: 15
  },
  'sweetfire-chicken-breast': {
    servingSize: '5.8 oz',
    calories: 440,
    caloriesFromFat: 160,
    totalFat: 18,
    saturatedFat: 3.5,
    transFat: 0,
    cholesterol: 45,
    sodium: 370,
    totalCarbs: 53,
    dietaryFiber: 1,
    sugars: 27,
    protein: 17
  },
  'chow-mein': {
    servingSize: '9.4 oz',
    calories: 500,
    caloriesFromFat: 210,
    totalFat: 23,
    saturatedFat: 4,
    transFat: 0,
    cholesterol: 0,
    sodium: 980,
    totalCarbs: 61,
    dietaryFiber: 4,
    sugars: 5,
    protein: 18
  },
  'fried-rice': {
    servingSize: '9.3 oz',
    calories: 530,
    caloriesFromFat: 140,
    totalFat: 16,
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 150,
    sodium: 820,
    totalCarbs: 82,
    dietaryFiber: 1,
    sugars: 3,
    protein: 12
  },
  'super-greens': {
    servingSize: '7 oz',
    calories: 90,
    caloriesFromFat: 27,
    totalFat: 3,
    saturatedFat: 0.5, 
    transFat: 0,
    cholesterol: 0,
    sodium: 300, 
    totalCarbs: 10,
    dietaryFiber: 4, 
    sugars: 3, 
    protein: 6
  },
  'steamed-rice': {
    servingSize: '8.1 oz',
    calories: 380,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbs: 86,
    dietaryFiber: 0,
    sugars: 0,
    protein: 7
  },
  'apple-pie-roll': {
    servingSize: '1.94 oz',
    calories: 150,
    caloriesFromFat: 27,
    totalFat: 3,
    saturatedFat: 1,
    transFat: 0,
    cholesterol: 0,
    sodium: 90,
    totalCarbs: 30,
    dietaryFiber: 1,
    sugars: 13,
    protein: 2
  },
  'chicken-egg-roll': {
    servingSize: '3.0 oz / 1 roll',
    calories: 200,
    caloriesFromFat: 100,
    totalFat: 12,
    saturatedFat: 4,
    transFat: 0,
    cholesterol: 20,
    sodium: 390,
    totalCarbs: 16,
    dietaryFiber: 2,
    sugars: 2,
    protein: 8
  },
  'cream-cheese-rangoon': {
    servingSize: '2.4 oz / 3 pcs',
    calories: 190,
    caloriesFromFat: 70,
    totalFat: 8,
    saturatedFat: 5,
    transFat: 0,
    cholesterol: 35,
    sodium: 180,
    totalCarbs: 24,
    dietaryFiber: 2,
    sugars: 1,
    protein: 5
  },
  'veggie-spring-roll': {
    servingSize: '3.4 oz / 2 rolls',
    calories: 160,
    caloriesFromFat: 60,
    totalFat: 7,
    saturatedFat: 1,
    transFat: 0,
    cholesterol: 0,
    sodium: 540,
    totalCarbs: 22,
    dietaryFiber: 4,
    sugars: 2,
    protein: 2
  },
  'barqs-root-beer': {
    servingSize: '12 fl oz',
    calories: 160,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 65,
    totalCarbs: 44,
    dietaryFiber: 0,
    sugars: 44,
    protein: 0
  },
  'coca-cola': {
    servingSize: '12 fl oz',
    calories: 140,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 45,
    totalCarbs: 39,
    dietaryFiber: 0,
    sugars: 39,
    protein: 0
  },
  'coca-cola-cherry': {
    servingSize: '12 fl oz',
    calories: 150,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 40,
    totalCarbs: 42,
    dietaryFiber: 0,
    sugars: 42,
    protein: 0
  },
  'coke-zero': {
    servingSize: '12 fl oz',
    calories: 0,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 40,
    totalCarbs: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 0
  },
  'dasani': {
    servingSize: '16.9 fl oz',
    calories: 0,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbs: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 0
  },
  'diet-coke': {
    servingSize: '12 fl oz',
    calories: 0,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 40,
    totalCarbs: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 0
  },
  'dr-pepper': {
    servingSize: '12 fl oz',
    calories: 150,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 55,
    totalCarbs: 40,
    dietaryFiber: 0,
    sugars: 40,
    protein: 0
  },
  'fanta': {
    servingSize: '12 fl oz',
    calories: 160,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 55,
    totalCarbs: 44,
    dietaryFiber: 0,
    sugars: 44,
    protein: 0
  },
  'fuze-raspberry-iced-tea': {
    servingSize: '16.9 fl oz',
    calories: 100,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 10,
    totalCarbs: 27,
    dietaryFiber: 0,
    sugars: 27,
    protein: 0
  },
  'minute-maid-apple-juice': {
    servingSize: '10 fl oz',
    calories: 140,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 15,
    totalCarbs: 35,
    dietaryFiber: 0,
    sugars: 34,
    protein: 0
  },
  'minute-maid-lemonade': {
    servingSize: '12 fl oz',
    calories: 150,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 15,
    totalCarbs: 39,
    dietaryFiber: 0,
    sugars: 38,
    protein: 0
  },
  'mango-tea': {
    servingSize: '16 fl oz',
    calories: 120,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 10,
    totalCarbs: 30,
    dietaryFiber: 0,
    sugars: 28,
    protein: 0
  },
  'peach-lychee-refresher': {
    servingSize: '16 fl oz',
    calories: 140,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 20,
    totalCarbs: 35,
    dietaryFiber: 0,
    sugars: 33,
    protein: 0
  },
  'pomegranite-pineapple-flavored-lemonade': {
    servingSize: '16 fl oz',
    calories: 150,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 15,
    totalCarbs: 39,
    dietaryFiber: 0,
    sugars: 38,
    protein: 0
  },
  'smartwater': {
    servingSize: '16.9 fl oz',
    calories: 0,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbs: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 0
  },
  'sprite': {
    servingSize: '12 fl oz',
    calories: 140,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 65,
    totalCarbs: 38,
    dietaryFiber: 0,
    sugars: 38,
    protein: 0
  },
  'watermelon-mango-flavored-refresher': {
    servingSize: '16 fl oz',
    calories: 140,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 20,
    totalCarbs: 36,
    dietaryFiber: 0,
    sugars: 35,
    protein: 0
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
    <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-lg shadow-md">
      {nutritionItems.map((item) => (
        <div key={item.label} className="p-3 rounded-lg border border-gray-200">
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
          {/* Conditionally render the Dialog only for items that are not Bowl, Plate, or Bigger Plate */}
          {item.name !== 'Bowl' && item.name !== 'Plate' && item.name !== 'Bigger Plate' && (
            <div className="absolute top-2 right-2 z-10">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="p-1 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all shadow-md">
                    <Info className="h-5 w-5 text-gray-600 hover:text-[var(--panda-red)]" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
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
          )}

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
              ${Number(item.price).toFixed(2)}
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