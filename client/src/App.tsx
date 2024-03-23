import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Navbar from './components/Navbar/navbar'
import HomePage from './pages/home.tsx'
import Account from './components/Auth/auth0-profile'
import CheckoutPage from './components/Stripe/CheckoutPage.tsx'
import Cart from './pages/cart.tsx'
import { useState } from 'react'
import { Product } from './components/Products/productCard.tsx'

function App() {
  const [cart, setCart] = useState<Product[]>([])

  return (
    <>
      <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage setCart={setCart}/>} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart cart={cart}/>} />
          <Route path="/checkout" element={<CheckoutPage cart={cart}/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
      </div>
    </>
  )
}

export default App
