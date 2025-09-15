import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type Props = { children: React.ReactElement };

const AuthGate: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  // Use the same authentication method as authService
  const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
  
  if (!isAuthed) {
    // Determine the correct login path based on current location
    const basePath = location.pathname.startsWith('/iteration1') ? '/iteration1' : '';
    return <Navigate to={`${basePath}/login`} replace />;
  }
  return children;
};

export default AuthGate;


