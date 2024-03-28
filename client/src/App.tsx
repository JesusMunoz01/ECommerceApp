import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Navbar from './components/Navbar/navbar'
import HomePage from './pages/home.tsx'
import Account from './components/Auth/auth0-profile'
import Cart, { CartItem } from './pages/cart.tsx'
import { useState } from 'react'
import UpgradePage from './pages/upgrade.tsx'

function App() {
  const [cart, setCart] = useState<CartItem[]>([])

  return (
    <>
      <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage setCart={setCart}/>} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>} />
          <Route path='/upgrade' element={<UpgradePage/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
      </div>
    </>
  )
}

export default App
