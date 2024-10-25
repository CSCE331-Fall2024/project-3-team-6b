// client/src/types/index.ts
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'entree' | 'side' | 'drink' | 'appetizer' | 'combo';
    imageUrl: string;
    available: boolean;
  }
  
  export interface OrderItem {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: string;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    cashierId: string;
    createdAt: string;
  }
  
  export interface User {
    id: string;
    username: string;
    role: 'admin' | 'cashier';
    name: string;
  }