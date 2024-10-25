'use client';

import React, { ReactNode, useEffect, useMemo, useState, useTransition } from 'react';
import { PageLoadingContext } from './PageLoadingContext';

const PageLoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isPending, startTransition] = useTransition()
	const [isPageLoading, setIsPageLoading] = useState(false);

	const triggerTransition = (callback: () => void) => {
		startTransition(() => {
			callback();
		});
	};
	
	useEffect(() => {
		// Correctly update the state with the boolean value of isPending
			setIsPageLoading(isPending);
	}, [isPending]);

	const setLoad = () => setIsPageLoading(true);
	const removeLoad = () => setIsPageLoading(false);

	return (
		<PageLoadingContext.Provider
			value={useMemo(
				() => ({
					isPageLoading,
					setIsPageLoading,
					setLoad,
					removeLoad,
					triggerTransition,
				}),
				[isPageLoading]
			)}
		>
			{children}
		</PageLoadingContext.Provider>
	);
};

export default PageLoadingProvider;
