import { createBrowserRouter } from 'react-router';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import Home from './pages/Home';
import RestaurantProfile from './pages/RestaurantProfile';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import SellerOnboarding from './pages/SellerOnboarding';
import SellerDashboard from './pages/SellerDashboard';
import LogisticsMap from './pages/LogisticsMap';
import LeafletMap from './pages/LeafletMap';

export const router = createBrowserRouter([
  // ── Public ────────────────────────────────────────────────────────────────
  { path: '/',               Component: Home },
  { path: '/login',          Component: Login },
  { path: '/role-selection', Component: RoleSelection },
  { path: '/restaurant/:id', Component: RestaurantProfile },
  { path: '/map',            Component: LeafletMap },
  { path: '/logistics',      Component: LogisticsMap },

  // ── Customer ──────────────────────────────────────────────────────────────
  { path: '/cart',           Component: Cart },
  { path: '/favorites',      Component: Favorites },
  { path: '/profile',        Component: Profile },
  { path: '/orders',         Component: Orders },

  // ── Seller ────────────────────────────────────────────────────────────────
  { path: '/seller-onboarding', Component: SellerOnboarding },
  { path: '/seller-dashboard',  Component: SellerDashboard },
]);
