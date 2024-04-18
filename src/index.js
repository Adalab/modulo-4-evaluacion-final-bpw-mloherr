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

server.get('/books/:id', async (req, res) => {
  const idBook = req.params.id;

  const connection = await getDBConnection();
  const querySQL = 'SELECT * FROM books WHERE id_books = ?';
  const [result] = await connection.query(querySQL, [idBook]);

  connection.end();

  if (result.length === 0) {
    res.status(404).json({
      success: false,
      error: "There's not an element with that id",
    });
  } else {
    res.status(200).json({
      success: true,
      result: result,
    });
  }
});

server.post('/newbook', async (req, res) => {
  try {
    const data = req.body;
    const { title, summary, author, pages, image, price, genre } = data;

    const connection = await getDBConnection();
    const querySQL =
      'INSERT INTO books(title, summary, name_author, pages, image, price, fk_genre) VALUES(?, ?, ?, ?, ?, ?, ?)';

    const [resultInsert] = await connection.query(querySQL, [
      title,
      summary,
      author,
      pages,
      image,
      price,
      genre,
    ]);

    res.status(201).json({
      success: true,
      id: resultInsert.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
