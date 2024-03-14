import React, { useContext, useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/api";
import { createCart } from '../api/mutations';
import { UserContext } from "../context/user";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import { listCarts } from '../api/queries';

const Login = () => {
  const client = generateClient();
  const { currentAuthenticatedUser, findCartID } = useContext(UserContext)
  const [user, setUser] = useState("")
  const [userId, setuserId] = useState("")
  const [cart, setCart] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function getUsername() {
      await currentAuthenticatedUser();
      setUser(sessionStorage.getItem("username"))
      setuserId(sessionStorage.getItem("userId"))
    }

    getUsername();
  }, []);

  useEffect(() => {
    async function generateCart() {
      if (user) {
        const existingCartsResponse  = await client.graphql({
          query: listCarts,
          variables: { filter: { user: { eq: user } } }
        })

        if (existingCartsResponse.data.listCarts.items.length != 1) {
          const newCart = {
            id: uuidv4(),
            user: user
          };
          const response = await client.graphql({
            query: createCart,
            variables: { input: newCart }
          });
          setCart(newCart); 
        }

        await findCartID();
        navigate(`/user/${userId}`)
      }
    }

    generateCart();
  }, [user])
  
  return (
    <div>
      
    </div>
  );
};

export default withAuthenticator(Login);
