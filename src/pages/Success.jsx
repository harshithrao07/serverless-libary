import React, { useEffect } from 'react'
import { processOrder } from '../api/mutations';
import { generateClient } from "aws-amplify/api";

const Success = () => {
  const client = generateClient()

  useEffect(() => {

    async function createOrder() {
      try {
        const payload = JSON.parse(localStorage.getItem("payload"))
        console.log(payload) 

        const res = await client.graphql({
          query: processOrder,
          variables: { input: payload }
        });
        
        console.log("Order is successful");
      } catch (err) {
        console.log(err);
      }
    }

    createOrder()
  }, [])

  return (
    <div>Success</div>
  )
}

export default Success