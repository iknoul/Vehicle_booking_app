import { useState } from 'react'
import styles from './profileSideBar.module.css'



const sideBarItems = [
    {
        label: 'My Profile',
        icon: 'fa-solid fa-user-large',
        path: 'profile' as string

    },
    {
        label: 'Bookings',
        icon: 'fa-solid fa-clock-rotate-left',
        path: 'bookings' as string

    },
    {
        label: 'Change Passwrod',
        icon: 'fa-solid fa-clock-rotate-left',
        path: 'changePassword' as string

    },
    {
        label: 'Terms & Conditions',
        icon: 'fa-solid fa-file-contract',
        path: 'terms' as string
    },
    {
        label: 'Privacy Policy',
        icon: 'fa-solid fa-handshake-simple',
        path: 'privacyPolicy' as string
    },
]

interface UserProfile{
    mobile:string;
    name: string;
    profilePic: string;
}
interface SideBarProps{
    userProfile: UserProfile
    setPage: Function
    page: string;
    logout: Function
}

const ProfileSideBar:React.FC<SideBarProps> = ({userProfile, setPage, page, logout})=>{


    const handleClick = (path: string)=>{
        setPage(path)
    }
    const handleLogout = ()=>{
        logout()
    }

    return(
    <div className={styles.sideBar}>
        <div className={styles.sideBarHead}>
            <div className={styles.imageContainer}>
                <img src={userProfile.profilePic} alt="profile image" />
            </div>
            <p >{userProfile?.name}</p>
            <p className={styles.mobile}>{userProfile?.mobile}</p>
        </div>
        {sideBarItems.map((item, index)=>{
            return(
            <div key={item.label} className={`${styles.sideBarItem} ${item.path == page ? styles.active : ''}`} onClick={()=>{handleClick(item.path)}}>
                <i className={`${item.icon}`} />
                <p>{item.label}</p>
            </div>)
        })

        }
        <div className={styles.sideBarItem} onClick={handleLogout}>
            <i className={`fa-solid fa-right-from-bracket`} />  
            <p>Logout</p>
        </div>

    </div>)
}

export default ProfileSideBar