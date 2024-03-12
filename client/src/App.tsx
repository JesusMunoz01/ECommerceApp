import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Navbar from './components/Navbar/navbar'
import HomePage from './pages/home.tsx'
import Account from './components/Auth/auth0-profile'

function App() {

  return (
    <>
      <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
      </div>
    </>
  )
}

export default App
