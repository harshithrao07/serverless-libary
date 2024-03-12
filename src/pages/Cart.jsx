import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/cart";
import { FiChevronUp } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { BookContext } from "../context/books";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, total, increaseAmount, decreaseAmount, loading, inputCartForPayment } = useContext(CartContext);
  const { checkout } = useContext(BookContext);
  const [orderDetails, setOrderDetails] = useState(null);


  useEffect(() => {
    async function checkAuthenticated() {
      const username = localStorage.getItem("username");
      if (username === undefined) {
        navigate("/auth")
      }
    }

    checkAuthenticated()
  }, [])



  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!cart.length) {
    return <h3>Empty Cart</h3>
  }


  async function handlePayment() {
    const cartInput = inputCartForPayment()
    setOrderDetails({ cartInput, total })
    console.log(cartInput)


    checkout(orderDetails)
  }


  function renderBillComponent() {
    return cart.map((item, index) => (
      <div key={index} className="grid grid-cols-4 md:grid-cols-5 py-1 px-2 md:px-0 border-t border-black">
        <span className="text-xs md:text-lg md:col-span-2">{item.book.title}</span>
        <span className="text-xs md:text-lg flex justify-center">${item.book.price}</span>
        <span className="text-xs md:text-lg flex justify-center">x{item.quantity}</span>
        <span className="text-xs md:text-lg flex justify-center">${(item.book.price) * (item.quantity)}</span>
      </div>
    ))
  }

  return (
    <section className="cart">
      <header>
        <h2>My Cart</h2>
      </header>
      {
        cart.length > 0 &&
        <div className="cart-wrapper">
          {cart.map(({ id, book, quantity, bookID }) => (
            <article key={id} className="cart-item">
              <div className="image">
                {book && book.image && <img src={book.image} alt="cart item" />}
              </div>
              <div className="details">
                <p>{book && book.title}</p>
                <p>$ {book && book.price}</p>
              </div>
              <div className="amount">
                <button onClick={() => increaseAmount(bookID, id)}><FiChevronUp /></button>
                <p>{quantity}</p>
                <button onClick={() => decreaseAmount(bookID, quantity, id)}><FiChevronDown /></button>
              </div>
            </article>
          ))}
        </div>

      }
      <div>
        {
          cart.length > 0 &&
          <div className="flex flex-col">
            <span className="text-xl ml-5 md:ml-0 md:text-2xl py-4 pb-1 border-b-2 w-fit mb-4">Your Total Bill:</span>
            <div className="p-3 bg-orange-100 bg-opacity-50 md:rounded-xl">
              <div className="bg-white rounded-xl p-2">
                <div className="grid grid-cols-4 md:grid-cols-5 px-2 md:px-0 py-1">
                  <span className="text-xs md:text-lg md:col-span-2 font-bold">Name</span>
                  <span className="text-xs md:text-lg flex justify-center font-bold">Price</span>
                  <span className="text-xs md:text-lg flex justify-center font-bold">Quantity</span>
                  <span className="text-xs md:text-lg flex justify-center font-bold">Total Cost</span>
                </div>
                <div>
                  {renderBillComponent()}
                </div>
                <div className="grid grid-cols-4 md:grid-cols-5 border-t border-black px-2 md:px-0">
                  <span className="col-start-4 md:col-start-5 text-lg md:text-2xl flex justify-center items-center py-2 border-b border-black text-center"><span className="font-bold">${total}</span></span>
                  <div className="flex justify-end lg:justify-center col-span-3 col-start-2 md:col-start-4 lg:col-start-5"><button onClick={handlePayment} className="mt-3">Proceed to Checkout</button></div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  );
};

export default Cart;
