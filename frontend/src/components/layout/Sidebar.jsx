import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon
} from '../../utils/icons';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { path: '/leads', label: 'Leads', icon: <UsersIcon className="h-5 w-5" /> },
    { path: '/students', label: 'Students', icon: <UsersIcon className="h-5 w-5" /> },
    { path: '/courses', label: 'Courses', icon: <AcademicCapIcon className="h-5 w-5" /> },
    { path: '/enrollments', label: 'Enrollments', icon: <DocumentTextIcon className="h-5 w-5" /> },
    { path: '/payments', label: 'Payments', icon: <CurrencyRupeeIcon className="h-5 w-5" /> },
    { path: '/attendance', label: 'Attendance', icon: <ChartBarIcon className="h-5 w-5" /> },
    { path: '/content', label: 'Content', icon: <DocumentTextIcon className="h-5 w-5" /> },
    { path: '/users', label: 'Users', icon: <UsersIcon className="h-5 w-5" /> },
    { path: '/profile', label: 'Profile', icon: <CogIcon className="h-5 w-5" /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">EduManage</h2>
        <button className="sidebar-close" onClick={onClose}>
          ×
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
        <div className="sidebar-help">
          <a href="/help" className="sidebar-help-link">Help & Support</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;