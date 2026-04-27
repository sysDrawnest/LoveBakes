import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import SplashScreen from './components/layout/SplashScreen';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CustomCake from './pages/CustomCake';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <CartProvider>
        <AnimatePresence mode="wait">
          {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
        </AnimatePresence>
        {!showSplash && (
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/custom-cake" element={<CustomCake />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={
                  <div className="text-center py-24">
                    <div className="text-7xl mb-4">🍰</div>
                    <h2 className="text-4xl font-bold text-[#3B2A25] mb-4">Page Not Found</h2>
                    <a href="/" className="text-[#C9A27E] hover:text-[#3B2A25]">← Back to Home</a>
                  </div>
                } />
              </Routes>
            </Layout>
          </Router>
        )}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
