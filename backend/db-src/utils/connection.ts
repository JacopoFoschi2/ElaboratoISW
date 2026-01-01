import mysql, { Connection } from "mysql2";

const baseDbConfig = {
  host: 'localhost',
  user: 'root',
  password: ''
};

export const createDbConnection: Connection = mysql.createConnection({
  ...baseDbConfig,
  multipleStatements: true
})

export const connection = (multipleStatements = false): Connection => mysql.createConnection({
  ...baseDbConfig,
  database: 'pcmasterracedb',
  multipleStatements
});