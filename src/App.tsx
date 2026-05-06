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
import TerminosYCondiciones from "./pages/TerminosYCondiciones";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/Orders";
import CustomersAdmin from "./pages/admin/Customers";
import Alerts from "./pages/admin/Alerts";
import Analytics from "./pages/admin/Analytics";
import Inventory from "./pages/admin/Inventory";
import Categories from "./pages/admin/Categories";
import Suppliers from "./pages/admin/Suppliers";
import Settings from "./pages/admin/Settings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGuard from "./components/admin/AdminGuard";
import AdminSidebar from "./components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
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
                path="/politica-de-privacidad"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <PoliticaPrivacidad />
                  </div>
                }
              />
              <Route
                path="/terminos-y-condiciones"
                element={
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <TerminosYCondiciones />
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
                    <div className="flex items-start mx-auto w-full max-w-[1400px]">
                      <div className="hidden md:block shrink-0 sticky top-[70px] h-[calc(100vh-70px)]">
                        <AdminSidebar />
                      </div>
                      <div className="flex-1 min-w-0 px-4 py-8 sm:px-6 lg:px-8">
                        <Outlet />
                      </div>
                    </div>
                  </AdminGuard>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="orders" element={<OrdersAdmin />} />
                <Route path="customers" element={<CustomersAdmin />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="categories" element={<Categories />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="settings" element={<Settings />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
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
