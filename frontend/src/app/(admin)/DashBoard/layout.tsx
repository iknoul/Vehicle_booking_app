// src/components/Layout.tsx
import Breadcrumb from '../components/breadCrumb/BreadCrumb';
import SideBar from '../components/sideBar/SideBar';

import styles from './layout.module.css'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className={styles.dashBoardLayout}>
		<SideBar />     
		<div className={styles.container}>
			<Breadcrumb />
			{children} {/*This will render the nested route components */}
		</div>
			
	</div>
  );
};

export default Layout;
