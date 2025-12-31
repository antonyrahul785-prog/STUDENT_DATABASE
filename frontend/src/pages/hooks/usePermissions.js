import { useContext } from 'react';
import { PermissionContext } from '../context/PermissionContext';
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  
  return context;
};
export const useAuth = () => useContext(AuthContext);