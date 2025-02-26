import { POSTGRES_SSL_ENABLED } from '@/app/config';
import { Pool, Query, QueryResult, QueryResultRow } from 'pg'; 
import Database from 'better-sqlite3';

let db: Database.Database;

if (process.env.NODE_ENV === 'development') {
  db = new Database('./data.db');
} else {
  if (!global.db) {
    global.db = new Database('./data.db');
  }
  db = global.db as Database.Database;
}

export type Primitive = string | number | boolean | undefined | null;

export const query = async <T extends QueryResultRow = any>(
  queryString: string,
  values: Primitive[] = [],
) => {
  // const client = await pool.connect();
  let response: QueryResult<T>;
  try {
    console.log(queryString, values);
    response = {
      rows: [],
      command: '',
      rowCount: 0,
      oid: 0,
      fields: [],
    };
    // response = await db.exec(queryString, values);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    db.close();
  }
  return response;
};

export const sql = <T extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
) => {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error('Invalid template literal argument');
  }

  let result = strings[0] ?? '';

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ''}`;
  }

  return query<T>(result, values);
};

export const convertArrayToPostgresString = (
  array?: string[],
  type: 'braces' | 'brackets' | 'parentheses' = 'braces', 
) => array
  ? type === 'braces'
    ? `{${array.join(',')}}`
    : type === 'brackets'
      ? `[${array.map(i => `'${i}'`).join(',')}]`
      : `(${array.map(i => `'${i}'`).join(',')})`
  : null;

const isTemplateStringsArray = (
  strings: unknown,
): strings is TemplateStringsArray => {
  return (
    Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
  );
};

export const testDatabaseConnection = async () =>
  query('SELECt COUNT(*) FROM pg_stat_user_tables');
