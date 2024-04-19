import '../scss/components/BookItem.scss';

function BookItem({ bookData }) {
  const { title, summary, name_author, image } = bookData;

  return (
    <li className="bookData">
      <figure className="bookData__image">
        <img src={image} alt="Cover from the book" />
      </figure>
      <h2 className="bookData__title">{title}</h2>
      <p className="bookData__author">{name_author}</p>
      <p className="bookData__summary">{summary}</p>
    </li>
  );
}

export default BookItem;
