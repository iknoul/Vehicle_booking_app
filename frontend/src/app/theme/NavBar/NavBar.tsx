'use client';

import { useRouter, usePathname } from 'next/navigation';
import styles from './navBar.module.css';

interface NavBarItem{
  label:string,
  href:string,
}

interface NavBarProps{
  pages:NavBarItem[]
  className?: string;
}


const NavBar: React.FC<NavBarProps> = ({pages, className}) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  // console.log(pathname)

  return (
    <div className={`${styles.navBar} ${className}`}>
      <div className={styles.navigation}>
        {pages.map((item, index) => {
          const isActive = pathname === item.href; // Check if the current path is active

          return (
            <span
              key={index}
              className={`${styles.navigationLinks} ${isActive ? styles.activeItem : ''}`}
              onClick={() => router.push(item.href)} // Using router.push for navigation
            >
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;
