'use client'
import { useAuth } from '@/app/hooks/authHooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { delay } from '../utils/addDelay';
import LoaderContiner from './LoaderContainer';
import Loader from './Loader';

type PrivateRouterProps = {
	requiredRole?: string;
	children: ReactNode
};

const PrivateRoute: React.FC<PrivateRouterProps> = ({requiredRole, children }) => {
	const { isAuthenticated, role} = useAuth();
	const router = useRouter();

	useEffect(() => {
		delay(1000)
		if (!isAuthenticated || (requiredRole && requiredRole !=role)) {
			router.push('/Login'); // Redirect to login if not authenticated
		}
	}, [isAuthenticated]);

	if (isAuthenticated) return <>{children}</>;

	return <LoaderContiner isLoading={true} spinner={<Loader />}><></></LoaderContiner>; // Optionally, you can show a loading spinner here
};

export default PrivateRoute;
