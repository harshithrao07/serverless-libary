import React from "react";
import { Link } from "react-router-dom";
const Bookcard = (props) => {
  return (
    <>
      <div className="bg-white shadow-xl border-gray-400 border rounded-lg p-3 m-auto flex flex-col items-center justify-center my-10 w-64 text-center">
        <img
          src={props.imgUrl}
          alt="book-image"
          className="h-3/4 mb-4 border border-black"
        ></img>
        <Link to={`books/${props.id}`} className="text-md font-semibold">
          {props.title}
        </Link>
      </div>
    </>
  );
};
export default Bookcard;
