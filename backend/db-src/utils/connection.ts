import mysql, { Connection } from "mysql2";

export const CreateDbConnection: Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
})

export const connection: Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pcmasterracedb'
})