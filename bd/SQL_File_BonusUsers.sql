USE library;

CREATE TABLE usuarios_db (
id INT PRIMARY KEY auto_increment,
email VARCHAR(50) UNIQUE NOT NULL,
name_user VARCHAR(45) NOT NULL,
password_user VARCHAR(300) NOT NULL 
);