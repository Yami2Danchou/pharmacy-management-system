import { neon } from '@neondatabase/serverless';

// Create the SQL client
const sql = neon(process.env.DATABASE_URL);

// For simple queries without parameters - using tagged template literals
export async function query(strings, ...values) {
  try {
    // If it's called as a regular function with a string, convert to tagged template
    if (typeof strings === 'string') {
      // This handles the case where someone calls query("SELECT * FROM table")
      const result = await sql(strings);
      return result;
    }
    // If it's called as a tagged template literal
    const result = await sql(strings, ...values);
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}

// Export the sql client for direct use in API routes
export { sql };