import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BookProvider } from './context/books.jsx'
import { CartProvider } from './context/cart.jsx'
import { UserProvider } from './context/user.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <CartProvider>
      <BookProvider>
        <App />
      </BookProvider>
    </CartProvider>
  </UserProvider>
)
