import mysql from "mysql";

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database : 'nodelogin'
});

export default connection;