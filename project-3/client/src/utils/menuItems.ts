import { MenuItem } from '@/types';


// Capitalizes the first letter of each word in a string
const capitalizeWords = (str: string): string => {
  return str
    .split(' ') // Split the string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join the words back into a string
};

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
    // Initialize populatedItems with the combo items already included
    const populatedItems: MenuItem[] = [
      {
        id: '41',
        name: 'Bowl',
        description: '1 Side & 1 Entree',
        price: 8.30,
        category: 'combo',
        imageUrl: '/images/combos/bowl.png',
        available: true
      },
      {
        id: '42',
        name: 'Plate',
        description: '1 Side & 2 Entrees',
        price: 9.80,
        category: 'combo',
        imageUrl: '/images/combos/plate.png',
        available: true
      },
      {
        id: '43',
        name: 'Bigger Plate',
        description: '1 Side & 3 Entrees',
        price: 11.30,
        category: 'combo',
        imageUrl: '/images/combos/biggerPlate.png',
        available: true
      }
    ];

    // Define the remaining static items without prices
    const staticItems: Omit<MenuItem, 'price'>[] = [
      {
        id: '1',
        name: 'The Original Orange Chicken',
        description: 'Crispy chicken wok-tossed in a sweet and spicy orange sauce',
        category: 'entree',
        imageUrl: '/images/entrees/the_original_orange_chicken.png',
        available: true
      },
      {
        id: '2',
        name: 'Beijing Beef',
        description: 'Crispy beef wok-tossed with bell peppers and onions',
        category: 'entree',
        imageUrl: '/images/entrees/beijing_beef.png',
        available: true
      },
      {
        id: '3',
        name: 'Black Pepper Chicken',
        description: 'Marinated chicken, celery, and onions in a bold black pepper sauce',
        category: 'entree',
        imageUrl: '/images/entrees/black_pepper_chicken.png',
        available: true
      },
      {
        id: '4',
        name: 'Black Pepper Sirloin Steak',
        description: 'Sirloin steak wok-seared with baby broccoli, onions, red bell peppers, and mushrooms in a savory black pepper sauce',
        category: 'entree',
        imageUrl: '/images/entrees/black_pepper_sirloin_steak.png',
        available: true
      },
      {
        id: '5',
        name: 'Broccoli Beef',
        description: 'Tender beef and fresh broccoli in a ginger soy sauce',
        category: 'entree',
        imageUrl: '/images/entrees/broccoli_beef.png',
        available: true
      },
      {
        id: '6',
        name: 'Beijing Beef',
        description: 'Crispy beef wok-tossed with bell peppers and onions',
        category: 'entree',
        imageUrl: '/images/entrees/beijing_beef.png',
        available: true
      },
      {
        id: '7',
        name: 'Grilled Teriyaki Chicken',
        description: 'Grilled Chicken hand-sliced to order and served with teriyaki sauce',
        category: 'entree',
        imageUrl: '/images/entrees/grilled_teriyaki_chicken.png',
        available: true
      },
      {
        id: '8',
        name: 'Honey Sesame Chicken',
        description: 'Crispy strips of white-meat chicken with veggies ina mildly sweet sauce with organic honey',
        category: 'entree',
        imageUrl: '/images/entrees/honey_sesame_chicken_breast.png',
        available: true
      },
      {
        id: '9',
        name: 'Honey Walnut Shrimp',
        description: 'Large tempura-battered shrimp, work-tossed in a honey sauce and topped with glazed walnuts',
        category: 'entree',
        imageUrl: '/images/entrees/honey_walnut_shrimp.png',
        available: true
      },
      {
        id: '10',
        name: 'Hot Ones Blazing Bourbon Chicken',
        description: 'Crispy boneless chicken bites and veggies wok-tossed in an extra spicy and sweet bourbon sauce',
        category: 'entree',
        imageUrl: '/images/entrees/hot_ones_blazing_bourbon_chicken.png',
        available: true
      },
      {
        id: '11',
        name: 'Kung Pao Chicken',
        description: 'A Sichuan-inspired dish with chicken, peanuts and vegetables, finished with chili pepppers',
        category: 'entree',
        imageUrl: '/images/entrees/kung_pao_chicken.png',
        available: true
      },
      {
        id: '12',
        name: 'Mushroom Chicken',
        description: 'A delicate combination of chicken, mushrooms and zucchini wok-tossed with a light ginger soy sauce',
        category: 'entree',
        imageUrl: '/images/entrees/mushroom_chicken.png',
        available: true
      },
      {
        id: '13',
        name: 'String Bean Chicken',
        description: 'Chicken breast, string beans and onions wok-tossed in a mild ginger soy sauce',
        category: 'entree',
        imageUrl: '/images/entrees/string_bean_chicken_breast.png',
        available: true
      },
      {
        id: '14',
        name: 'SweetFire Chicken',
        description: 'Crispy, white-meat chicken, red bell peppers, onions and pineapples in a bright and sweet chili sauce',
        category: 'entree',
        imageUrl: '/images/entrees/sweetfire_chicken_breast.png',
        available: true
      },
      {
        id: '15',
        name: 'Chow Mein',
        description: 'Stir-fried wheat noodles with onions and celery',
        category: 'side',
        imageUrl: '/images/sides/chow_mein.png',
        available: true
      },
      {
        id: '16',
        name: 'Fried Rice',
        description: 'Prepared steamed white rice with soy sauce, eggs, peas, carrots and green onions',
        category: 'side',
        imageUrl: '/images/sides/fried_rice.png',
        available: true
      },
      {
        id: '17',
        name: 'Super Greens',
        description: 'A healthful medley of broccoli, kale, and cabbage',
        category: 'side',
        imageUrl: '/images/sides/super_greens.png',
        available: true
      },
      {
        id: '18',
        name: 'White Steamed Rice',
        description: 'White rice',
        category: 'side',
        imageUrl: '/images/sides/white_steamed_rice.png',
        available: true
      },
      {
        id: '19',
        name: 'Apple Pie Roll',
        description: 'Juicy apples and fall spices in a crispy rolled pastry, finished with cinnamon sugar',
        category: 'appetizer',
        imageUrl: '/images/appetizers/apple_pie_roll.png',
        available: true
      },
      {
        id: '20',
        name: 'Chicken Egg Roll',
        description: 'Cabbage, carrots, green onions and chicken in a crispy wonton wrapper',
        category: 'appetizer',
        imageUrl: '/images/appetizers/chicken_egg_roll.png',
        available: true
      },
      {
        id: '21',
        name: 'Cream Cheese Rangoon',
        description: 'Wonton wrappers filled with cream cheese and served with sweet and sour sauce',
        category: 'appetizer',
        imageUrl: '/images/appetizers/cream_cheese_rangoon.png',
        available: true
      },
      {
        id: '22',
        name: 'Veggie Egg Roll',
        description: 'Cabbage, celery, carrots, green onions and Chinese noodles in a crispy wonton wrapper',
        category: 'appetizer',
        imageUrl: '/images/appetizers/veggie_spring_roll.png',
        available: true
      },
      {
        id: '23',
        name: "Barq's Root Beer",
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/barqs_root_beer.png',
        available: true
      },
      {
        id: '24',
        name: 'Coca-Cola',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/coca_cola.png',
        available: true
      },      
      {
        id: '25',
        name: 'Coke Mexico 12oz Bottle',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/coke_mexico.png',
        available: true
      },
      {
        id: '26',
        name: 'Coke Zero 20oz Bottle',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/coke_zero.png',
        available: true
      },
      {
        id: '27',
        name: 'Dasani 16oz Bottle',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/dasani.png',
        available: true
      },
      {
        id: '28',
        name: 'Diet Coke',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/diet_coke.png',
        available: true
      },
      {
        id: '29',
        name: 'Dr. Pepper',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/dr_pepper.png',
        available: true
      },
      {
        id: '30',
        name: 'Fanta Orange',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/fanta_orange.png',
        available: true
      },
      {
        id: '31',
        name: 'Fuze Raspberry Iced Tea',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/fize_raspberry_iced_tea.png',
        available: true
      },
      {
        id: '32',
        name: 'Minute Maid Apple Juice 12oz Bottle',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/minute_maid_apple_juice.png',
        available: true
      },
      {
        id: '33',
        name: 'Minute Maid Lemonade',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/minute_maid_lemonade.png',
        available: true
      },
      {
        id: '34',
        name: 'Mango Guava Flavored Tea',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/passion_mango_black_tea.png',
        available: true
      },
      {
        id: '35',
        name: 'Peach Lychee Flavored Refresher',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/peach_lychee_flavored_refresher.png',
        available: true
      },
      {
        id: '36',
        name: 'Pomegranate Pineapple Flavored Lemonade',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/pomegranite_pineapple_flavored_lemonade.png',
        available: true
      },
      {
        id: '37',
        name: 'Smartwater 700ml Bottle',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/smartwater.png',
        available: true
      },
      {
        id: '38',
        name: 'Sprite',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/sprite.png',
        available: true
      },
      {
        id: '39',
        name: 'Watermelon Mango Flavored Refresher',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/watermelon_mango_flavored_refresher.png',
        available: true
      },
      {
        id: '40',
        name: 'Sprite',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/sprite.png',
        available: true
      },
      {
        id: '41',
        name: 'Powerade Mountain Berry Blast',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/powerade_berry_blast.png',
        available: true
      },
      {
        id: '42',
        name: 'Coca Cola Cherry',
        description: '',
        category: 'drink',
        imageUrl: '/images/drinks/coca_cola_cherry.png',
        available: true
      }

    ];
    try {
      // Fetch all menu items using the /items endpoint
      const response = await fetch(`http://localhost:4000/api/menu-items/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
  
      const allItems = await response.json(); // Assuming it returns an array of { name, category, price }
      console.log('API Response:', allItems);
      let idNum = 4;
      for (const item of allItems) {
        try {
          //console.log(`Fetching price for: ${item.name}, Category: ${item.category}`);
          const priceResponse = await fetch(
            `http://localhost:4000/api/menu-items/price?name=${item.name}&category=${item.category}`
          );

          if (!priceResponse.ok) {
            console.warn(`Price not found for ${item.name} (${item.category}).`);
            continue; // Skip this item if the price is unavailable
          }

          const priceData = await priceResponse.json();
          console.log(`Price data for ${item.name}:`, priceData);
  
          // Find a matching static item for description and imageUrl
          const staticItem = staticItems.find(
            (staticItem) =>
              staticItem.name.toLowerCase() === item.name.toLowerCase()
          );
          if (!staticItem) {
            console.warn(`No matching static item for ${item.name}`);
          }
          
          // Capitalize the item name
          const capitalizedName = capitalizeWords(item.name);

          // Determine the category based on priceData.type
          let category = item.category;
          if (priceData.type !== undefined) { //this means category is entree_side
            category = priceData.type ? "entree" : "side";
          }
          else if (item.category === "drink_table"){
            category = "drink";
          }
          else if (item.category === "appetizers"){
            category = "appetizer";
          }

          // Push the enriched item into populatedItems
          populatedItems.push({
            id: idNum.toString(), // You can set this dynamically if needed
            name: capitalizedName, // Use the capitalized name
            category,
            price: priceData.price || 0,
            description: staticItem?.description || '',
            imageUrl: staticItem?.imageUrl || '',
            available: true
          });
        } catch (error) {
          console.error(`Error fetching price for ${item.name}:`, error);
        }
        idNum += 1;
        if (idNum == 41){ //skip straight to 44 bc combos are 41-43
          idNum = 44;
        }
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  
    return populatedItems;
};

