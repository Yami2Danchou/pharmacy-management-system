import { sql } from './db';

// Helper function to execute parameterized queries
export async function executeQuery(queryString, params = []) {
  try {
    // For Neon DB, we need to use the tagged template syntax
    // But we can't dynamically create tagged templates easily
    // So we'll use a workaround with the sql function
    
    // For simple queries without parameters
    if (params.length === 0) {
      return await sql(queryString);
    }
    
    // For queries with parameters, we need to construct the query differently
    // This is a workaround that uses the array of strings and values approach
    const result = await sql(queryString, ...params);
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}

// For building queries with multiple parameters
export async function queryWithTemplate(strings, ...values) {
  try {
    return await sql(strings, ...values);
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}