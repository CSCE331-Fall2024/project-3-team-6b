// src/app/api/reports/z-report/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
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

      // Modified to properly extract and count individual items from combos
      executeQuery(`
        WITH RECURSIVE extracted_items AS (
          -- First, get all regular items and their quantities
          SELECT 
            o.id as order_id,
            o.sale as order_total,
            LOWER(i->>'name') as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'entree_side') as i
          WHERE DATE(o.datetime) = CURRENT_DATE
          AND NOT (LOWER(i->>'name') LIKE '%plate%' OR LOWER(i->>'name') LIKE '%bowl%')

          UNION ALL

          -- Then extract individual items from combos (plates and bowls)
          SELECT 
            o.id as order_id,
            o.sale / NULLIF(
              array_length(
                string_to_array(
                  regexp_replace(
                    regexp_replace(LOWER(i->>'name'), '^(bigger plate|plate|bowl)\\s*\\((.*)\\).*$', '\\2'),
                    '\\s*,\\s*', ','
                  ),
                  ','
                ),
                1
              ),
              0
            ) as order_total,
            trim(both ' ' from unnest(
              string_to_array(
                regexp_replace(
                  regexp_replace(LOWER(i->>'name'), '^(bigger plate|plate|bowl)\\s*\\((.*)\\).*$', '\\2'),
                  '\\s*,\\s*', ','
                ),
                ','
              )
            )) as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'entree_side') as i
          WHERE DATE(o.datetime) = CURRENT_DATE
          AND (LOWER(i->>'name') LIKE '%plate%' OR LOWER(i->>'name') LIKE '%bowl%')

          UNION ALL

          -- Get drink items
          SELECT 
            o.id,
            o.sale,
            LOWER(i->>'name') as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'drink_table') as i
          WHERE DATE(o.datetime) = CURRENT_DATE

          UNION ALL

          -- Get appetizer items
          SELECT 
            o.id,
            o.sale,
            LOWER(i->>'name') as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'appetizers') as i
          WHERE DATE(o.datetime) = CURRENT_DATE
        )
        SELECT 
          item_name as name,
          SUM(quantity) as quantity,
          SUM(order_total * quantity) as estimated_sales
        FROM extracted_items
        WHERE item_name IS NOT NULL 
          AND item_name != ''
          AND NOT item_name LIKE '%plate%'
          AND NOT item_name LIKE '%bowl%'
        GROUP BY item_name
        ORDER BY SUM(quantity) DESC
      `),

      // Category summary
      executeQuery(`
        WITH RECURSIVE extracted_items AS (
          -- Same CTE as above for consistency
          SELECT 
            o.id as order_id,
            o.sale as order_total,
            LOWER(i->>'name') as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'entree_side') as i
          WHERE DATE(o.datetime) = CURRENT_DATE
          AND NOT (LOWER(i->>'name') LIKE '%plate%' OR LOWER(i->>'name') LIKE '%bowl%')

          UNION ALL

          SELECT 
            o.id as order_id,
            o.sale / NULLIF(
              array_length(
                string_to_array(
                  regexp_replace(
                    regexp_replace(LOWER(i->>'name'), '^(bigger plate|plate|bowl)\\s*\\((.*)\\).*$', '\\2'),
                    '\\s*,\\s*', ','
                  ),
                  ','
                ),
                1
              ),
              0
            ) as order_total,
            trim(both ' ' from unnest(
              string_to_array(
                regexp_replace(
                  regexp_replace(LOWER(i->>'name'), '^(bigger plate|plate|bowl)\\s*\\((.*)\\).*$', '\\2'),
                  '\\s*,\\s*', ','
                ),
                ','
              )
            )) as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'entree_side') as i
          WHERE DATE(o.datetime) = CURRENT_DATE
          AND (LOWER(i->>'name') LIKE '%plate%' OR LOWER(i->>'name') LIKE '%bowl%')

          UNION ALL

          SELECT 
            o.id,
            o.sale,
            LOWER(i->>'name') as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'drink_table') as i
          WHERE DATE(o.datetime) = CURRENT_DATE

          UNION ALL

          SELECT 
            o.id,
            o.sale,
            LOWER(i->>'name') as item_name,
            (i->>'quantity')::integer as quantity
          FROM orders o,
          jsonb_array_elements(o.items->'appetizers') as i
          WHERE DATE(o.datetime) = CURRENT_DATE
        )
        SELECT 
          CASE
            WHEN es.type = true THEN 'Entrees'
            WHEN es.type = false THEN 'Sides'
            WHEN dt.id IS NOT NULL THEN 'Drinks'
            WHEN ap.id IS NOT NULL THEN 'Appetizers'
            ELSE 'Other'
          END as category,
          SUM(quantity) as items_sold,
          SUM(order_total * quantity) as category_sales
        FROM extracted_items ei
        LEFT JOIN entree_side es ON LOWER(es.name) = ei.item_name
        LEFT JOIN drink_table dt ON LOWER(dt.name) = ei.item_name
        LEFT JOIN appetizers ap ON LOWER(ap.name) = ei.item_name
        WHERE item_name NOT LIKE '%plate%' AND item_name NOT LIKE '%bowl%'
        GROUP BY 
          CASE
            WHEN es.type = true THEN 'Entrees'
            WHEN es.type = false THEN 'Sides'
            WHEN dt.id IS NOT NULL THEN 'Drinks'
            WHEN ap.id IS NOT NULL THEN 'Appetizers'
            ELSE 'Other'
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