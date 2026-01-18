import mysql, { Connection } from "mysql2";

const baseDBConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
};

export const createDbConnection = (): Connection => mysql.createConnection({
  ...baseDBConfig,
});

export const connection = (): Connection => mysql.createConnection({
  ...baseDBConfig,
  database: 'pcmasterracedb'
});