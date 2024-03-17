import { getCurrentUser } from 'aws-amplify/auth';
import React from "react";
import { generateClient } from "aws-amplify/api";
import { listCarts } from '../api/queries';

const UserContext = React.createContext()

const UserProvider = ({ children }) => {

    const client = generateClient()

    async function currentAuthenticatedUser() {
        try {
            const { username, userId } = await getCurrentUser();
            localStorage.setItem("username", username)
            localStorage.setItem("userId", userId)
        } catch (err) {
            console.log(err);
        }
    }

    async function findCartID() {
        try {
            const username = localStorage.getItem("username");
            const existingCartsResponse = await client.graphql({
                query: listCarts,
                variables: { filter: { user: { eq: username } } }
            })
            const cartID = existingCartsResponse.data.listCarts.items[0].id
            localStorage.setItem("cartId", cartID)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <UserContext.Provider value={{ currentAuthenticatedUser, findCartID }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider };