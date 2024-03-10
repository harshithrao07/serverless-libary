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
  const { currentAuthenticatedUser } = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [cart, setCart] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function getUsername() {
      const user = await currentAuthenticatedUser();
      setUsername(user)
    }

    getUsername();
  }, []);

  useEffect(() => {
    async function generateCart() {
      if (username) {
        const existingCartsResponse  = await client.graphql({
          query: listCarts,
          variables: { filter: { user: { eq: username } } }
        })

        if (existingCartsResponse.data.listCarts.items.length != 1) {
          const newCart = {
            id: uuidv4(),
            user: username
          };
          const response = await client.graphql({
            query: createCart,
            variables: { input: newCart }
          });
          setCart(newCart); 
        }

        navigate("/cart")
      }
    }

    generateCart();
  }, [username])
  
  return (
    <div>
      
    </div>
  );
};

export default withAuthenticator(Login);
