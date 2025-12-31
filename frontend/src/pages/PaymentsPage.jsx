import React, { useState, useEffect } from 'react';
// ... other imports
import useAuth from '../hooks/useAuth'; // Fix this line
import './PaymentsPage.css';

const PaymentsPage = () => {
  const { user } = useAuth(); // This will work now
  // ... rest of the component
};