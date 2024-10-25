'use client'
import { useRouter } from 'next/navigation'
import styles from './navBar.module.css'

const NavBar = ()=>{
    const router = useRouter()

    const handleClick = ()=>{
        router.push('/')
    } 
    return(
    <div className={styles.navBar}>
        <button onClick={handleClick} className={styles.backButton}>
        <i className='fa-solid fa-backward fa-xl'></i>
        </button>
        
    </div>)
}

export default NavBar