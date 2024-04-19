import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom' 
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import Navbar from './components/Navbar/navbar'
import HomePage from './pages/home.tsx'
import Cart, { CartItem } from './pages/cart.tsx'
import UpgradePage from './pages/upgrade.tsx'
import SellPage from './pages/seller.tsx'
import AccountPage from './pages/account.tsx'
import Sidebar from './components/Sidebar/sidebar.tsx'

function App() {
  const {isAuthenticated, user, getAccessTokenSilently} = useAuth0()
  const [cart, setCart] = useState<CartItem[]>([])

  const getUser = useMemo(() => async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user?.sub}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}, [getAccessTokenSilently, user?.sub]);

const userData = useQuery({
    queryKey: ['user', user?.sub],
    queryFn: getUser,
    enabled: !!user
});

  return (
    <>
      <div className='App'>
      <Router>
        <Navbar userData={userData}/>
        <Routes>
          <Route path="/" element={<HomePage setCart={setCart}/>} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>} />
          <Route path='/upgrade' element={<UpgradePage role={userData.data?.plan}/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
          {isAuthenticated ? 
          <>
            <Route path="/account" element={<AccountPage />} /> 
            <Route path="/sell" element={<SellPage />} />
          </>
          : null}
        </Routes>
        <SidebarController />
      </Router>
      </div>
    </>
  )
}

const SidebarController = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return ['/account', '/sell'].includes(location.pathname) && <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />;
};

export default App
