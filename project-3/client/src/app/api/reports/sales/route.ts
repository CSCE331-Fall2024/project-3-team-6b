// src/app/api/reports/sales/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: Request) {
    try {
      const { startDate, endDate } = await req.json();
  
      // Validate dates
      if (!startDate || !endDate) {
        return NextResponse.json({
          error: 'Start date and end date are required',
          data: null
        }, { status: 400 });
      }
  
      // Get sales data with multiple breakdowns
      const [salesSummary, itemizedSales, dailySales] = await Promise.all([
        executeQuery(`
          SELECT 
            COALESCE(SUM(sale), 0) as total_sales,
            COUNT(*) as total_orders,
            CASE 
              WHEN COUNT(*) > 0 THEN COALESCE(SUM(sale), 0) / COUNT(*)
              ELSE 0 
            END as average_order_value,
            MIN(sale) as min_order_value,
            MAX(sale) as max_order_value
          FROM orders 
          WHERE datetime BETWEEN $1 AND $2
        `, [startDate, endDate]),
  
        executeQuery(`
          SELECT 
            i.name,
            i.type,
            COUNT(*) as quantity_sold,
            COALESCE(SUM(o.sale / NULLIF(
              (SELECT COUNT(*) FROM order_items oi2 WHERE oi2.order_id = o.id), 0
            )), 0) as estimated_sales
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          JOIN (
            SELECT id, name, 'Entree' as type FROM entree_side WHERE type = true
            UNION ALL
            SELECT id, name, 'Side' as type FROM entree_side WHERE type = false
            UNION ALL
            SELECT id, name, 'Drink' as type FROM drink_table
            UNION ALL
            SELECT id, name, 'Appetizer' as type FROM appetizers
          ) i ON oi.item_id = i.id
          WHERE datetime BETWEEN $1 AND $2
          GROUP BY i.name, i.type
          ORDER BY quantity_sold DESC
        `, [startDate, endDate]),
  
        executeQuery(`
          SELECT 
            DATE(datetime) as sale_date,
            COUNT(*) as num_orders,
            COALESCE(SUM(sale), 0) as daily_total
          FROM orders
          WHERE datetime BETWEEN $1 AND $2
          GROUP BY DATE(datetime)
          ORDER BY sale_date
        `, [startDate, endDate])
      ]);
  
      const responseData = {
        date_range: {
          start: startDate,
          end: endDate
        },
        summary: {
          total_sales: parseFloat(salesSummary[0]?.total_sales ?? '0'),
          total_orders: parseInt(salesSummary[0]?.total_orders ?? '0'),
          average_order_value: parseFloat(salesSummary[0]?.average_order_value ?? '0'),
          min_order_value: parseFloat(salesSummary[0]?.min_order_value ?? '0'),
          max_order_value: parseFloat(salesSummary[0]?.max_order_value ?? '0')
        },
        itemized_sales: itemizedSales.map(row => ({
          name: row.name,
          type: row.type,
          quantity_sold: parseInt(row.quantity_sold),
          sales: parseFloat(row.estimated_sales)
        })),
        daily_sales: dailySales.map(row => ({
          date: row.sale_date,
          num_orders: parseInt(row.num_orders),
          total: parseFloat(row.daily_total)
        }))
      };
  
      return NextResponse.json(responseData);
  
    } catch (error) {
      console.error('Error generating sales report:', error);
      return NextResponse.json({
        error: 'Failed to generate sales report',
        data: null
      }, { status: 500 });
    }
  }