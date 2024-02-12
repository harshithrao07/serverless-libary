import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "../components/CheckoutForm";

const Checkout = () => {
    const stripePromise = loadStripe('pk_test_51ORYlmSFkgnN12a3jUDD29GFe3SyBlHRBNuxCgKY46njWUO5AcPt9bO03KfI6AqnRPlEEgjacRiqCt07QnjE2veE00uDyYzs0D');

    return (
        <section className="checkout-wrapper">
                <Elements stripe={stripePromise}>
                    <section>
                        <h2>Time to Checkout?</h2>
                        <CheckoutForm />
                    </section>
                </Elements>
        </section>
    )
}

export default withAuthenticator(Checkout)
