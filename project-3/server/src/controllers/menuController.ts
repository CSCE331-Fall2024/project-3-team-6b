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

// fetch all the menu items from the database
export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    // Query to fetch menu items from all tables
    const result = await db.query(`
      SELECT name, retail_price, 'entree_side' as category FROM entree_side
      UNION ALL
      SELECT name, retail_price, 'drink_table' as category FROM drink_table
      UNION ALL
      SELECT name, retail_price, 'appetizers' as category FROM appetizers
    `);

    // Format the result into an array
    const menuItems = result.rows.map((row: any) => ({
      name: row.name,
      price: parseFloat(row.retail_price), // Ensure price is a number
      category: row.category,
    }));

    // Send the array back to the frontend
    res.json(menuItems);
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// export const getItemPrice = async (req: Request, res: Response) => {
//   const { name, category } = req.query;
//   if (!name || !category) {
//     return res.status(400).json({ error: 'Missing name or category parameter' });
//   }

//   try {
//     const query = `SELECT retail_price FROM ${category} WHERE LOWER(name) = LOWER($1)`;
//     console.log('Querying:', query, 'with', [name]);
//     const { rows } = await db.query(query, [name]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     const price = rows[0].retail_price;
//     res.json({ price });
//   } catch (error) {
//     console.error('Error fetching price:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

export const getItemPrice = async (req: Request, res: Response) => {
  const { name, category } = req.query;

  if (!name || !category) {
    return res.status(400).json({ error: 'Missing name or category parameter' });
  }

  try {
    if (category === 'entree_side') {
      // Query both retail_price and type for entree_side
      const query = `SELECT retail_price, type FROM entree_side WHERE LOWER(name) = LOWER($1)`;
      console.log('Querying:', query, 'with', [name]);
      const { rows } = await db.query(query, [name]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const { retail_price: price, type } = rows[0];
      return res.json({ price, type });
    } else {
      // Query only retail_price for other categories
      const query = `SELECT retail_price FROM ${category} WHERE LOWER(name) = LOWER($1)`;
      const { rows } = await db.query(query, [name]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const price = rows[0].retail_price;
      return res.json({ price });
    }
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller function to get menu items
export const getMenuItems = async (req: Request, res: Response) => {
    try {
        const result = await db.query(`
          SELECT id, name, 'entree_side' AS category, retail_price AS price, inventory AS count, type as type FROM entree_side
          UNION ALL
          SELECT id, name, 'free_items' AS category, NULL AS price, inventory AS count, NULL AS type FROM free_items
          UNION ALL
          SELECT id, name, 'drink_table' AS category, retail_price AS price, inventory AS count, NULL AS type FROM drink_table
          UNION ALL
          SELECT id, name, 'appetizers' AS category, retail_price AS price, inventory AS count, NULL AS type FROM appetizers
          UNION ALL
          SELECT id, name, 'raw_items' AS category, NULL AS price, inventory AS count, NULL AS type FROM raw_items
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
        // Get the current row count in `entree_side` table
        const rowCountResult = await db.query('SELECT COUNT(*) FROM entree_side');
        const rowCount = parseInt(rowCountResult.rows[0].count, 10);

        // Set the new ID based on the row count
        let newId = rowCount + 1;
        query = `INSERT INTO entree_side (name, retail_price, wholesale_price, inventory, type, id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        values = [name, price, 2, count, type, newId];
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
  const { name, category, price, count } = req.body;
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
    console.log('Executing query:', query);
    console.log('With values:', values);
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    // Return the updated item
    console.log('here');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu' });
  }
};

export const removeMenuItem = async (req: Request, res: Response) => {
  const { category, name } = req.body;

  // Validate category to ensure it's an allowed table name
  const allowedCategories = ['entree_side', 'free_items', 'raw_items', 'appetizers', 'drink_table'];
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  // Check if both `category` and `name` are provided
  if (!category || !name) {
    return res.status(400).json({ error: 'Category and name are required' });
  }

  // Define parameterized DELETE query
  const query = `DELETE FROM ${category} WHERE name = $1 RETURNING *`;
  const values = [name];

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Return the deleted item
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error removing menu item:', error);
    res.status(500).json({ error: 'Failed to remove menu item' });
  }
};



