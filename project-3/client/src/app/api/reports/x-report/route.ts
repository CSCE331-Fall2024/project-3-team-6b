// src/app/api/reports/x-report/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const hourly_sales = await executeQuery(`
      SELECT 
        EXTRACT(HOUR FROM datetime) as hour,
        COALESCE(SUM(sale), 0) as total_sales,
        COUNT(*) as num_orders
      FROM orders 
      WHERE DATE(datetime) = CURRENT_DATE 
      GROUP BY EXTRACT(HOUR FROM datetime) 
      ORDER BY hour
    `);

    if (!hourly_sales.length) {
      // Return structured data even when no sales
      return NextResponse.json({
        hourly_sales: [],
        summary: {
          total_sales: 0,
          total_orders: 0,
          average_order_value: 0
        }
      });
    }

    // Calculate summary statistics
    const summary = await executeQuery(`
      SELECT 
        COALESCE(SUM(sale), 0) as total_sales,
        COUNT(*) as total_orders,
        CASE 
          WHEN COUNT(*) > 0 THEN COALESCE(SUM(sale), 0) / COUNT(*)
          ELSE 0 
        END as average_order_value
      FROM orders 
      WHERE DATE(datetime) = CURRENT_DATE
    `);

    const formattedData = {
      hourly_sales: hourly_sales.map(row => ({
        hour: parseInt(row.hour),
        total_sales: parseFloat(row.total_sales),
        num_orders: parseInt(row.num_orders)
      })),
      summary: {
        total_sales: parseFloat(summary[0].total_sales),
        total_orders: parseInt(summary[0].total_orders),
        average_order_value: parseFloat(summary[0].average_order_value)
      }
    };

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Error generating X report:', error);
    return NextResponse.json({
      error: 'Failed to generate X report',
      hourly_sales: [],
      summary: {
        total_sales: 0,
        total_orders: 0,
        average_order_value: 0
      }
    }, { status: 500 });
  }
}