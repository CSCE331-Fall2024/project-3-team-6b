import { Request, Response } from 'express';
import db from '../config/db'; 

// Controller function to get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  const query = `SELECT employee_id, name, salary, position FROM employees`;

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
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// Controller function to add a new employee
export const addEmployee = async (req: Request, res: Response) => {
  const { employeeId, name, salary, position } = req.body;

  if (!employeeId || !name || !salary || !position) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `INSERT INTO employees (employee_id, name, salary, position) VALUES ($1, $2, $3, $4) RETURNING *`;

  try {
    const result = await db.query(query, [employeeId, name, parseFloat(salary), position]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

// Controller function to update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  const { employeeId, newSalary, newPosition } = req.body;

  if (!employeeId || !newSalary || !newPosition) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `UPDATE employees SET salary = $1, position = $2 WHERE employee_id = $3 RETURNING *`;

  try {
    const result = await db.query(query, [parseFloat(newSalary), newPosition, employeeId]);
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
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const query = `DELETE FROM employees WHERE employee_id = $1 RETURNING *`;

  try {
    const result = await db.query(query, [employeeId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
