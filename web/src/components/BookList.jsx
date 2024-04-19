import BookItem from './BookItem';
import '../scss/components/BookList.scss';

function BookList({ bookList }) {
  return (
    <section className="bookList">
      <ul className="bookList__all">
        {bookList.map((book) => {
          return <BookItem key={book.id} bookData={book} />;
        })}
      </ul>
    </section>
  );
}

export default BookList;
