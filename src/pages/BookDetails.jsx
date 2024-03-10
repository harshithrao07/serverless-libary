import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookContext } from "../context/books";
import { CartContext } from "../context/cart";
import { UserContext } from "../context/user";


const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useContext(BookContext);
  const { addToCart } = useContext(CartContext);
  const { username } = useContext(UserContext);

  const book = books.find((book) => {
    return book.id === id;
  });
  if (!book) {
    return <h3>Loading...</h3>;
  }

  const { image: url, title, description, author, price } = book;

  const handleClick = async () => {
    if (username != "") {
      addToCart({ ...book, id });
      navigate("/cart");
    } else {
      navigate("/auth?message=You have to login first")
    }
  }

  return (
    <section className="book-details">
      <div className="detail-image">
        <img src={url} alt="10x Rule" />
      </div>
      <div className="detail-description">
        <h2>{title}</h2>
        <p>{description}</p>
        <h3>{author}</h3>
        <h4>Price - $ {price}</h4>
        <button
          className="btn"
          onClick={handleClick}
        >
          Add to Cart
        </button>
      </div>
    </section>
  );
};

export default BookDetails;
