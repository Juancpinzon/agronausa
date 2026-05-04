import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./hooks/useCart";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileNav from "./components/layout/MobileNav";
import CartDrawer from "./components/cart/CartDrawer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirm from "./pages/OrderConfirm";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/Orders";
import CustomersAdmin from "./pages/admin/Customers";
import AdminGuard from "./components/admin/AdminGuard";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import { runSeedIfEmpty } from "./lib/seed";

function App() {
  useEffect(() => {
    runSeedIfEmpty().catch((error) => {
      console.error("Seed initialization failed:", error);
    });
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-bg text-text font-body">
          <Header />
          <CartDrawer />
          <main>
            <Routes>
              {/* Home — full-bleed (no container, hero spans 100vw) */}
              <Route path="/" element={<Home />} />

              {/* All other pages — contained layout */}
              <Route
                path="/catalog"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Catalog />
                  </div>
                }
              />
              <Route
                path="/product/:slug"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Product />
                  </div>
                }
              />
              <Route
                path="/cart"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Cart />
                  </div>
                }
              />
              <Route
                path="/checkout"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Checkout />
                  </div>
                }
              />
              <Route
                path="/politica-privacidad"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <PoliticaPrivacidad />
                  </div>
                }
              />
              <Route
                path="/order-confirm"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <OrderConfirm />
                  </div>
                }
              />
              <Route
                path="/account"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Account />
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Login />
                  </div>
                }
              />
              <Route
                path="/register"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Register />
                  </div>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                      <Dashboard />
                    </div>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminGuard>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                      <ProductsAdmin />
                    </div>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminGuard>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                      <OrdersAdmin />
                    </div>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminGuard>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                      <CustomersAdmin />
                    </div>
                  </AdminGuard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <MobileNav />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
