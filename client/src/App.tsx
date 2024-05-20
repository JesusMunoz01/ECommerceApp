import './App.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom' 
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
import SettingsPage from './pages/settings.tsx'
import BrandsPage from './pages/brands.tsx'

function App() {
  const {isAuthenticated, user, getAccessTokenSilently} = useAuth0()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
          <Route path='/brands' element={<BrandsPage />} />
          <Route path='/brands/:id' element={<BrandsPage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          {isAuthenticated && (
                <>
                  <Route path="/account" element={
                  <div className='flex w-full gap-4' style={{ height: 'calc(100vh - 6rem)' }}>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <AccountPage />
                  </div>} />
                  <Route path="/sell" element={
                  <div className='flex w-full' style={{ height: 'calc(100vh - 6rem)' }}>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <SellPage />
                  </div>} />
                  <Route path="/settings" element={
                  <div className='flex w-full' style={{ height: 'calc(100vh - 6rem)' }}>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <SettingsPage />
                  </div>} />
                </>
              )}
        </Routes>
      </Router>
      </div>
    </>
  )
};

export default App
