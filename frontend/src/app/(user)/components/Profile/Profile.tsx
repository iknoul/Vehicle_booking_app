import UserProfile from '../UserProfile/UserProfile'
import styles from './profile.module.css'

interface ProfileProps{
  refetch:Function
}
const Profile:React.FC<ProfileProps> = ({refetch})=>{


    return(<div className={styles.profileContainer}>
        <UserProfile refetch={refetch}/>

    </div>)
}

export default Profile