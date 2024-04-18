const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

require('dotenv').config();

const server = express();

server.use(cors());
server.use(express.json());

async function getDBConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'library',
  });
  connection.connect();
  return connection;
}

const port = process.env.PORT || 4004;
server.listen(port, () => {
  console.log('Server is running on port ' + port);
});

server.get('/books', async (req, res) => {
  const connection = await getDBConnection();

  const querySQL = 'SELECT * FROM books';
  const [result] = await connection.query(querySQL);
  connection.end();

  res.json({
    info: { count: result.length },
    results: result,
  });
});
