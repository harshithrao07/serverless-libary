import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import { generateClient } from 'aws-amplify/api';
import { listBooks } from "../api/queries";
import { processPayment } from "../api/mutations";

const BookContext = React.createContext()

const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([])
    const [featured, setFeatured] = useState([])
    const [loading, setLoading] = useState(false)

    const client = generateClient()

    useEffect(() => {
        fetchBooks();
    }, [])

    const checkout = async (orderDetails) => {
        const payload = {
          id: uuidv4(),
          userId: localStorage.getItem("userId"),
          ...orderDetails
        };

        localStorage.setItem("payload", JSON.stringify(payload))
        
        try {
          const res = await client.graphql({
            query: processPayment, 
            variables: { input: payload }
          });
          
          // 4000003560000008

          window.location.replace(res.data.processPayment)
          console.log("Session created Successfully.");
        } catch (err) {
          console.log(err);
        }
      };

    const fetchBooks = async () => {
        try {
            setLoading(true)
            // Switch authMode to API_KEY for public access
            const { data } = await client.graphql({
                query: listBooks,
                authMode: "apiKey"
            })

            const books = data.listBooks.items;
            const featured = books.filter((book) => {
                return !!book.featured;
            });
            setBooks(books);
            setFeatured(featured);
            setLoading(false);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <BookContext.Provider value={{ books, featured, loading, checkout }}>
            {children}
        </BookContext.Provider>
    )
}

export { BookContext, BookProvider };