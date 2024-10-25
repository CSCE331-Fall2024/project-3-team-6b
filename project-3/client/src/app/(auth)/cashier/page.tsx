// client/src/app/(auth)/cashier/page.tsx
'use client';

import { useState, useEffect } from 'react';
import OrderList from '@/components/cashier/OrderList';
import Checkout from '@/components/cashier/Checkout';
import { MenuItem, Order } from '@/types';
import { api } from '@/lib/api';

export default function CashierPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          api.get('/orders/active'),
          api.get('/menu')
        ]);
        
        setOrders(ordersRes.data);
        setMenuItems(menuRes.data);
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
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <div className="lg:w-2/3">
        <Checkout
          menuItems={menuItems}
          onCreateOrder={handleCreateOrder}
          activeOrder={activeOrder}
        />
      </div>
      <div className="lg:w-1/3">
        <OrderList
          orders={orders}
          onUpdateStatus={handleUpdateOrderStatus}
          onSelectOrder={setActiveOrder}
        />
      </div>
    </div>
  );
}