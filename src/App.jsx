import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import {
  AuthModal,
  CartDrawer,
  MenuDrawer,
  SearchModal,
  ToastNotification,
  WishlistDrawer,
} from './components/layout/DrawersAndModals';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import { StoreProvider } from './context/StoreContext';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopPage from './pages/ShopPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <div className="relative flex min-h-screen flex-col bg-[#F3F3F5] text-[#111111]">
          {/* Fixed LOOMY Background maintained on every page */}
          <div
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
            aria-hidden="true"
          >
            <span className="text-[23vw] leading-none font-extrabold tracking-[-0.065em] text-[#111111]/[0.06] uppercase">
              LOOMY
            </span>
          </div>

          <Navbar />
          <main className="relative z-10 flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
          </main>
          <div className="relative z-10">
            <Footer />
          </div>
        </div>

        <CartDrawer />
        <WishlistDrawer />
        <SearchModal />
        <MenuDrawer />
        <AuthModal />
        <ToastNotification />
      </StoreProvider>
    </BrowserRouter>
  );
}
