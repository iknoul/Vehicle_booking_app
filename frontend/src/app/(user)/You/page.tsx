'use client'
import React, { lazy, useState, Suspense } from 'react';
import { useAuth } from '@/app/hooks/authHooks/useAuth';
import { useFetchUserProfile } from '@/app/hooks/userHooks/useFetchUserProfile';
import {Empty} from 'antd'
import PrivateRoute from '@/app/components/PrivateRouter';

const Profile = lazy(()=>import('../components/Profile/Profile'))
const  ProfileSideBar = lazy(()=>import('../components/ProfileSideBar/ProfileSideBar'));
const BookingTable = lazy(()=> import('../components/BookingTable/BookingTable'))

import { Skeleton } from 'antd';

import styles from './UserProfile.module.css';

const pages = [
  {
    label: 'Bookings',
    href: '/DashBoard/ManageVehicle',
  },
];

const UserDashboard: React.FC = () => {
  const { logout, userId } = useAuth();
  const { userProfile, loading, error, refetch } = useFetchUserProfile(userId);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [page, setPage] = useState<'bookings' | 'profile' | 'terms' | 'privacyPolicy'>('bookings')
  

  // If the data is still loading, show a skeleton or loading message
  if (loading) {
    return <Skeleton active />;
  }

  // If there's an error fetching the user profile, display an error message
  if (error) {
    return <p>Error fetching user profile: {error.message}</p>;
  }

  // If userProfile is undefined, show a fallback UI
  if (!userProfile) {
    return <div className={`${styles.container} ${styles.noData}`}><Empty description={<p>User profile not available.</p>}></Empty></div>
  }

  return (
    <PrivateRoute >
      <div className={styles.container}>
      <Suspense>
        <ProfileSideBar userProfile={userProfile} page={page} setPage={setPage} logout={logout}/>
        <div className={styles.pages}>
          <div className={styles.head}>
            <h3>
              {page === 'profile' && "My Profile"}
              {page === 'bookings'&& "My Bookings"}
              {page === 'terms'&& "Terms and Conditions"}
              {page === 'privacyPolicy'&& "Privacy Policy"}
            </h3>
          </div>
          {page == 'profile'&&        
            <Profile />
          }
          {page == 'bookings' &&
            <BookingTable />
          }  
        </div>    
      </Suspense>  
      </div>
    </PrivateRoute>
  );
};

export default UserDashboard;
