SELECT * FROM books;

UPDATE books SET title = "newTitle", summary = "newSummary", name_author = "newAuthor", pages = 2, image = "newImage", price = 2, fk_genre = 2 WHERE id_books = 6;