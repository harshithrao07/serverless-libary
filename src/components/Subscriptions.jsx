import { loadStripe } from "@stripe/stripe-js";
import { generateClient } from "aws-amplify/api";
import { processSubscriptions } from '../api/mutations';

import React, { useEffect } from 'react'

export default function Subscriptions() {
  const userId = localStorage.getItem('userId')

  const client = generateClient()
  const status = localStorage.getItem("status")

  useEffect(() => {
    async function checkMembership() {
      const res = await client.graphql({
        query: processSubscriptions
      })

      localStorage.setItem("status", res.data.processSubscriptions)
    }

    checkMembership()
  }, [])

  const handleClick = async e => {
    const stripe = await loadStripe('pk_test_51ORYlmSFkgnN12a3jUDD29GFe3SyBlHRBNuxCgKY46njWUO5AcPt9bO03KfI6AqnRPlEEgjacRiqCt07QnjE2veE00uDyYzs0D')

    const { error } = await stripe.redirectToCheckout({
        lineItems: [{
            price: 'price_1Ow4HFSFkgnN12a3HZtJvy6f',
            quantity: 1
        }],
        clientReferenceId: userId,
        mode: 'subscription',
        successUrl: `http://localhost:5173/subscription-success/${userId}`,
        cancelUrl: `http://localhost:5173/user/${userId}`
    })
  }

  return (
    <div>
      {
        status == "Not Active" ?
        <button onClick={handleClick} className="my-5 lg:px-20">
            Get Membership Access
        </button>
        :
        <span>Active Member</span>
      }
    </div>
  )
}
