import React, { useState, useEffect } from "react";
import { createCartItem, deleteCartItem, updateCartItem } from "../api/mutations";
import { generateClient } from "aws-amplify/api";
import { listCartItems } from "../api/queries";

const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false)

  const client = generateClient()

  async function fetchCartItems() {
    try {
      setLoading(true)
      const { data } = await client.graphql({
        query: listCartItems,
        variables: {
          filter: {
            cartID: { eq: localStorage.getItem("cartId") }
          }
        }
      });
      const cart = data.listCartItems.items
      setCart(cart);
      calculateTotal()
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCartItems();
  }, []);


    function inputCartForPayment() {
      const createCartItemInputArray = (data) => {
        return data.map(item => {
          return {
            id: item.bookID,
            title: item.book.title,
            image: item.book.image,
            price: item.book.price,
            quantity: item.quantity
          }
        })
      }
  
      const cartItemsInputArray = createCartItemInputArray(cart);
      return cartItemsInputArray;
    }
  


  function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
      if (item.book?.price) {
        total += (item.book.price * item.quantity);
      }
    });
    setTotal(total)
  }

  const increaseAmount = async (bookID, cartID) => {
    try {
      const response = await client.graphql({
        query: updateCartItem,
        variables: {
          input: {
            id: cartID,
            quantity: cart.find((item) => item.bookID === bookID).quantity + 1
          }
        }
      });

      if (response.data.updateCartItem) {
        const updatedCart = cart.map((item) =>
          item.bookID === bookID ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
      } else {
        console.error('Failed to update cart item quantity.');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const decreaseAmount = async (bookID, quantity, id) => {
    let updatedCart = [];
    if (quantity === 1) {
      updatedCart = cart.filter((item) => item.bookID !== bookID);
    } else {
      updatedCart = cart.map((item) =>
        item.bookID === bookID ? { ...item, quantity: item.quantity - 1 } : item
      );
    }
    setCart(updatedCart);

    try {
      let response;
      if (quantity === 1) {
        response = await client.graphql({
          query: deleteCartItem,
          variables: { input: { id: id } }
        });
      } else {
        response = await client.graphql({
          query: updateCartItem,
          variables: {
            input: {
              id: id,
              quantity: cart.find((item) => item.bookID === bookID).quantity - 1
            }
          }
        });
      }
      if (!response || !response.data) {
        console.error('Failed to update cart item.');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };


  const addToCart = async (book) => {
    const { id, title, price, image } = book;
    const cartItem = cart.find((item) => item.bookID === id);
    const cartID = localStorage.getItem("cartId");

    if (cartItem) {
      increaseAmount(id, cartItem.id);
    } else {
      const newCartItem = {
        cartID: cartID,
        bookID: id,
        quantity: 1
      };

      try {
        const response = await client.graphql({
          query: createCartItem,
          variables: { input: newCartItem }
        });

        if (response.data.createCartItem) {
          const updatedCart = [...cart, { id, title, image, price, quantity: 1 }];
          setCart(updatedCart);
        } else {
          console.error('Failed to add item to the cart.');
        }

        await fetchCartItems()
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, increaseAmount, decreaseAmount, clearCart, loading, fetchCartItems, inputCartForPayment, calculateTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
