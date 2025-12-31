import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { 
  MenuIcon, 
  SearchIcon, 
  BellIcon, 
  SunIcon, 
  MoonIcon,
  HelpIcon,
  UserIcon,
  SettingsIcon,
  ChevronDownIcon
} from '../../utils/icons';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={onToggleSidebar}>
          <MenuIcon className="h-6 w-6" />
        </button>
        
        <div className="navbar-brand">
          <div className="navbar-logo">EM</div>
          <span className="navbar-title">EduManage</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <SearchIcon className="navbar-search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search..."
          />
        </div>

        <button 
          className="navbar-notification-btn"
          title="Notifications"
        >
          <BellIcon className="h-6 w-6" />
          {notifications > 0 && (
            <span className="navbar-notification-badge">{notifications}</span>
          )}
        </button>

        <button 
          className="navbar-user"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="navbar-user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name || 'User'}</span>
            <span className="navbar-user-role">{user?.role || 'Admin'}</span>
          </div>
          <ChevronDownIcon className="h-4 w-4" />
        </button>

        {showUserMenu && (
          <div className="user-menu">
            <div className="user-menu-header">
              <div className="user-menu-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-menu-info">
                <div className="user-menu-name">{user?.name || 'User'}</div>
                <div className="user-menu-email">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
            
            <div className="user-menu-items">
              <a href="/profile" className="user-menu-item">
                <UserIcon className="h-5 w-5" />
                <span>Profile</span>
              </a>
              <a href="/settings" className="user-menu-item">
                <SettingsIcon className="h-5 w-5" />
                <span>Settings</span>
              </a>
              <a href="/help" className="user-menu-item">
                <HelpIcon className="h-5 w-5" />
                <span>Help & Support</span>
              </a>
              <button className="user-menu-item" onClick={handleLogout}>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;