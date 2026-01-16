import mysql, { Pool } from "mysql2/promise";

export const connection: Pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "pcmasterracedb",
});
