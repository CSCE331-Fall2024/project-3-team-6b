// client/src/app/(auth)/cashier/page.tsx
'use client';

import { useState, useEffect } from 'react';
import OrderList from '@/components/cashier/OrderList';
import EnhancedCheckout from '@/components/cashier/Checkout';
import Checkout from '@/components/cashier/Checkout';
import { MenuItem, Order } from '@/types';
import { fetchMenuItems } from '@/utils/menuItems'
import api from "@/lib/api";

export default function CashierPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    // Temporary data for testing
    const dummyData: MenuItem[] = [
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
      },
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
      
    ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        /*const [ordersRes, menuRes] = await Promise.all([
          api.get('/orders/active'),
          api.get('/menu')
        ]);

        setOrders(ordersRes.data);
        setMenuItems(menuRes.data); */
        //setMenuItems(dummyData);
        const items = await fetchMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCreateOrder = async (order: Partial<Order>) => {
    try {
      const response = await api.post('/orders', order);
      setOrders(prev => [...prev, response.data]);
      setActiveOrder(response.data);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--panda-red)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <EnhancedCheckout
        menuItems={menuItems}
        onCreateOrder={handleCreateOrder}
        activeOrder={null}
      />
    </div>
  );

}