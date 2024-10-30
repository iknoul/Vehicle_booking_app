import { lazy, useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/authHooks/useAuth';
const EditProfile = lazy(()=> import('../../modal/EditProfile/EditProfile'))
const ChangeProfilePicModal = lazy(()=> import('../../modal/ChangeProfilePic/changeProfilePicModal'))

import styles from './userProfile.module.css';
import Image from 'next/image';
import { useFetchUserProfile } from '@/app/hooks/userHooks/useFetchUserProfile';
import { Empty } from 'antd';

interface UserProfile {
  id: string;
  name: string;
  profilePic: string;
  email: string;
  mobile: string;
  pinCode: string;
  city: string;
}

interface UserProfileProps {
  refetch :Function
}

const UserProfile: React.FC<UserProfileProps> = ({refetch: refetchUserData}) => {

  const { userId } = useAuth();

  const { userProfile, loading, error, refetch } = useFetchUserProfile(userId);
  const [isEdit, setIsEdit] = useState(false);
  const [isPorfileChangeOpen, setIsProfileChangeOpen] = useState(false)
  
  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };
  const handleProfileEditClick = () => {
    setIsProfileChangeOpen(!isPorfileChangeOpen);
  };
  const handleRefetch = () => {
    refetchUserData()
    refetch()
  }
  
  if (!userProfile) {
    return (
      <div className={`${styles.container} ${styles.noData}`}>
        <Empty description={<p>User profile not available.</p>} />
      </div>
    );
  }

  return (
    <div className={styles.userProfile}>
      {/* <EditProfile isOpen={isEdit} {{...userProfile}} setRegistrationStage={()=>{}} />s */}
      <i
        className={`fa-solid fa-user-pen ${styles.editIcon}`}
        title="Edit"
        onClick={handleEditClick}
      />
      <EditProfile 
        isOpen={isEdit}
        userData={userProfile}
        setIsOpen={setIsEdit}
        refetch = {handleRefetch}
      />
       <ChangeProfilePicModal 
          isOpen={isPorfileChangeOpen}
          setIsOpen={setIsProfileChangeOpen}
          refetch = {handleRefetch}
      />
      <div className={styles.profileImage}>
        {userProfile.profilePic ? (
          <Image src={userProfile.profilePic} width={100} height={100} alt="User" className={styles.userImage} />
        ) : (
          <p>No profile image available</p>
        )}
        <i
          className={`fa-solid fa-pen fa-sm ${styles.profileEdit}`}
          title="Edit Profile"
          onClick={handleProfileEditClick}
      />
      </div>
    </div>
  );
};

export default UserProfile;
