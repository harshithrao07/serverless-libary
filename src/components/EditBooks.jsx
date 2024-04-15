import React, { useState, useEffect, useContext } from "react";
import { BookContext } from "../context/books";
import { Link } from "react-router-dom";

const EditBooks = () => {
  const { books } = useContext(BookContext);

  if (!books.length) {
    return <h3>No Books Available</h3>;
  }


  // Function to render the list of books
  const renderBooks = () => {
    return books.map(({image, id, title, description, featured, author, price, pdf }) => (
      <div key={id} className="book-item">
        <img src={image} alt={title} className="book-image" />
        <div className="book-details">
          <h2>{title}</h2>
          <p>{description}</p>
          <p>Author: {author}</p>
          <p>Price: ₹{price}</p>
          <p>Featured: {featured ? "Yes" : "No"}</p>
          <Link to={pdf}>PDF</Link>
          <button>Edit</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="mt-5">
      <h1>Edit Books</h1>
      <div className="books-list">{renderBooks()}</div>
    </div>
  );
};

export default EditBooks;
