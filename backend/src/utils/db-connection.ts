import mysql, { type Connection } from 'mysql2/promise'

export const connection: Connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pcmasterracedb'
})