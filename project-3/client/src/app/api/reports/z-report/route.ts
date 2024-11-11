// src/app/api/reports/z-report/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
    try {
      // Get daily totals with detailed breakdowns
      const [totals, itemSales, categorySales] = await Promise.all([
        executeQuery(`
          SELECT 
            COALESCE(SUM(sale), 0) as total_sales,
            COUNT(*) as total_orders,
            CASE 
              WHEN COUNT(*) > 0 THEN COALESCE(SUM(sale), 0) / COUNT(*)
              ELSE 0 
            END as average_order_value
          FROM orders 
          WHERE DATE(datetime) = CURRENT_DATE
        `),
        executeQuery(`
          SELECT 
            i.name,
            COUNT(*) as quantity,
            COALESCE(SUM(o.sale / NULLIF(
              (SELECT COUNT(*) FROM order_items oi2 WHERE oi2.order_id = o.id), 0
            )), 0) as estimated_sales
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          JOIN (
            SELECT id, name, 'entree' as type FROM entree_side WHERE type = true
            UNION ALL
            SELECT id, name, 'side' as type FROM entree_side WHERE type = false
            UNION ALL
            SELECT id, name, 'drink' as type FROM drink_table
            UNION ALL
            SELECT id, name, 'appetizer' as type FROM appetizers
          ) i ON oi.item_id = i.id
          WHERE DATE(o.datetime) = CURRENT_DATE
          GROUP BY i.name, i.type
          ORDER BY quantity DESC
        `),
        executeQuery(`
          SELECT 
            CASE 
              WHEN es.type = true THEN 'Entrees'
              WHEN es.type = false THEN 'Sides'
              ELSE category
            END as category,
            COUNT(*) as items_sold,
            COALESCE(SUM(o.sale / NULLIF(
              (SELECT COUNT(*) FROM order_items oi2 WHERE oi2.order_id = o.id), 0
            )), 0) as category_sales
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          LEFT JOIN entree_side es ON oi.item_id = es.id
          LEFT JOIN (
            SELECT id, 'Drinks' as category FROM drink_table
            UNION ALL
            SELECT id, 'Appetizers' as category FROM appetizers
          ) cats ON oi.item_id = cats.id
          WHERE DATE(o.datetime) = CURRENT_DATE
          GROUP BY 
            CASE 
              WHEN es.type = true THEN 'Entrees'
              WHEN es.type = false THEN 'Sides'
              ELSE category
            END
          ORDER BY items_sold DESC
        `)
      ]);
  
      const responseData = {
        report_date: new Date().toISOString(),
        summary: {
          total_sales: parseFloat(totals[0]?.total_sales ?? '0'),
          total_orders: parseInt(totals[0]?.total_orders ?? '0'),
          average_order_value: parseFloat(totals[0]?.average_order_value ?? '0')
        },
        items_sold: itemSales.map(row => ({
          name: row.name,
          quantity: parseInt(row.quantity),
          sales: parseFloat(row.estimated_sales)
        })),
        category_summary: categorySales.map(row => ({
          category: row.category,
          items_sold: parseInt(row.items_sold),
          sales: parseFloat(row.category_sales)
        }))
      };
  
      return NextResponse.json(responseData);
  
    } catch (error) {
      console.error('Error generating Z report:', error);
      return NextResponse.json({
        error: 'Failed to generate Z report',
        report_date: new Date().toISOString(),
        summary: {
          total_sales: 0,
          total_orders: 0,
          average_order_value: 0
        },
        items_sold: [],
        category_summary: []
      }, { status: 500 });
    }
  }
  