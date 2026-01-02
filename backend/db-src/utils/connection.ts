import mysql, { Connection } from "mysql2";

const baseDbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
};

export const createDbConnection: Connection = mysql.createConnection({
  ...baseDbConfig
})

export const connection: Connection = mysql.createConnection({
  ...baseDbConfig,
  database: 'pcmasterracedb'
});