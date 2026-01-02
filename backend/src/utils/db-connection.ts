import mysql, { type Connection } from 'mysql2'

export const connection: Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TODO_DB_NAME'
})