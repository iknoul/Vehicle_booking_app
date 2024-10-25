import { useState } from 'react';
import { useAuth } from '@/app/hooks/authHooks/useAuth';
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
  const [profilePic, setProfilePic] = useState(userProfile.profilePic);

  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };

  const handleLogout = () => {
    logout();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert the file to a URL to preview the image
      const fileUrl = URL.createObjectURL(file);
      setProfilePic(fileUrl);

      // You can also handle uploading the image file to the server here
    }
  };

  return (
    <div className={styles.userProfile}>
      <i
        className={`fa-solid fa-user-pen ${styles.editIcon}`}
        title="Edit"
        onClick={handleEditClick}
      />
      <div className={styles.profileImage}>
        {profilePic ? (
          <Image src={profilePic} width={100} height={100} alt="User" className={styles.userImage} />
        ) : (
          <p>No profile image available</p>
        )}
        {isEdit && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
