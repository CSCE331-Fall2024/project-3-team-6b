// src/app/order-confirmation/[orderId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // You could fetch order details here if needed
    setOrderDetails({
      orderId: params.orderId,
      timestamp: new Date().toLocaleString()
    });
  }, [params.orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Order Confirmed!
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Thank you for your order. Your order number is #{params.orderId}
        </p>
        <div className="mt-8">
          <button
            onClick={() => router.push('/cart')}
            className="bg-[var(--panda-red)] text-white px-6 py-3 rounded-md hover:bg-[var(--panda-dark-red)] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}