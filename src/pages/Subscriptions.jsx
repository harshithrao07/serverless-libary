import { loadStripe } from "@stripe/stripe-js";

import React from 'react'

export default function Subscriptions() {
  const userId = localStorage.getItem('userId')

  const handleClick = async e => {
    const stripe = await loadStripe('pk_test_51ORYlmSFkgnN12a3jUDD29GFe3SyBlHRBNuxCgKY46njWUO5AcPt9bO03KfI6AqnRPlEEgjacRiqCt07QnjE2veE00uDyYzs0D')
    const { error } = await stripe.redirectToCheckout({
        lineItems: [{
            price: 'price_1Ow4HFSFkgnN12a3HZtJvy6f',
            quantity: 1
        }],
        mode: 'subscription',
        successUrl: `http://localhost:5173/subscription-success/${userId}`,
        cancelUrl: `http://localhost:5173/user/${userId}`
    })
  }

  return (
    <button onClick={handleClick} className="mb-5 mt-12 lg:mt-20 lg:px-20">
        Get Membership Access
    </button>
  )
}
