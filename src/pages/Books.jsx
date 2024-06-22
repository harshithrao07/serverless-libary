import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookContext } from "../context/books";

const Books = () => {
  const { books } = useContext(BookContext);

  if (!books.length) {
    return <h3>No Books Available</h3>;
  }

  return (
    <div className="lg:px-20 px-4 mt-8 lg:mt-20 font-body">
      <div className="grid gap-x-4 gap-y-2 md:grid-cols-2 lg:grid-cols-3 w-full">
        {books.map(({ image: image, id, title, author, price }) => (
          <Link key={id} to={`/books/${id}`}>
            <div className="p-4">
              <img src={image} alt={title} className="w-full h-96 object-fit" />
              <div className="my-2 lg:my-3 flex items-center text-xs lg:text-sm">
                <span className="text-purple-700 font-bold text-md uppercase">
                  {author}
                </span>
              </div>
              <div className="flex flex-col pb-2 border-t-2 border-primary-200 text-gray-800">
                <span className="text-md font-bold">{title.toUpperCase()}</span>
                <span className="font-bold text-xl">₹{price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Books;
