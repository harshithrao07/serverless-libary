import React, { useEffect } from 'react'
import { deleteCartItem, processOrder } from '../api/mutations';
import { generateClient } from "aws-amplify/api";

const Success = () => {
  const client = generateClient()

  useEffect(() => {

    async function createOrder() {
      try {
        const payload = JSON.parse(localStorage.getItem("payload"))

        const res = await client.graphql({
          query: processOrder,
          variables: { input: payload }
        });
        
        
        await client.graphql({
          query: deleteCartItem,
          variables: {
            condition: {
              cartId: {
                eq: localStorage.getItem('cartId')
              }
            }
          }
        })
        
        localStorage.removeItem("payload")
        console.log("Order is successful");
      } catch (err) {
        console.log(err);
      }
    }

    if(localStorage.getItem("payload")) {
      createOrder()
    }
  }, [])


  return (
    <div>Success</div>
  )
}

export default Success