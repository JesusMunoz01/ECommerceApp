import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Test from './components/Auth/auth0-test'
import Navbar from './components/Navbar/navbar'
import HomePage from './pages/home'

function App() {

  return (
    <>
      <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
      </div>
    </>
  )
}

export default App
