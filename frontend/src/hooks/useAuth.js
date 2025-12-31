import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
// ... (keep all your custom icon definitions)
// Remove these lines at the end of the file:
// export { TrendingUpIcon as HeroTrendingUpIcon } from '@heroicons/react/24/outline';
// export { MenuIcon as HeroMenuIcon } from '@heroicons/react/24/outline';
// export { XIcon as HeroXIcon } from '@heroicons/react/24/outline';
// export { MagnifyingGlassIcon as HeroSearchIcon } from '@heroicons/react/24/outline';
// export { ArrowLeftOnRectangleIcon as HeroLogoutIcon } from '@heroicons/react/24/outline';

// Make sure the file ends with just the icon exports, no return statement