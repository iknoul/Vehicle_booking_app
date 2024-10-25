import { useAuth } from '@/app/hooks/authHooks/useAuth';
import styles from './userProfile.module.css'


interface UserProfile{
    id: string,
    name: string,
    profilePic: string,
    email: string,
    mobile: string,
    pinCode: string,
    city: string
}

interface UserProfileProps{
    isEditProfileOpen: boolean;
    setIsEditProfileOpen: Function
    userProfile: UserProfile;
}

const UserProfile:React.FC<UserProfileProps> = ({setIsEditProfileOpen, isEditProfileOpen, userProfile})=>{

    const { logout } = useAuth();


    const handleEditClick = () => {
        setIsEditProfileOpen(!isEditProfileOpen);
      };
    
      const handleLogout = () => {
        logout();
      };
    
      // Log userProfile to see what data is being received
      console.log(userProfile, 'User profile data');
      
    return(
        <div className={styles.userProfile}>
          <i
            className={`fa-solid fa-user-pen ${styles.editIcon}`}
            title="Edit"
            onClick={handleEditClick}
          />
          <i
            className={`fa-solid fa-arrow-right-from-bracket ${styles.logOutIcon}`}
            title="Log out"
            onClick={handleLogout}
          />
          <div className={styles.profileImage}>
            {/* Check if the image property exists before rendering the image */}
            {userProfile.profilePic ? (
              <img
                src={userProfile.profilePic}
                alt="User Image"
                className={styles.userImage}
              />
            ) : (
              <p>No profile image available</p>
            )}
          </div>
          <div className={styles.userInfo}>
            <h2>{userProfile.name}</h2>
            <p>{userProfile.email}</p>
          </div>
        </div>
    )
}

export default UserProfile