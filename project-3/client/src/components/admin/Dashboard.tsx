// client/src/components/admin/Dashboard.tsx
interface DashboardProps {
    stats: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      popularItems: Array<{
        name: string;
        quantity: number;
        revenue: number;
      }>;
    };
  }
  
  export default function Dashboard({ stats }: DashboardProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
  
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
  
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-600">Average Order Value</h3>
          <p className="text-3xl font-bold mt-2">
            ${stats.averageOrderValue.toFixed(2)}
          </p>
        </div>
  
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-600">Most Popular Item</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.popularItems[0]?.name || 'N/A'}
          </p>
        </div>
  
        <div className="col-span-full">
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Item Name</th>
                    <th className="text-right p-2">Quantity Sold</th>
                    <th className="text-right p-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.popularItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.name}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }