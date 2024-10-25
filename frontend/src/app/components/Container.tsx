import {useRouter} from "next/navigation";
import { usePageLoading } from "../hooks/pageLoadingHook/usePageLoadingHook";
import Navbar from '../components/NavBar'


import styles from './styles/container.module.css'

const Container = ()=>{

  const {triggerTransition} = usePageLoading()
  const router = useRouter()

  const handleLoginClick = ()=>{ 
    triggerTransition(()=>{router.push('/Login')})
  }
  const handleSignUpClick = ()=>{
    triggerTransition(()=>{router.push('/Registration')})
  }
 
    return(
    <div className={styles.container}>
        <Navbar />
        <h1 className={styles.title}>
          <span>PREMIUM</span> <br/>TRANSPORTATION <br/>SERVICES
        </h1>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleSignUpClick}>NEW USER !</button>
          <button className={styles.button} onClick={handleLoginClick}>LOG IN</button>

       </div>
    </div>)

}

export default Container