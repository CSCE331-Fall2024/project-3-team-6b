// client/src/components/cashier/Checkout.tsx
import { useState } from 'react';
import { MenuItem, Order, OrderItem } from '@/types';

interface CheckoutProps {
  menuItems: MenuItem[];
  onCreateOrder: (order: Partial<Order>) => void;
  activeOrder: Order | null;
}

export default function Checkout({ menuItems, onCreateOrder, activeOrder }: CheckoutProps) {
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const TAX_RATE = 0.0825; // 8.25% tax rate

  const addItem = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      setSelectedItems(prev =>
        prev.map(item =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems(prev => [...prev, {
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price
      }]);
    }
  };

  const removeItem = (menuItemId: string) => {
    setSelectedItems(prev =>
      prev.filter(item => item.menuItemId !== menuItemId)
    );
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(menuItemId);
      return;
    }

    setSelectedItems(prev =>
      prev.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const handleCheckout = () => {
    const { subtotal, tax, total } = calculateTotals();
    onCreateOrder({
      items: selectedItems,
      subtotal,
      tax,
      total,
      status: 'pending'
    });
    setSelectedItems([]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 mb-6">
        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              disabled={!item.available}
              className={`p-4 rounded-lg text-left transition-all ${
                item.available
                  ? 'bg-white hover:shadow-md'
                  : 'bg-gray-100 cursor-not-allowed'
              }`}
            >
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Current Order</h2>
        {selectedItems.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {selectedItems.map((item) => (
                <div key={item.menuItemId} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotals().subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${calculateTotals().tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotals().total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full mt-6"
            >
              Complete Order
            </button>
          </>
        ) : (
          <p className="text-gray-500">No items selected</p>
        )}
      </div>
    </div>
  );
}