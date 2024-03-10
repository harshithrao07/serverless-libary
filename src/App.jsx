// React
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Pages
import Layout from './pages/Layout'
import Home from './pages/Home'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import Admin from './pages/Admin'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Error from './pages/Error'

// Amplify Configurations
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import Authentication from './pages/Authentication'
Amplify.configure(config);


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='books' element={<Books />} />
          <Route path='books/:id' element={<BookDetails />} />
          <Route path='cart' element={<Cart />} />
          <Route path='checkout' element={<Checkout />} />
          <Route path='admin' element={<Admin />} />
          <Route path='auth' element={<Authentication />} />
          <Route path='*' element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App