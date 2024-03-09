import './App.css'
import LoginButton from './components/Auth/auth0-login'
import Navbar from './components/Navbar/navbar'

function App() {

  return (
    <>
      <div className='App'>
        <Navbar />
        <LoginButton />
      </div>
    </>
  )
}

export default App
