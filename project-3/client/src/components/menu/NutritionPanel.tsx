import React from 'react';

const nutritionData: { [key: string]: NutritionInfo } = {
    'the-original-orange-chicken': {
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
      protein: 15,
      allergens: ['Wheat', 'Soy', 'Eggs', 'Milkyhg'] 
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
      protein: 26,
      allergens: ['Wheat', 'Soy', 'Milk'] 
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
      protein: 10,
      allergens: ['Wheat', 'Soy'] 
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
      protein: 19,
      allergens: ['Wheat', 'Soy'] 
    },
    'black-pepper-sirloin-steak': {
    servingSize: '6.1 oz', 
    calories: 210,
    caloriesFromFat: 90, 
    totalFat: 10,
    saturatedFat: 2, 
    transFat: 0,
    cholesterol: 65, 
    sodium: 650, 
    totalCarbs: 13,
    dietaryFiber: 1,
    sugars: 2, 
    protein: 19,
    allergens: ['Wheat', 'Soy'] 
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
      protein: 33,
      allergens: ['Wheat', 'Soy'] 
    },
    'honey-sesame-chicken': {
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
      protein: 16,
      allergens: ['Wheat', 'Soy'] 
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
      protein: 11,
      allergens: ['Wheat', 'Soy', 'Treenuts'] 
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
      protein: 15,
      allergens: ['Wheat', 'Soy'] 
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
      protein: 16,
      allergens: ['Wheat', 'Soy', 'Peanuts'] 
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
      protein: 17,
      allergens: ['Wheat', 'Soy'] 
    },
    'string-bean-chicken': {
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
      protein: 15,
      allergens: ['Wheat', 'Soy'] 
    },
    'sweetfire-chicken': {
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
      protein: 17,
      allergens: ['Wheat', 'Soy'] 
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
      protein: 18,
      allergens: ['Wheat', 'Soy'] 
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
      protein: 12,
      allergens: ['Wheat', 'Soy', 'Eggs'] 
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
      protein: 6,
      allergens: ['Wheat', 'Soy'] 
    },
    'white-steamed-rice': {
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
      protein: 2,
      allergens: ['Wheat', 'Soy', 'Milk'] 
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
      protein: 8,
      allergens: ['Wheat', 'Soy'] 
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
      protein: 5,
      allergens: ['Wheat', 'Eggs', 'Milk'] 
    },
    'veggie-egg-roll': {
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
      protein: 2,
      allergens: ['Wheat', 'Soy', 'Milk'] 
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
    'coke-zero-20oz-bottle': {
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
    'dasani-16oz-bottle': {
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
    'fanta-orange': {
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
    'minute-maid-apple-juice-12oz-bottle': {
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
    'mango-guava-flavored-tea': {
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
    'peach-lychee-flavored-refresher': {
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
    'pomegranate-pineapple-flavored-lemonade': {
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
    'smartwater-700ml-bottle': {
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
    },
    'powerade-mountain-berry-blast': {
    servingSize: '12 fl oz',
    calories: 80,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 150, // Typical for electrolyte drinks
    totalCarbs: 21,
    dietaryFiber: 0,
    sugars: 21,
    protein: 0
  },
  'coke-mexico-12oz-bottle': {
    servingSize: '12 fl oz',
    calories: 150,
    caloriesFromFat: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 85,
    totalCarbs: 39,
    dietaryFiber: 0,
    sugars: 39,
    protein: 0
  }
  };

  const normalizeName = (name: string): string => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
  };
  
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
    allergens?: string[]; // Optional property for allergens
  }
  
  const NutritionPanel = ({ itemName }: { itemName: string }) => {
    console.log("NutritionPanel itemName:", itemName);
  
    const nutritionKey = normalizeName(itemName);
    console.log("Mapped nutritionKey:", nutritionKey);
  
    const nutrition = nutritionData[nutritionKey];
    console.log("Nutrition data accessed:", nutrition);
  
    if (!nutrition) {
      console.error("Nutrition information not found for key:", nutritionKey);
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
  
        {nutrition.allergens && (
          <div className="col-span-2 text-red-500 font-semibold mt-3">
            <p>Allergen Warning: {nutrition.allergens.join(', ')}</p>
          </div>
        )}
  
        <div className="col-span-2 text-xs text-gray-500 mt-2">
          * Percent Daily Values are based on a 2,000 calorie diet.
        </div>
      </div>
    );
  };
  
  export default NutritionPanel;

  