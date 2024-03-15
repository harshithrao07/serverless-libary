import React, { useContext, useEffect } from 'react'
import { deleteCartItem, processOrder } from '../api/mutations';
import { generateClient } from "aws-amplify/api";
import { CartContext } from '../context/cart';
import { Link } from 'react-router-dom';

const Success = () => {
  const client = generateClient()

  useEffect(() => {

    async function createOrder() {
      try {
        const payload = JSON.parse(sessionStorage.getItem("payload"))

        const res = await client.graphql({
          query: processOrder,
          variables: { input: payload }
        });

        payload.cartInput.map(async (item, id) => {
          await client.graphql({
            query: deleteCartItem,
            variables: { input: { id: item.cartItemId } }
          })
        })

        sessionStorage.removeItem("payload")
        console.log("Order is successful");
      } catch (err) {
        console.log(err);
      }
    }

    if (sessionStorage.getItem("payload")) {
      createOrder()
    }
  }, [])


  return (
    <div className="h-screen flex justify-center items-center p-7 md:p-0">
      <div className="login-card p-10 flex justify-center items-center flex-col">
        <span className="text-lg text-center md:text-2xl mb-3">🎉Successfully placed your order🎉</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
        <Link to="/"><Button className="bg-primary-200 mt-3">Go back Home</Button></Link>
      </div>
    </div>
  )
}

export default Success