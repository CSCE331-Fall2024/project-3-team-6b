// src/app/api/reports/product-usage/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();

    const [entrees, sides, drinks, appetizers] = await Promise.all([
      executeQuery(`
        SELECT i.name, COUNT(*) as total_used
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN entree_side i ON oi.item_id = i.id
        WHERE o.datetime BETWEEN $1 AND $2
        AND i.type = true
        GROUP BY i.name
        ORDER BY total_used DESC
      `, [startDate, endDate]),

      executeQuery(`
        SELECT i.name, COUNT(*) as total_used
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN entree_side i ON oi.item_id = i.id
        WHERE o.datetime BETWEEN $1 AND $2
        AND i.type = false
        GROUP BY i.name
        ORDER BY total_used DESC
      `, [startDate, endDate]),

      executeQuery(`
        SELECT i.name, COUNT(*) as total_used
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN drink_table i ON oi.item_id = i.id
        WHERE o.datetime BETWEEN $1 AND $2
        GROUP BY i.name
        ORDER BY total_used DESC
      `, [startDate, endDate]),

      executeQuery(`
        SELECT i.name, COUNT(*) as total_used
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN appetizers i ON oi.item_id = i.id
        WHERE o.datetime BETWEEN $1 AND $2
        GROUP BY i.name
        ORDER BY total_used DESC
      `, [startDate, endDate])
    ]);

    return NextResponse.json({
      entrees: entrees.map(row => ({
        name: row.name,
        usage: parseInt(row.total_used)
      })),
      sides: sides.map(row => ({
        name: row.name,
        usage: parseInt(row.total_used)
      })),
      drinks: drinks.map(row => ({
        name: row.name,
        usage: parseInt(row.total_used)
      })),
      appetizers: appetizers.map(row => ({
        name: row.name,
        usage: parseInt(row.total_used)
      }))
    });

  } catch (error) {
    console.error('Error generating product usage report:', error);
    return NextResponse.json(
      { error: 'Failed to generate product usage report' },
      { status: 500 }
    );
  }
}