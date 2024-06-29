import './App.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom' 
import { useEffect, useState } from 'react'
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
import BrandPage from './pages/brand.tsx'
import EditBrandPage from './pages/editBrand.tsx'
import { useUser } from './utils/userContext.tsx'
import CreateBrandPage from './pages/createBrand.tsx'

function App() {
  const {isAuthenticated, user, getAccessTokenSilently} = useAuth0()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userData, setUser } = useUser(); 

  console.log(isAuthenticated)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userQuery = useQuery({
    queryKey: ['user', user?.sub],
    queryFn: async () => {
      console.log(user)
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user?.sub}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      const data = await response.json();
      console.log(data);
      return data;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  return (
    <>
      <div className='App'>
      <Router>
        <Navbar />
        <div className='routes'>
        <Routes>
          <Route path="/" element={<HomePage setCart={setCart}/>} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>} />
          <Route path='/upgrade' element={<UpgradePage role={userData?.plan}/>} />
          <Route path='/brands' element={<BrandsPage />} />
          <Route path='/brands/:id' element={<BrandPage setCart={setCart}/>} />
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
                  <Route path="/newBrand" element={
                  <div className='flex w-full' style={{ height: 'calc(100vh - 6rem)' }}>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <CreateBrandPage />
                  </div>} />
                  <Route path="/settings" element={
                  <div className='flex w-full' style={{ height: 'calc(100vh - 6rem)' }}>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <SettingsPage />
                  </div>} />
                  <Route path='/brand/edit/:id' element={<EditBrandPage />} />
                </>
              )}
        </Routes>
        </div>
      </Router>
      </div>
    </>
  )
};

export default App
