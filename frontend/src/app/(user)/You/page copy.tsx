'use client'
import React, { useState } from 'react';
import NavBar from '@/app/theme/NavBar/NavBar';
import { useAuth } from '@/app/hooks/authHooks/useAuth';
import { useFetchUserProfile } from '@/app/hooks/userHooks/useFetchUserProfile';

import PrivateRoute from '@/app/components/PrivateRouter';
import EditProfile from '../modal/EditProfile/EditProfile';
import UserProfile from '../components/UserProfile/UserProfile';
import BookingTable from '../components/BookingTable/BookingTable';
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
    return <p>User profile not available.</p>;
  }

  return (
    <PrivateRoute >
      <div className={styles.container}>
      <Skeleton loading={loading || !userProfile.name}>
        <EditProfile
          isOpen={isEditProfileOpen}
          setIsOpen={setIsEditProfileOpen}
          setRegistrationStage={() => {}}
          setData={() => {}}
          userData={userProfile}
        />
        <UserProfile  
            userProfile={userProfile}
            isEditProfileOpen={isEditProfileOpen}
            setIsEditProfileOpen={setIsEditProfileOpen}
        />
        <NavBar pages={pages} className={styles.navBar}/>

        <BookingTable />

      </Skeleton>  
      </div>
    </PrivateRoute>
  );
};

export default UserDashboard;
