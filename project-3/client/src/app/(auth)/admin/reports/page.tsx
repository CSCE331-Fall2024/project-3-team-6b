// src/app/(auth)/admin/reports/page.tsx
'use client';

import { useState } from 'react';
import { Calendar, BarChart3, DollarSign, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

interface SalesData {
  itemized_sales: Array<{
    name: string;
    type: string;
    quantity_sold: number;
    sales: number;
  }>;
  summary: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
  };
  daily_sales?: Array<{
    date: string;
    num_orders: number;
    total: number;
  }>;
}

interface ProductUsageData {
  entrees: Array<{ name: string; usage: number; }>;
  sides: Array<{ name: string; usage: number; }>;
  drinks: Array<{ name: string; usage: number; }>;
  appetizers: Array<{ name: string; usage: number; }>;
}

interface XReportData {
  hourly_sales: Array<{
    hour: number;
    total_sales: number;
    num_orders: number;
  }>;
  summary: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
  };
}

interface ZReportData {
  summary: {
    total_sales: number;
    total_orders: number;
  };
  items_sold: Array<{
    name: string;
    quantity: number;
  }>;
}

type ReportData = SalesData | ProductUsageData | XReportData | ZReportData | null;

const SalesReportsPage = () => {
  const [activeTab, setActiveTab] = useState('product-usage');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const renderProductUsageChart = (data: ProductUsageData) => {
    if (!data) return null;
    const categories = ['entrees', 'sides', 'drinks', 'appetizers'] as const;
    
    return (
      <div className="space-y-8">
        {categories.map(category => (
          <div key={category} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 capitalize">{category} Usage</h3>
             {/* Increased height to accommodate labels */}
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data[category]}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 100  // Increased bottom margin for labels
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}  // Increased height for labels
                  interval={0}
                  tick={{
                    fontSize: 12,
                    dy: 3  // Adjust vertical position of labels
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="usage" 
                  fill="#ED1C24" 
                  name="Usage Count"
                  maxBarSize={100}  // Control maximum bar width
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

  const renderXReport = (data: XReportData) => {
    if (!data?.hourly_sales) return null;

    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Total Sales</h4>
            <p className="text-2xl font-bold text-[var(--panda-red)]">
              ${data.summary.total_sales.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Orders</h4>
            <p className="text-2xl font-bold text-[var(--panda-red)]">
              {data.summary.total_orders}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Average Order</h4>
            <p className="text-2xl font-bold text-[var(--panda-red)]">
              ${data.summary.average_order_value.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Hourly Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Hourly Sales</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hourly_sales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "total_sales") return `$${Number(value).toFixed(2)}`;
                    return value;
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="total_sales" 
                  fill="#ED1C24" 
                  name="Sales ($)" 
                />
                <Bar 
                  yAxisId="right"
                  dataKey="num_orders" 
                  fill="#4B5563" 
                  name="Orders" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderZReport = (data: ZReportData) => {
    if (!data?.summary) return null;

    return (
      <div className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Total Sales</h4>
            <p className="text-3xl font-bold text-[var(--panda-red)]">
              ${data.summary.total_sales.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Total Orders</h4>
            <p className="text-3xl font-bold text-[var(--panda-red)]">
              {data.summary.total_orders}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Items Sold</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.items_sold.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSalesReport = (data: SalesData) => {
    if (!data?.itemized_sales) return null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Total Sales</h4>
            <p className="text-2xl font-bold text-[var(--panda-red)]">
              ${data.summary.total_sales.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Total Orders</h4>
            <p className="text-2xl font-bold text-[var(--panda-red)]">
              {data.summary.total_orders}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Average Order</h4>
            <p className="text-2xl font-bold text-[var(--panda-red)]">
              ${data.summary.average_order_value.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.itemized_sales.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity_sold}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${item.sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Sales Chart */}
        {data.daily_sales && data.daily_sales.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Daily Sales Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily_sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "total") return `$${Number(value).toFixed(2)}`;
                      return value;
                    }}
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="total" 
                    fill="#ED1C24" 
                    name="Sales ($)" 
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="num_orders" 
                    fill="#4B5563" 
                    name="Orders" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'product-usage':
          response = await fetch('/api/reports/product-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate }),
          });
          break;
        case 'x-report':
          response = await fetch('/api/reports/x-report');
          break;
        case 'z-report':
          response = await fetch('/api/reports/z-report');
          break;
        case 'sales-report':
          response = await fetch('/api/reports/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate }),
          });
          break;
      }

      if (response?.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        console.error('Failed to fetch report data');
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--panda-red)]"></div>
        </div>
      );
    }

    const needsDateRange = activeTab === 'product-usage' || activeTab === 'sales-report';

    return (
      <div className="space-y-4">
        {needsDateRange && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--panda-red)] focus:ring-[var(--panda-red)]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--panda-red)] focus:ring-[var(--panda-red)]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleGenerateReport}
          className="btn-primary w-full"
          disabled={needsDateRange && (!startDate || !endDate)}
        >
          Generate {activeTab === 'product-usage' ? 'Product Usage Report' : 
                    activeTab === 'x-report' ? 'X-Report' :
                    activeTab === 'z-report' ? 'Z-Report' : 'Sales Report'}
        </button>

        {reportData && (
          <div className="mt-6">
            {activeTab === 'product-usage' && renderProductUsageChart(reportData as ProductUsageData)}
            {activeTab === 'x-report' && renderXReport(reportData as XReportData)}
            {activeTab === 'z-report' && renderZReport(reportData as ZReportData)}
            {activeTab === 'sales-report' && renderSalesReport(reportData as SalesData)}
          </div>
        )}
      </div>
    );
  };

  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Add this button */}
      <button
        onClick={() => router.push('/admin')}
        className="mb-6 flex items-center text-[var(--panda-red)] hover:text-[var(--panda-dark-red)]"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
            clipRule="evenodd" 
          />
        </svg>
        Back to Dashboard
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sales Reports</h1>
        <p className="text-gray-600 mt-2">Generate and view various sales reports</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => {
            setActiveTab('product-usage');
            setReportData(null);
          }}
          className={`p-4 rounded-lg flex flex-col items-center ${
            activeTab === 'product-usage' ? 'bg-[var(--panda-red)] text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="h-6 w-6 mb-2" />
          <span>Product Usage</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('x-report');
            setReportData(null);
          }}
          className={`p-4 rounded-lg flex flex-col items-center ${
            activeTab === 'x-report' ? 'bg-[var(--panda-red)] text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <Calendar className="h-6 w-6 mb-2" />
          <span>X-Report</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('z-report');
            setReportData(null);
          }}
          className={`p-4 rounded-lg flex flex-col items-center ${
            activeTab === 'z-report' ? 'bg-[var(--panda-red)] text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <ClipboardList className="h-6 w-6 mb-2" />
          <span>Z-Report</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('sales-report');
            setReportData(null);
          }}
          className={`p-4 rounded-lg flex flex-col items-center ${
            activeTab === 'sales-report' ? 'bg-[var(--panda-red)] text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <DollarSign className="h-6 w-6 mb-2" />
          <span>Sales Report</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default SalesReportsPage;
                