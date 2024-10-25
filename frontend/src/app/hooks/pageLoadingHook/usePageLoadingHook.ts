import { PageLoadingContext } from '../../context/PageLoadingContext';
import { useContext } from 'react';


// Custom hook to use the AuthContext
export const usePageLoading = () => 
{
    const context = useContext(PageLoadingContext);
    if (!context) {
        throw new Error('usePageLoading must be used within an PageLoadingProvider');
    }
    return context;
};