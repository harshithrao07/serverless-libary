import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { generateClient } from 'aws-amplify/api';
import { listBooks } from "../api/queries";

const BookContext = React.createContext()

const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([])
    const [featured, setFeatured] = useState([])
    const [loading, setLoading] = useState(false)

    const client = generateClient()

    useEffect(() => {
        fetchBooks();
    }, [])

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
        <BookContext.Provider value={{ books, featured, loading }}>
            {children}
        </BookContext.Provider>
    )
}

export { BookContext, BookProvider };