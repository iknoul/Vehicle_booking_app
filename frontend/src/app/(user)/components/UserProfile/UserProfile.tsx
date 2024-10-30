import { lazy, useState } from 'react';
import { useAuth } from '@/app/hooks/authHooks/useAuth';
const EditProfile = lazy(()=> import('../../modal/EditProfile/EditProfile'))
const ChangeProfilePicModal = lazy(()=> import('../../modal/ChangeProfilePic/changeProfilePicModal'))

import styles from './userProfile.module.css';
import Image from 'next/image';

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
  userProfile: UserProfile;
}

const UserProfile: React.FC<UserProfileProps> = ({ userProfile }) => {
  const { logout } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [isPorfileChangeOpen, setIsProfileChangeOpen] = useState(false)
  const [profilePic, setProfilePic] = useState(userProfile.profilePic);
  
  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };
  const handleProfileEditClick = () => {
    setIsProfileChangeOpen(!isPorfileChangeOpen);
  };

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
      />
      
      <div className={styles.profileImage}>
        {profilePic ? (
          <Image src={profilePic} width={100} height={100} alt="User" className={styles.userImage} />
        ) : (
          <p>No profile image available</p>
        )}
        <i
          className={`fa-solid fa-pen fa-sm ${styles.profileEdit}`}
          title="Edit Profile"
          onClick={handleProfileEditClick}
      />
      </div>
      <ChangeProfilePicModal 
          isOpen={isPorfileChangeOpen}
          setIsOpen={setIsProfileChangeOpen}
      />
    </div>
  );
};

export default UserProfile;
