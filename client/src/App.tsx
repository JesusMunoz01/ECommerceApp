import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Test from './components/Auth/auth0-test'
import Navbar from './components/Navbar/navbar'
import HomePage from './pages/home'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const createUser = useMutation({
    mutationFn: async (data: {accessToken: string, newUser: string}) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.accessToken}`,
        },
        body: JSON.stringify(data.newUser),
      });

      return response.json();
    },
  })

  useEffect(() => {
    const checkFirstLogin = async () => {
      if (isAuthenticated && user) {
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_MANAGEMENT_AUDIENCE as string, 
              scope: "read:current_user"
            }
          });

          const response = await fetch(`${import.meta.env.VITE_AUTH0_MANAGEMENT_AUDIENCE}users/${user.sub}`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = await response.json();
          console.log(userData)

          // Check if it's the first login
          if (userData.logins_count === 1 && user.sub) {
            createUser.mutate({ accessToken, newUser: userData.identities[0].user_id });
          } 
          console.log(userData);
        } catch (error) {
          console.error('Error checking first login:', error);
        }
      }
    };

    checkFirstLogin();
  }, [isAuthenticated, getAccessTokenSilently, user]);

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
