// src/context/PermissionContext.jsx or src/contexts/permissions/PermissionContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// Define permission types
export const PermissionTypes = {
  // User permissions
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  
  // Course permissions
  VIEW_COURSES: 'view_courses',
  CREATE_COURSES: 'create_courses',
  EDIT_COURSES: 'edit_courses',
  DELETE_COURSES: 'delete_courses',
  ENROLL_COURSES: 'enroll_courses',
  
  // Content permissions
  VIEW_CONTENT: 'view_content',
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  
  // Admin permissions
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  MANAGE_ROLES: 'manage_roles',
  VIEW_ANALYTICS: 'view_analytics',
  
  // System permissions
  ACCESS_ALL: 'access_all',
};

// Define user roles with default permissions
export const UserRoles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
  GUEST: 'guest',
};

// Role-permission mappings
const RolePermissions = {
  [UserRoles.SUPER_ADMIN]: [
    PermissionTypes.ACCESS_ALL,
  ],
  
  [UserRoles.ADMIN]: [
    PermissionTypes.VIEW_ADMIN_PANEL,
    PermissionTypes.VIEW_USERS,
    PermissionTypes.CREATE_USERS,
    PermissionTypes.EDIT_USERS,
    PermissionTypes.DELETE_USERS,
    PermissionTypes.VIEW_COURSES,
    PermissionTypes.CREATE_COURSES,
    PermissionTypes.EDIT_COURSES,
    PermissionTypes.DELETE_COURSES,
    PermissionTypes.VIEW_CONTENT,
    PermissionTypes.EDIT_CONTENT,
    PermissionTypes.VIEW_ANALYTICS,
  ],
  
  [UserRoles.INSTRUCTOR]: [
    PermissionTypes.VIEW_COURSES,
    PermissionTypes.CREATE_COURSES,
    PermissionTypes.EDIT_COURSES,
    PermissionTypes.DELETE_COURSES,
    PermissionTypes.VIEW_CONTENT,
    PermissionTypes.CREATE_CONTENT,
    PermissionTypes.EDIT_CONTENT,
    PermissionTypes.DELETE_CONTENT,
    PermissionTypes.ENROLL_COURSES,
  ],
  
  [UserRoles.STUDENT]: [
    PermissionTypes.VIEW_COURSES,
    PermissionTypes.ENROLL_COURSES,
    PermissionTypes.VIEW_CONTENT,
  ],
  
  [UserRoles.GUEST]: [
    PermissionTypes.VIEW_COURSES,
  ],
};

// Create context
const PermissionContext = createContext();

// Custom hook for using permission context
export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};

// Provider component
export const PermissionProvider = ({ 
  children, 
  initialUser = null,
  onPermissionChange,
  storageKey = 'user_permissions'
}) => {
  // State for user info and permissions
  const [user, setUser] = useState(initialUser);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user and permissions
  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        // Check localStorage for saved user data
        const savedUser = localStorage.getItem(storageKey);
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          await setUserData(parsedUser);
        } else if (initialUser) {
          await setUserData(initialUser);
        } else {
          // Set as guest by default
          await setUserData({
            id: null,
            username: 'guest',
            roles: [UserRoles.GUEST],
            customPermissions: [],
          });
        }
      } catch (error) {
        console.error('Error initializing user permissions:', error);
        // Fallback to guest
        await setUserData({
          id: null,
          username: 'guest',
          roles: [UserRoles.GUEST],
          customPermissions: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [initialUser, storageKey]);

  // Set user data and calculate permissions
  const setUserData = useCallback(async (userData) => {
    if (!userData) return;
    
    setUser(userData);
    setRoles(userData.roles || []);
    
    // Calculate permissions based on roles and custom permissions
    const calculatedPermissions = calculatePermissions(
      userData.roles || [],
      userData.customPermissions || []
    );
    
    setPermissions(calculatedPermissions);
    
    // Save to localStorage if user is authenticated
    if (userData.id) {
      localStorage.setItem(storageKey, JSON.stringify(userData));
    } else {
      localStorage.removeItem(storageKey);
    }
    
    // Notify about permission change
    if (onPermissionChange) {
      onPermissionChange({
        user: userData,
        roles: userData.roles || [],
        permissions: calculatedPermissions,
      });
    }
  }, [onPermissionChange, storageKey]);

  // Calculate permissions from roles and custom permissions
  const calculatePermissions = useCallback((userRoles, customPermissions = []) => {
    const roleBasedPermissions = new Set();
    
    // Add permissions from each role
    userRoles.forEach(role => {
      const rolePerms = RolePermissions[role] || [];
      rolePerms.forEach(perm => roleBasedPermissions.add(perm));
    });
    
    // Add custom permissions
    customPermissions.forEach(perm => roleBasedPermissions.add(perm));
    
    // If user has ACCESS_ALL, add all permissions
    if (roleBasedPermissions.has(PermissionTypes.ACCESS_ALL)) {
      return Object.values(PermissionTypes);
    }
    
    return Array.from(roleBasedPermissions);
  }, []);

  // Login function
  const login = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      await setUserData(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [setUserData]);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const guestUser = {
        id: null,
        username: 'guest',
        roles: [UserRoles.GUEST],
        customPermissions: [],
      };
      await setUserData(guestUser);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [setUserData]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!permission) return false;
    
    // Array of permissions check
    if (Array.isArray(permission)) {
      return permission.some(perm => permissions.includes(perm));
    }
    
    // Single permission check
    return permissions.includes(permission);
  }, [permissions]);

  // Check if user has all specified permissions
  const hasAllPermissions = useCallback((requiredPermissions) => {
    if (!Array.isArray(requiredPermissions)) return false;
    return requiredPermissions.every(perm => permissions.includes(perm));
  }, [permissions]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!role) return false;
    
    // Array of roles check
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    // Single role check
    return roles.includes(role);
  }, [roles]);

  // Check if user has all specified roles
  const hasAllRoles = useCallback((requiredRoles) => {
    if (!Array.isArray(requiredRoles)) return false;
    return requiredRoles.every(role => roles.includes(role));
  }, [roles]);

  // Add custom permission to user
  const addPermission = useCallback((permission) => {
    if (!permission || permissions.includes(permission)) return;
    
    const updatedUser = {
      ...user,
      customPermissions: [...(user.customPermissions || []), permission]
    };
    
    setUserData(updatedUser);
  }, [user, permissions, setUserData]);

  // Remove custom permission from user
  const removePermission = useCallback((permission) => {
    if (!permission || !permissions.includes(permission)) return;
    
    const updatedUser = {
      ...user,
      customPermissions: (user.customPermissions || []).filter(perm => perm !== permission)
    };
    
    setUserData(updatedUser);
  }, [user, permissions, setUserData]);

  // Update user roles
  const updateRoles = useCallback((newRoles) => {
    const updatedUser = {
      ...user,
      roles: newRoles
    };
    
    setUserData(updatedUser);
  }, [user, setUserData]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // State
    user,
    permissions,
    roles,
    isLoading,
    
    // Actions
    login,
    logout,
    setUser: setUserData,
    updateRoles,
    addPermission,
    removePermission,
    
    // Checkers
    hasPermission,
    hasAllPermissions,
    hasRole,
    hasAllRoles,
    
    // Constants
    PermissionTypes,
    UserRoles,
  }), [
    user,
    permissions,
    roles,
    isLoading,
    login,
    logout,
    setUserData,
    updateRoles,
    addPermission,
    removePermission,
    hasPermission,
    hasAllPermissions,
    hasRole,
    hasAllRoles,
  ]);

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

PermissionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
    email: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    customPermissions: PropTypes.arrayOf(PropTypes.string),
  }),
  onPermissionChange: PropTypes.func,
  storageKey: PropTypes.string,
};

PermissionProvider.defaultProps = {
  initialUser: null,
  onPermissionChange: null,
  storageKey: 'user_permissions',
};

export default PermissionContext;