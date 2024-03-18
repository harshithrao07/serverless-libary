import React, { useState, useEffect } from 'react';
import { generateClient } from "aws-amplify/api";
import { processSubscriptions } from '../api/mutations';
import { v4 as uuidv4 } from "uuid";

const client = generateClient()

const ProductDisplay = () => {

    const handleClick = async() => {
        try {
            const payload = {
                id: uuidv4(),
                lookup_key: "sub_plan",
                userId: localStorage.getItem("userId")
            }
            console.log(payload)
            const res = await client.graphql({
                query: processSubscriptions,
                variables: {
                    input: payload
                }
            })
            localStorage.setItem("sessionId", res.data.processSubscriptions.id)
            window.location.replace(res.data.processSubscriptions.url)
            console.log("Session created Successfully.");
        } catch (error) {
            console.log(error)
        }
    }

    return (<section className='mb-5 mt-12 lg:mt-20 lg:px-20'>
        <div className="product">
            <Logo />
            <div className="description">
                <h3>Starter plan</h3>
                <h5>$20.00 / month</h5>
            </div>
        </div>
        <button id="checkout-and-portal-button" onClick={handleClick}>
            Checkout
        </button>
    </section>)
}

const SuccessDisplay = ({ sessionId }) => {
    return (
        <section className='mb-5 mt-12 lg:mt-20 lg:px-20'>
            <div className="product Box-root">
                <Logo />
                <div className="description Box-root">
                    <h3>Subscription to starter plan successful!</h3>
                </div>
            </div>
            <form action="/create-portal-session" method="POST">
                <input
                    type="hidden"
                    id="session-id"
                    name="session_id"
                    value={sessionId}
                />
                <button id="checkout-and-portal-button" type="submit">
                    Manage your billing information
                </button>
            </form>
        </section>
    );
};

const Message = ({ message }) => (
    <section className='mb-5 mt-12 lg:mt-20 lg:px-20'>
        <p>{message}</p>
    </section>
);

export default function Subscriptions() {
    let [message, setMessage] = useState('');
    let [success, setSuccess] = useState(false);
    let [sessionId, setSessionId] = useState('');

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id'));
        }

        if (query.get('canceled')) {
            setSuccess(false);
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
        }
    }, [sessionId]);

    if (!success && message === '') {
        return <ProductDisplay />;
    } else if (success && sessionId !== '') {
        return <SuccessDisplay sessionId={sessionId} />;
    } else {
        return <Message message={message} />;
    }
}

const Logo = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="14px"
        height="16px"
        viewBox="0 0 14 16"
        version="1.1"
    >
        <defs />
        <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g
                id="0-Default"
                transform="translate(-121.000000, -40.000000)"
                fill="#E184DF"
            >
                <path
                    d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
                    id="Pilcrow"
                />
            </g>
        </g>
    </svg>
);