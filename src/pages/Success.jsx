import React, { useContext, useEffect } from 'react'
import { deleteCartItem, processOrder } from '../api/mutations';
import { generateClient } from "aws-amplify/api";
import { CartContext } from '../context/cart';

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

        console.log(payload)
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

    if(sessionStorage.getItem("payload")) {
      createOrder()
    }
  }, [])


  return (
    <div>Success</div>
  )
}

export default Success