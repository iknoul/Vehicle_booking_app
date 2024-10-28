// app/(user)/layout.tsx
import React from 'react';
import NavBar from './components/NavBar/NavBar';
import PrivateRoute from '../components/PrivateRouter';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PrivateRoute requiredRole='user'>
        <NavBar />
        {children}
      </PrivateRoute>
    </div>
  );
}