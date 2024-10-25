// src/components/Layout.tsx
import NavBar from './components/NavBar/NavBar';
import styles from './layout.module.css'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <>
    <NavBar />
    <div className={styles.authLayout}>
      <div className={styles.bannerLeft}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span>PREMIUM</span> <br/>TRANSPORTATION <br/>SERVICES
          </h1>
          <div className={styles.logo}>
              <h1>PREMIUM <span>LIMO</span></h1>
          </div>
        </div>
      </div>    
      <div className={styles.container}>
        {children} {/*This will render the nested route components */}
      </div>    
    </div>
    </>
  );
};

export default Layout;
