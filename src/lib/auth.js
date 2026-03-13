import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from './db'; // Keep this import

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.user_id, 
      username: user.username, 
      role: user.role,
      employeeId: user.employee_id 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(username, password) {
  try {
    const users = await sql`
      SELECT u.*, e.employee_name 
      FROM "User" u 
      JOIN Employee e ON u.employee_id = e.employee_id 
      WHERE u.username = ${username} AND u.is_active = true
    `;
    
    if (users.length === 0) return null;
    
    const user = users[0];
    const isValid = await comparePassword(password, user.password_hash);
    
    if (!isValid) return null;
    
    return {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      employee_name: user.employee_name,
      employee_id: user.employee_id
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}