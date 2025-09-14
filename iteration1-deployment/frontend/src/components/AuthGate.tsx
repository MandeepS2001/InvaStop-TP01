import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = { children: React.ReactElement };

const AuthGate: React.FC<Props> = ({ children }) => {
  const isAuthed = typeof window !== 'undefined' && sessionStorage.getItem('tp01_auth') === 'true';
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AuthGate;


