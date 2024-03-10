import './App.css'
import LoginButton from './components/Auth/auth0-login'
import LogoutButton from './components/Auth/auth0-logout'
import Test from './components/Auth/auth0-test'
import Navbar from './components/Navbar/navbar'

function App() {

  return (
    <>
      <div className='App'>
        <Navbar />
        <LoginButton />
        <LogoutButton />
        <Test />
      </div>
    </>
  )
}

export default App
