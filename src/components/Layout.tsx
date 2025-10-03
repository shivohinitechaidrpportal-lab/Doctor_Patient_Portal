import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Calendar, 
  MessageCircle, 
  Users, 
  Settings, 
  LogOut,
  Search,
  BarChart3,
  UserCheck,
  Bell,
  User as UserIcon
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getNavItems = () => {
    switch (user.role) {
      case 'patient':
        return [
          { path: '/patient/browse', label: 'Browse Doctors', icon: Search },
          { path: '/patient/appointments', label: 'My Appointments', icon: Calendar },
          { path: '/patient/profile', label: 'My Profile', icon: UserIcon },
        ];
      case 'doctor':
        return [
          { path: '/doctor/dashboard', label: 'Dashboard', icon: BarChart3 },
          { path: '/doctor/profile', label: 'My Profile', icon: UserIcon },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-neutral-50 animate-fade-in">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-neutral-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative">
                  <Heart className="h-8 w-8 text-primary-600 transition-transform duration-200 hover:scale-110" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse-soft"></div>
                </div>
                <span className="text-xl font-bold text-neutral-900 tracking-tight">HealthBook</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                      isActivePath(item.path)
                        ? 'text-primary-600 bg-primary-50 shadow-sm'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 animate-slide-up">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-neutral-900">{user.name}</span>
                  <span className="text-xs text-neutral-500 capitalize">{user.role}</span>
                </div>
                <Link
                  to={`/${user.role}/profile`}
                  className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-medium transition-transform duration-200 hover:scale-105"
                >
                  <span className="text-sm font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </Link>
              </div>
              <button
                onClick={logout}
                className="p-2 text-neutral-400 hover:text-error-600 transition-all duration-200 rounded-lg hover:bg-error-50"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-neutral-200 shadow-sm">
        <nav className="flex overflow-x-auto py-2 px-4 space-x-4">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="container-width py-8 animate-slide-up">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;