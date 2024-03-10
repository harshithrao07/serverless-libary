import React, { useContext, useEffect } from "react";
import { CartContext } from "../context/cart";
import { FiChevronUp } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, total, increaseAmount, decreaseAmount, loading } = useContext(CartContext);
  const { currentAuthenticatedUser } = useContext(UserContext)

  useEffect(() => {
    async function checkAuthenticated() {
      const username = await currentAuthenticatedUser();
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
        <h3>Total: $ {total}</h3>
      </div>
      <div>
        <button className="btn" onClick={() => navigate("/checkout")}>Checkout</button>
      </div>
    </section>
  );
};

export default Cart;
