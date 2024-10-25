import React from 'react';
import { useRouter } from 'next/navigation';
import {usePageLoading} from '@/app/hooks/pageLoadingHook/usePageLoadingHook'
import styles from './styles/navBar.module.css';



const Navbar:React.FC = () => {

  const {triggerTransition} = usePageLoading()

  const router  = useRouter()

  const handleOnClick = (path:string)=>{
    console.log(`/${path}`, 'here the path')
    triggerTransition(()=>{router.push(`/${path}`)})
    
  }
  
  return (
    <nav className={`${styles.navbar}`} >
      <div className={styles.logo}>
        <h1>PREMIUM <span>LIMO</span></h1>
      </div>
      <ul className={styles.navLinks}>
        <li><a href="/">Home</a></li>
        <li><a href="#fleet">Fleet</a></li>
        <li><a onClick={()=>{handleOnClick('DashBoard')}}>DashBoard</a></li>
        <li><a>Reviews</a></li>
        <li><a href="#services">Services</a></li>
        <li onClick={()=>{handleOnClick('You')}}><i className="fa-regular fa-face-smile"></i>&nbsp;<a >You</a></li>
      </ul>
      
    </nav>
  );
};

export default Navbar;
