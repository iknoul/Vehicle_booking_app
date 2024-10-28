'use client'
import { useState } from 'react'
import styles from './sideBar.module.css'
import { usePathname, useRouter } from 'next/navigation'

interface MyProps{
   
}

const SideBarItems = [
    {
        label : 'view',
        icon: 'fa-solid fa-chart-line xl',
        href: '/DashBoard',
    },
    {
        label : 'Manage vehicle',
        icon: 'fa-solid fa-screwdriver-wrench xl',
        href: '/DashBoard/ManageVehicle',
    },
    {
        label : 'Manage aset',
        icon: 'fa-solid fa-car-on fa-xl',
        href: '/DashBoard/Aset',
    },
    {
        label : 'ErrorTable',
        icon: 'fa-solid fa-circle-exclamation xl',
        href: '/DashBoard/ErrorTable',
    },
] 
const SideBar:React.FC <MyProps>= ({})=>{

    const router = useRouter();

    const [isSideBarMax, setIsSideBarMax] = useState(true)
    
    const handleSideBarSize = ()=>{
        setIsSideBarMax((prevState) => !prevState)
    }
    const pathname = usePathname(); // Get the current route


    return(
        <div className={`${styles.sideBar} ${isSideBarMax?styles.sideBarMax:''}`}>
            <div className={styles.sideBarHead} onClick={handleSideBarSize}>
                <i className={`fa-solid fa-angles-left  ${styles.iconItem}`}></i>
            </div>
            
            {
                SideBarItems.map((item, index)=>{
                    const isActive = pathname === item.href;
                return(
                    <div 
                        key={index} 
                        className={`${styles.sideBarItem} ${isActive ? styles.active : ''}`}
                        onClick={() => router.push(item.href)}
                    >
                        <i className={`${item.icon} ${isSideBarMax?'':''}`}></i>
                        {isSideBarMax &&
                            <p>{item.label}</p>
                        }
                    </div>
                )
                })
            }
        </div>)
    
}

export default SideBar