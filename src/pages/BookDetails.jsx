import React, { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BookContext } from "../context/books";
import { CartContext } from "../context/cart";
import { Breadcrumbs } from "@material-tailwind/react";
import { Button } from "@aws-amplify/ui-react";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useContext(BookContext);
  const { addToCart } = useContext(CartContext);

  const book = books.find((book) => {
    return book.id === id;
  });

  console.log(book)

  if (!book) {
    return <h3>Loading...</h3>;
  }
  const { image: url, title, description, author, price, pdf } = book;

  const handleClick = async () => {
    if (localStorage.getItem("username")) {
      await addToCart({ ...book, id });
      const userId = localStorage.getItem("userId");
      navigate(`/user/${userId}`);
    } else {
      navigate("/auth?message=You have to login first");
    }
  };

  const renderBookComponent = () => {
    return (
      <div>
        <Breadcrumbs fullWidth className="bg-white my-3 hidden md:flex">
          <Link to="/" className="hover:text-primary-100 text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
          {/* {searchParams.get("redirectTo") ? <Link className="text-black hover:text-orange-400" to={searchParams.get("redirectTo")}>Cart</Link> : <Link to="/books" className="hover:text-orange-400 text-black">
            Books
          </Link>} */}
          <Link className="text-primary-100 break-words">{title}</Link>
        </Breadcrumbs>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:p-5 lg:p-0">
          <div className="lg:px-10 lg:pb-10 flex justify-center items-center">
            <img className="p-0 md:w-1/2 md:mb-5 lg:mb-0" src={url} />
          </div>
          <div className="p-3 lg:px-10 lg:pb-10 flex flex-col">
            <span className="text-primary-100 font-black text-sm lg:text-xl pb-1 lg:border-b-2 border-primary-100">
              NITTE Library Portal
            </span>
            <span className="text-4xl font-bold text-primary-200 mt-3">
              {title}
            </span>
            <span className="text-purple-700 font-bold text-2xl mt-3">
              {author}
            </span>
            <p className="mt-6 text-primary-200">{description}</p>
            <span className="mt-5 text-4xl text-primary-200 font-bold">
              ₹{price}
            </span>
            <div className="flex flex-col md:flex-row mt-5 lg:mt-10 items-center md:justify-around lg:justify-evenly">
              <button
                onClick={handleClick}
                className={`flex md:px-7 mt-5 lg:mt-0 lg:py-0 justify-center w-full ${localStorage.getItem("status") && "md:w-fit"} rounded-md h-full bg-primary-100 text-white font-bold text-sm items-center`}
              >
                <span>
                  <div className="flex py-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    Add to cart
                  </div>
                </span>
              </button>
              {localStorage.getItem("status") == "Active" && (
                <Link to={pdf}>
                  <Button className="bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download PDF
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-5 mt-12 lg:mt-20 lg:px-20">{renderBookComponent()}</div>
  );
};

export default BookDetails;
