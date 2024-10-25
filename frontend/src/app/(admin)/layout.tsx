// app/(user)/layout.tsx
import React from 'react';
import PrivateRoute from '../components/PrivateRouter';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PrivateRoute requiredRole='admin'>
        {children}
      </PrivateRoute>
    </div>
  );
}