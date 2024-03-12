import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import { generateClient } from 'aws-amplify/api';
import { listBooks } from "../api/queries";
import { processOrder } from "../api/mutations";

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
          ...orderDetails
        };

        console.log(payload)

        try {
          await client.graphql({
            query: processOrder, 
            variables: { input: payload }
        });
          console.log("Order is successful");
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