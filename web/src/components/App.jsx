import '../scss/App.scss';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import BookList from './BookList';

const App = () => {
  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:4004/books')
      .then((response) => response.json())
      .then((data) => {
        setBookList(data.results);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Cargando... ⌛</p>;
  }

  return (
    <div className="page">
      <Header />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <BookList bookList={bookList}></BookList>
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
