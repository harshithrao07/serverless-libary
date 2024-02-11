// React
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Pages
import Layout from './pages/Layout'
import Home from './pages/Home'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import Admin from './pages/Admin'

// Amplify Configurations
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='books' element={<Books />} />
          <Route path='books/:id' element={<BookDetails />} />
          <Route path='admin' element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App