// client/src/components/cashier/OrderList.tsx
import { Order } from '@/types';
import { format } from 'date-fns';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onSelectOrder: (order: Order) => void;
}

export default function OrderList({ orders, onUpdateStatus, onSelectOrder }: OrderListProps) {
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getNextStatus = (currentStatus: Order['status']) => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed'
    } as const;

    return statusFlow[currentStatus as keyof typeof statusFlow] || null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
      <div className="space-y-4">
        {orders
          .filter(order => order.status !== 'completed' && order.status !== 'cancelled')
          .map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                Created: {format(new Date(order.createdAt), 'MMM d, h:mm a')}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder(order);
                  }}
                  className="text-sm text-[var(--panda-red)] hover:text-[var(--panda-dark-red)]"
                >
                  View Details
                </button>
                {getNextStatus(order.status) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextStatus = getNextStatus(order.status);
                      if (nextStatus) {
                        onUpdateStatus(order.id, nextStatus);
                      }
                    }}
                    className="btn-primary text-sm py-1"
                  >
                    Mark as {getNextStatus(order.status)}
                  </button>
                )}
              </div>

              {order.status === 'pending' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(order.id, 'cancelled');
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
      </div>
      
      {orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled').length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No active orders
        </div>
      )}
    </div>
  );
}