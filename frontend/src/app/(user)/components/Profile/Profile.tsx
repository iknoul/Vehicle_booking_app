import { useAuth } from '@/app/hooks/authHooks/useAuth';
import UserProfile from '../UserProfile/UserProfile'
import styles from './profile.module.css'
import { useFetchUserProfile } from '@/app/hooks/userHooks/useFetchUserProfile';
const Profile:React.FC = ()=>{

    
  const { logout, userId } = useAuth();
  const { userProfile, loading, error, refetch } = useFetchUserProfile(userId);

    return(<div className={styles.profileContainer}>
        <UserProfile userProfile={userProfile} />

    </div>)
}

export default Profile