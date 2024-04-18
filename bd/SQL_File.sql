CREATE DATABASE library;
USE library;

CREATE TABLE genre(
id_genre INT PRIMARY KEY auto_increment,
name_genre VARCHAR(45) not null
);

INSERT INTO genre (name_genre)
VALUES("Contemporary Fiction"),
("Fantasy");

CREATE TABLE books(
id_books INT PRIMARY KEY auto_increment,
title VARCHAR(60) NOT NULL,
summary VARCHAR (500) NOT NULL,
name_author VARCHAR(45) not null,
pages INT not null,
image VARCHAR(500),
price FLOAT NOT NULL,
fk_genre INT,
FOREIGN KEY (fk_genre) REFERENCES genre (id_genre));


INSERT INTO books (title, summary, name_author, pages, image, price, fk_genre)
VALUES ("Normal People", "Marianne and Connell are high school classmates but they don't speak to each other. He is one of the popular ones and she is a lonely girl who has learned to stay away from the rest of the people. Everyone knows that Marianne lives in a mansion and that Connell's mother is in charge of cleaning it, but no one imagines that every afternoon the two young people meet. One of those days, an awkward conversation will begin a relationship that could change their lives", "Sally Rooney", 256, "https://m.media-amazon.com/images/I/71gCXocumWL._SY466_.jpg", 12.50, 1),
("The Final Empire", " thousand years ago evil came to the land and has ruled with an iron hand ever since. The sun shines fitfully under clouds of ash that float down endlessly from the constant eruption of volcanoes. A dark lord rules through the aristocratic families and ordinary folk are condemned to lives in servitude, sold as goods, labouring in the ash fields", "Brandon Sanderson", 537, "https://gigamesh.com/wp-content/uploads/2021/09/The-Final-Empire.jpg", 12.40, 2);

SELECT * FROM books;
