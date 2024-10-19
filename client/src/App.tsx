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
import OrderPage from './pages/order.tsx'
import { Product } from './components/Products/productCard.tsx'

function App() {
  const {isAuthenticated, user, getAccessTokenSilently} = useAuth0()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userData, setUser } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const productQuery = useQuery({
      queryKey: ['products'], 
      queryFn: async () => {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
          const data = await response.json();
          return data;
      }});

  useEffect(() => {
      if(productQuery.isSuccess) {
          setProducts(productQuery.data.products);
      }
  }, [productQuery]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userQuery = useQuery({
    queryKey: ['user', user?.sub],
    queryFn: async () => {
      // console.log(user)
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user?.sub}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      const data = await response.json();
      // console.log(data);
      return data;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (userQuery.data) {
      console.log(userQuery.data);
      setUser({
        ...userQuery.data, 
        subEndDate: userQuery.data.subEndDate ? 
        new Date(userQuery.data.subEndDate).toLocaleDateString() :
        null
      });
    }
  }, [userQuery.data]);

  if(productQuery.isLoading) return <div>Loading...</div>;
  if(productQuery.isError) return <div>Error fetching products</div>;

  return (
    <div className='App'>
      <Router>
        <Navbar products={products}/>
        <div className='routes'>
        <Routes>
          <Route path="/" element={<HomePage setCart={setCart} products={products}/>} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>} />
          <Route path='/upgrade' element={<UpgradePage role={userData?.plan}/>} />
          <Route path='/brands' element={<BrandsPage />} />
          <Route path='/brands/:id' element={<BrandPage setCart={setCart}/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
          {isAuthenticated && (
                <>
                  <Route path="/account" element={
                  <div className='flex w-full gap-1 md:gap-4 h-full'>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <AccountPage />
                  </div>} />
                  <Route path="/sell" element={
                  <div className='flex w-full h-full'>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <SellPage />
                  </div>} />
                  { userData?.plan !== "Free" &&
                    <Route path="/create-brand" element={
                    <div className='flex w-full h-full'>
                      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                      <CreateBrandPage />
                    </div>} />
                  }
                  <Route path="/settings" element={
                  <div className='flex w-full h-full'>
                    <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                    <SettingsPage />
                  </div>} />
                  <Route path='/brand/edit/:id' element={<EditBrandPage />} />
                  <Route path='/order/:id' element={<OrderPage />} />
                </>
              )}
        </Routes>
        </div>
      </Router>
    </div>
  )
};

export default App
