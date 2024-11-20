// src/types/index.ts

export interface ComboComponent {
    menuItemId: string;
    name: string;
    quantity: number;
    category: 'entree' | 'side';
  }
  
  export interface OrderItem {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    category: 'entree' | 'side' | 'drink' | 'appetizer' | 'combo';
    components?: ComboComponent[]; // For combo items
  }
  
  export interface Order {
    id?: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    tip?: number;
    total: number;
    status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    createdAt?: string;
  }

  export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'combo' | 'entree' | 'side' | 'drink' | 'appetizer';
    imageUrl: string;
    available: boolean;
    selectedSide?: MenuItem;
    selectedEntrees?: MenuItem[];
  }

  export interface Employee {
    employee_id: string;
    name: string;
    salary: number;
    position: string;
  }
  