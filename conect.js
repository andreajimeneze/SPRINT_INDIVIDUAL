import pg from "pg";
import dotenv from "dotenv";
const { Pool } = pg;

const pool = new Pool({
	host     : 'localhost',
	user     : 'postgres',
	password : '1234',
	port	 : 5432,
	database : 'pezmosaico'
})

export default pool;