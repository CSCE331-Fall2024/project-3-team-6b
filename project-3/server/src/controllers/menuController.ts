import { Request, Response } from 'express';
import db from '../config/db'; 

interface MenuItem {
  id: number;
  type: string;
}

// Initialize menuItemMap
let menuItemMap: Record<string, MenuItem> = {};

// Function to load menu items from the database
async function loadMenuItems() {
  try {
    const result = await db.query(`
      SELECT id, LOWER(TRIM(name)) as name, 'entree_side' as type FROM entree_side
      UNION ALL
      SELECT id, LOWER(TRIM(name)) as name, 'drink_table' as type FROM drink_table
      UNION ALL
      SELECT id, LOWER(TRIM(name)) as name, 'appetizers' as type FROM appetizers
    `);

    menuItemMap = result.rows.reduce((acc: Record<string, MenuItem>, row: any) => {
      acc[row.name] = { id: Number(row.id), type: row.type };
      return acc;
    }, {});

    // Add alternative names if necessary
    menuItemMap['honey sesame chicken breast'] = menuItemMap['honey sesame chicken'];
    menuItemMap['dasani'] = menuItemMap['dasani 16oz bottle'];
    // Add any other necessary alternative names

    console.log('Menu items loaded successfully.');
  } catch (error) {
    console.error('Failed to load menu items:', error);
  }
}

// Call loadMenuItems at startup
loadMenuItems();


// Controller function to get menu items
export const getMenuItems = async (req: Request, res: Response) => {
    try {
        const result = await db.query(`
          SELECT id, LOWER(TRIM(name)) AS name, 'entree_side' AS category, retail_price AS price, inventory AS count, type as type FROM entree_side
          UNION ALL
          SELECT id, LOWER(TRIM(name)) AS name, 'free_items' AS category, NULL AS price, inventory AS count, NULL AS type FROM free_items
          UNION ALL
          SELECT id, LOWER(TRIM(name)) AS name, 'drink_table' AS category, retail_price AS price, inventory AS count, NULL AS type FROM drink_table
          UNION ALL
          SELECT id, LOWER(TRIM(name)) AS name, 'appetizers' AS category, retail_price AS price, inventory AS count, NULL AS type FROM appetizers
          UNION ALL
          SELECT id, LOWER(TRIM(name)) AS name, 'raw_items' AS category, NULL AS price, inventory AS count, NULL AS type FROM raw_items
        `);
        // Return the combined data from all tables
        res.json(result.rows);
        
      } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
      }
};

export const addMenuItem = async (req: Request, res: Response) => {
  const { name, category, price, count, type } = req.body;

  try {
    let query = '';
    let values: (string | number | boolean)[] = [name, count];

    // Choose the query and values based on the specified category
    switch (category) {
      case 'entree_side':
        query = `INSERT INTO entree_side (name, retail_price, wholesale_price, inventory, type) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        values = [name, price, 2, count, type];
        break;

      case 'free_items':
        query = `INSERT INTO free_items (name, wholesale_price, inventory) VALUES ($1, $2, $3) RETURNING *`;
        values = [name, 0.1, count];
        break;

      case 'drink_table':
        query = `INSERT INTO drink_table (name, retail_price, wholesale_price, inventory) VALUES ($1, $2, $3, $4) RETURNING *`;
        values = [name, price, 1.50, count];
        break;

      case 'appetizers':
        query = `INSERT INTO appetizers (name, retail_price, wholesale_price, inventory) VALUES ($1, $2, $3, $4) RETURNING *`;
        values = [name, price, 1.50, count];
        break;

      case 'raw_items':
        query = `INSERT INTO raw_items (name, wholesale_price, inventory) VALUES ($1, $2, $3) RETURNING *`;
        values = [name, 0.5, count];
        break;

      default:
        return res.status(400).json({ error: 'Invalid category specified' });
    }

    // Execute the query
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

// Controller function to update menu items
export const updateMenuItem = async (req: Request, res: Response) => {
  const { id, name, category, price, count, type } = req.body;
  let query = '';
  let values: (string | number | boolean)[] = [];

  // Choose the query and values based on the specified category
  switch (category) {
    case 'entree_side':
      query = `UPDATE entree_side SET retail_price = $1, inventory = $2 WHERE name = $3 RETURNING *`;
      values = [price, count, name];
      break;

    case 'free_items':
      query = `UPDATE free_items SET inventory = $1 WHERE name = $2 RETURNING *`;
      values = [count, name];
      break;

    case 'drink_table':
      query = `UPDATE drink_table SET retail_price = $1, inventory = $2 WHERE name = $3 RETURNING *`;
      values = [price, count, name];
      console.log(query);
      break;

    case 'appetizers':
      query = `UPDATE appetizers SET retail_price = $1, inventory = $2 WHERE name = $3 RETURNING *`;
      values = [price, count, name];
      break;

    case 'raw_items':
      query = `UPDATE raw_items SET inventory = $1 WHERE name = $2 RETURNING *`;
      values = [count, name];
      break;

    default:
      return res.status(400).json({ error: 'Invalid category specified' });
  }

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Return the updated item
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

