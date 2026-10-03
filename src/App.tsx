import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ComparisonProvider, useComparison } from './context/ComparisonContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/common/Navbar';
import { CartDrawer } from './components/common/CartDrawer';
import { CompareDock } from './components/comparison/CompareDock';
import { ProductComparisonModal } from './components/comparison/ProductComparisonModal';
import { Footer } from './components/common/Footer';
import { BackToTop } from './components/common/BackToTop';

// Primary Immediate Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';

// Code-split Secondary Routes for Optimal Initial Bundle Performance
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = React.lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const AuthPage = React.lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

import { Order, ProductCategory } from './types';
import { orderService } from './services/orderService';
import { recordRecentlyViewed } from './utils/recentlyViewed';

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AuthProvider>
          <ComparisonProvider>
            <AppShell />
          </ComparisonProvider>
        </AuthProvider>
      </CartProvider>
    </ToastProvider>
  );
}

function AppShell() {
  const { openCompare } = useComparison();
  const { cart } = useCart();

  // Client-side hash routing
  const [route, setRoute] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>(undefined);
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);
  const [activeSearch, setActiveSearch] = useState<string | undefined>(undefined);
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync with browser hash on load and hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || 'home';
      const parts = hash.split('/');
      const base = parts[0];

      if (base === 'product' && parts[1]) {
        setSelectedProductId(parts[1]);
        setRoute('product');
      } else if (base === 'shop' && parts[1]) {
        setSelectedCategory(decodeURIComponent(parts[1]) as ProductCategory);
        setRoute('shop');
      } else if (base === 'compare') {
        openCompare();
        setRoute('shop');
      } else if (base === 'order-confirmation' && parts[1]) {
        orderService.getOrderById(parts[1]).then(order => {
          if (order) setConfirmedOrder(order);
        });
        setRoute('order-confirmation');
      } else {
        setRoute(base || 'home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (
    newRoute: string,
    category?: ProductCategory,
    options?: { brand?: string; search?: string; dealsOnly?: boolean; newOnly?: boolean }
  ) => {
    setSelectedBrand(options?.brand);
    setActiveSearch(options?.search);
    setDealsOnly(options?.dealsOnly ?? false);
    setNewOnly(options?.newOnly ?? false);

    if (newRoute === 'home') {
      window.location.hash = '';
      setRoute('home');
    } else if (newRoute === 'shop') {
      if (category) {
        setSelectedCategory(category);
        window.location.hash = `#/shop/${category}`;
      } else {
        setSelectedCategory(undefined);
        window.location.hash = '#/shop';
      }
      setRoute('shop');
    } else {
      window.location.hash = `#/${newRoute}`;
      setRoute(newRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string) => {
    recordRecentlyViewed(productId);
    setSelectedProductId(productId);
    window.location.hash = `#/product/${productId}`;
    setRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    window.location.hash = `#/order-confirmation/${order.id}`;
    setRoute('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#171A19]">
      {/* Top Navbar */}
      <Navbar
        currentRoute={route}
        onNavigate={navigate}
        onOpenSearch={() => navigate('shop')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {route === 'home' && (
          <HomePage
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {route === 'shop' && (
          <ShopPage
            initialCategory={selectedCategory}
            initialBrand={selectedBrand}
            initialSearch={activeSearch}
            initialDealsOnly={dealsOnly}
            initialNewOnly={newOnly}
            onNavigateHome={() => navigate('home')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        <React.Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center text-xs font-semibold text-[#5A625C] gap-2">
              <div className="w-4 h-4 border-2 border-[#123C35] border-t-transparent rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          }
        >
          {route === 'product' && selectedProductId && (
            <ProductDetailPage
              productId={selectedProductId}
              onNavigateHome={() => navigate('home')}
              onNavigateShop={(cat) => navigate('shop', cat)}
              onSelectProduct={handleSelectProduct}
              onNavigateCheckout={() => navigate('checkout')}
            />
          )}

          {route === 'cart' && (
            <CartPage
              onNavigateHome={() => navigate('home')}
              onNavigateShop={() => navigate('shop')}
              onNavigateCheckout={() => navigate('checkout')}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {route === 'checkout' && (
            <CheckoutPage
              onNavigateHome={() => navigate('home')}
              onNavigateCart={() => navigate('cart')}
              onOrderSuccess={handleOrderSuccess}
            />
          )}

          {route === 'order-confirmation' && confirmedOrder && (
            <OrderConfirmationPage
              order={confirmedOrder}
              onNavigateOrders={() => navigate('orders')}
              onNavigateHome={() => navigate('home')}
            />
          )}

          {route === 'orders' && (
            <OrdersPage
              onNavigateHome={() => navigate('home')}
              onNavigateShop={() => navigate('shop')}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {route === 'auth' && (
            <AuthPage
              onNavigateHome={() => navigate('home')}
              onAuthSuccess={() => {
                if (cart.length > 0) {
                  navigate('checkout');
                } else {
                  navigate('profile');
                }
              }}
            />
          )}

          {route === 'profile' && (
            <ProfilePage
              onNavigateHome={() => navigate('home')}
              onNavigateOrders={() => navigate('orders')}
              onNavigateWishlist={() => navigate('wishlist')}
              onNavigateShop={() => navigate('shop')}
              onLoggedOut={() => navigate('home')}
            />
          )}

          {route === 'wishlist' && (
            <WishlistPage
              onNavigateHome={() => navigate('home')}
              onNavigateShop={() => navigate('shop')}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {![
            'home',
            'shop',
            'product',
            'cart',
            'checkout',
            'order-confirmation',
            'orders',
            'auth',
            'profile',
            'wishlist',
          ].includes(route) && (
            <NotFoundPage
              onNavigateHome={() => navigate('home')}
              onNavigateShop={() => navigate('shop')}
            />
          )}
        </React.Suspense>
      </main>

      {/* Slide-over Quick Cart Drawer */}
      <CartDrawer
        onNavigateToCart={() => navigate('cart')}
        onNavigateToCheckout={() => navigate('checkout')}
        onNavigateToShop={() => navigate('shop')}
      />

      {/* Floating Comparison Dock (Active when 1-3 products selected) */}
      <CompareDock />

      {/* Side-by-Side Product Comparison Modal */}
      <ProductComparisonModal onSelectProduct={handleSelectProduct} />

      {/* Reusable Toast Notifications */}
      <ToastContainer />

      {/* Floating Back to Top Button */}
      <BackToTop threshold={400} />

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
