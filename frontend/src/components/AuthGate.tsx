import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type Props = { children: React.ReactElement };

const AuthGate: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const isAuthed = typeof window !== 'undefined' && sessionStorage.getItem('tp01_auth') === 'true';
  
  if (!isAuthed) {
    // Determine the correct login path based on current location
    const basePath = location.pathname.startsWith('/iteration1') ? '/iteration1' : '';
    return <Navigate to={`${basePath}/login`} replace />;
  }
  return children;
};

export default AuthGate;


