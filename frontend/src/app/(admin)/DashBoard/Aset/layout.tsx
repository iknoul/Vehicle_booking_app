import NavBar from '../../../theme/NavBar/NavBar';
import styles from './layout.module.css'

interface LayoutProps {
  children: React.ReactNode;
}

const pages = [
	{
		label: 'Manage Vehicle',
		href: '/DashBoard/ManageVehicle',
	},
	{
		label: 'import data from Excel',
		href: '/DashBoard/view/BookPerVehic',
	},
];
const Layout: React.FC<LayoutProps> = ({ children }) => {

	return (
		<>
			{children}		
		</>
	);
};

export default Layout;
