import { Request, Response } from 'express';
import db from '../config/db'; 

interface Employee {
  employee_id: string;
  name: string;
  salary: number;
  position: string;
}

// Initialize employeeMap
let employeeMap: Record<string, Employee> = {};

// Function to load employees from the database
async function loadEmployees() {

  console.log("getting employees")
  try {
    const result = await db.query(`
      SELECT employee_id, LOWER(TRIM(name)) as name, salary, position 
      FROM employees
    `);

    employeeMap = result.rows.reduce((acc: Record<string, Employee>, row: any) => {
      acc[row.name] = {
        employee_id: row.employee_id,
        name: row.name,
        salary: Number(row.salary),
        position: row.position
      };
      return acc;
    }, {});

    // Add alternative names if necessary (e.g., for nicknames or common variations)
    employeeMap['bob'] = employeeMap['robert'];
    employeeMap['bill'] = employeeMap['william'];

    console.log('Employees loaded successfully.');
  } catch (error) {
    console.error('Failed to load employees:', error);
  }
}

// Call loadMenuItems at startup
loadEmployees();

// Controller function to get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  const query = `SELECT employee_id, name, salary, position FROM employees`;
  console.log("getting all employees")
  try {
    
    const result = await db.query(query);
    const employees = result.rows.map((row: any) => ({
      employee_id: row.employee_id,
      name: row.name,
      salary: row.salary,
      position: row.position,
    }));

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees!' });
  }
};

// Controller function to add a new employee
export const addEmployee = async (req: Request, res: Response) => {
  const { employee_id, name, salary, position } = req.body;
  
  console.log("hi")
  if (!employee_id || !name || !salary || !position) {
    return res.status(400).json({ error: 'All fields are required!!' });
  }
  console.log(employee_id, name, salary, position);
  const query = `INSERT INTO employees (employee_id, name, salary, position) VALUES ($1, $2, $3, $4) RETURNING *`;

  try {
    const result = await db.query(query, [employee_id, name, parseFloat(salary), position]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

// Controller function to update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  const { employee_id, name, salary, position } = req.body;

  if (!employee_id || !salary || !position) {
    return res.status(400).json({ error: 'All fields are required!!!' });
  }

  const query = `UPDATE employees SET salary = $1, position = $2 WHERE employee_id = $3 RETURNING *`;
  //const query = `UPDATE employees SET salary = $1, position = $2 id = $3 WHERE name = $4 RETURNING *`;

  try {
    const result = await db.query(query, [parseFloat(salary), position, employee_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

// Controller function to delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const query = `DELETE FROM employees WHERE employee_id = $1 RETURNING *`;

  try {
    const result = await db.query(query, [employee_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
