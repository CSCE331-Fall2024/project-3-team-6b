"use client";

export default function ManagerPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold">Orders</h2>
          <p className="text-gray-500">View and manage all orders.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Inventory</h2>
          <p className="text-gray-500">Update stock levels and manage products.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Sales Reports</h2>
          <p className="text-gray-500">Generate and view sales analytics.</p>
        </section>
      </div>
    </div>
  );
}
