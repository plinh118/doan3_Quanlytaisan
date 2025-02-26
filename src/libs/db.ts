import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',        
  port: parseInt(process.env.MYSQL_PORT || '3306', 10), 
  user: process.env.MYSQL_USER || 'root',             
  password: process.env.MYSQL_PASSWORD || '',         
  database: process.env.MYSQL_DATABASE || 'academi_v4', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    throw new Error(`Database error: ${error}`);
  }
}