import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);

class Database {
  prepare(query: string) {
    let paramCount = 0;
    const convertedQuery = query.replace(/\?/g, () => `$${++paramCount}`);

    return {
      all: async (...params: any[]) => {
        try {
          const result = await sql(convertedQuery, params);
          return result || [];
        } catch (error) {
          console.error('Query error:', query, params, error);
          throw error;
        }
      },
      get: async (...params: any[]) => {
        try {
          const result = await sql(convertedQuery, params);
          return result[0] || null;
        } catch (error) {
          console.error('Query error:', query, params, error);
          throw error;
        }
      },
      run: async (...params: any[]) => {
        try {
          const finalQuery = query.trim().toUpperCase().startsWith('INSERT') && 
            !query.toUpperCase().includes('RETURNING') 
              ? `${convertedQuery} RETURNING *` 
              : convertedQuery;

          const result = await sql(finalQuery, params);
          return {
            changes: result.length,
            lastInsertRowId: result[0]?.id
          };
        } catch (error) {
          console.error('Query error:', query, params, error);
          throw error;
        }
      }
    };
  }

  async exec(query: string) {
    return sql(query);
  }
}

const db = new Database();
export default db;