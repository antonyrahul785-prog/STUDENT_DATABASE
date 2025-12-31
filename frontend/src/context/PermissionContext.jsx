import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PermissionContext = createContext(null);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
      setUserRole(user.role || '');
    } else {
      setPermissions([]);
      setUserRole('');
    }
  }, [user]);

  const hasPermission = (requiredPermission) => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Check if user has the specific permission
    return permissions.includes(requiredPermission);
  };

  const hasAnyPermission = (requiredPermissions) => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    return requiredPermissions.some(permission => 
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (requiredPermissions) => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    return requiredPermissions.every(permission => 
      permissions.includes(permission)
    );
  };

  const getUserRole = () => {
    return userRole;
  };

  const value = {
    permissions,
    userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRole,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};