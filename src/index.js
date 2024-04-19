const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

require('dotenv').config();

const server = express();

server.use(cors());
server.use(express.json());
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

const generateToken = (tokenInfo) => {
  const token = jwt.sign(tokenInfo, 'secret_key_for_readers', {
    expiresIn: '1h',
  });
  return token;
};

function authorize(req, res, next) {
  const tokenBearer = req.headers.authorization;
  console.log('req.headers.middleware:', req.headers.authorization);
  if (!tokenBearer) {
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  } else {
    const token = tokenBearer.split(' ')[1];
    try {
      const verifiedToken = jwt.verify(token, 'secret_key_for_readers');
      req.userInfo = verifiedToken;
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Not authenticated',
      });
    }
    next();
  }
}

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

server.put('/books/:id', async (req, res) => {
  const idBook = req.params.id;
  const newBookData = req.body;

  const { title, summary, author, pages, image, price, genre } = newBookData;

  const connection = await getDBConnection();
  const querySQL =
    'UPDATE books SET title = ?, summary = ?, name_author = ?, pages = ?, image = ?, price = ?, fk_genre = ? WHERE id_books = ?';
  const [result] = await connection.query(querySQL, [
    title,
    summary,
    author,
    pages,
    image,
    price,
    genre,
    idBook,
  ]);

  connection.end();

  if (result.affectedRows === 0) {
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

server.delete('/books/:id', async (req, res) => {
  const idBook = req.params.id;
  const connection = await getDBConnection();
  const querySQL = 'DELETE FROM books WHERE id_books = ?';
  const [result] = await connection.query(querySQL, [idBook]);

  console.log(result);

  if (result.affectedRows > 0) {
    res.status(200).json({
      success: true,
      message: 'Book deleted!',
    });
  } else {
    res.status(400).json({
      success: false,
      message: "The element hasn't been deleted :(",
    });
  }
});

server.post('/signin', async (req, res) => {
  const { email, username, password } = req.body;

  const connection = await getDBConnection();
  const sqlQueryEmail = 'SELECT * FROM usuarios_db WHERE email = ?';
  const [emailResult] = await connection.query(sqlQueryEmail, [email]);

  if (emailResult.length === 0) {
    const passwordHashed = await bcrypt.hash(password, 10);
    const sqlQueryNewUser =
      'INSERT INTO usuarios_db (email, name_user, password_user) VALUES (?, ?, ?)';

    const [newUserResult] = await connection.query(sqlQueryNewUser, [
      email,
      username,
      passwordHashed,
    ]);

    res.status(201).json({
      succes: true,
      data: newUserResult,
    });
  } else {
    res.status(400).json({
      succes: false,
      message: 'Email already registered',
    });
  }
});

server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const connection = await getDBConnection();
  const sqlQueryEmail = 'SELECT * FROM usuarios_db WHERE email = ?';

  const [userResult] = await connection.query(sqlQueryEmail, [email]);

  const userIsRegistered = userResult.length > 0;

  console.log(userResult);

  if (userIsRegistered) {
    const isSamePassword = await bcrypt.compare(
      password,
      userResult[0].password_user
    );

    if (isSamePassword) {
      const infoToken = {
        id: userResult[0].id,
        email: userResult[0].email,
      };
      const token = generateToken(infoToken);
      console.log('token:', token);

      res.status(200).json({
        succes: true,
        token: token,
      });
    } else {
      res.status(400).json({
        succes: false,
        message: 'Invalid password',
      });
    }
  } else {
    res.status(400).json({
      succes: false,
      message: 'Not user found',
    });
  }
});

server.get('/profileuser', authorize, async (req, res) => {
  console.log('userInfoGet:', req.userInfo);
  const connection = await getDBConnection();
  const sqlQueryEmail = 'SELECT * FROM usuarios_db WHERE email = ?';
  const [result] = await connection.query(sqlQueryEmail, [req.userInfo.email]);
  connection.end();
  res.status(200).json({
    success: true,
    message: result,
  });
});

const staticServer = 'src/public-react';
server.use(express.static(staticServer));
