'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function ManagerPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const handleButtonClick = (action: string) => {
    if (action === 'Update Menu Items and Inventory') {
      router.push('/admin/update-inventory'); // navigate to the new page
    } 
    else if (action === 'View Sales Reports') {
      router.push('/admin/reports'); // navigate to the new page
    }
    else if (action === 'Manage Staff'){
      router.push('/admin/employees');
    }
    else {
      setMessage(`You clicked "${action}"!`);
      setTimeout(() => setMessage(null), 3000);
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          className="dashboard-card p-4 bg-[var(--panda-red)] text-white rounded-lg shadow hover:bg-red-600"
          onClick={() => handleButtonClick('View Sales Reports')}
        >
          View Sales Reports
        </button>



        <button
          className="dashboard-card p-4 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
          onClick={() => handleButtonClick('Update Menu Items and Inventory')}
        >
          Update Menu Items and Inventory
        </button>

        <button
          className="dashboard-card p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          onClick={() => handleButtonClick('Manage Staff')}
        >
          Manage Staff
        </button>


        {/* <button
          className="dashboard-card p-4 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
          onClick={() => handleButtonClick('Update Menu Items')}
        >
          Update Menu Items
        </button> */}
      </div>

      {message && (
        <div className="mt-8 p-4 bg-green-100 text-green-800 rounded shadow">
          {message}
        </div>
      )}
    </div>
  );
}
