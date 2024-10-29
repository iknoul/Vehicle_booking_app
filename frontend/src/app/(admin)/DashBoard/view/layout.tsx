import NavBar from '../../../theme/NavBar/NavBar';

import styles from './layout.module.css'

interface LayoutProps {
  children: React.ReactNode;
}

const pages = [
  {
    label: 'Book Per Vehicle',
    href: '/DashBoard/view/BookPerVehicle',
  },
  {
    label: 'Bookings Table',
    href: '/DashBoard/view/BookingsTable',
  },
  {
    label: 'New User',
    href: '/DashBoard/view/AnotherPage',
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.dashBoardLayout}>
      <NavBar pages={pages} />
      
      {/* Render default page if no children */}
      {children}
    </div>
  );
};

export default Layout;
