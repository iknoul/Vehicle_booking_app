import React, { ReactNode } from 'react';
import styles from './styles/loaderContainer.module.css';

interface CustomLoaderProps {
  isLoading: boolean;
  spinner?: ReactNode;
  extraContent?: ReactNode;
  children: ReactNode;
  afterLoadContent?: ReactNode;
}

const LoaderContiner: React.FC<CustomLoaderProps> = ({
  isLoading,
  spinner,
  children,
  extraContent,
  afterLoadContent,
}) => {
  return (
    <>
      {isLoading && (
        <>
          {/* Display the extra content above the loader */}
          {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
          <div className={styles.loaderOverlay}>
            <div className={styles.loaderContent}>
              {spinner || <div className={styles.defaultSpinner}>Loading...</div>}
            </div>
          </div>
        </>
      )}
      <div className={isLoading ? styles.contentBlurred : ''}>
        {children}
      </div>
      {!isLoading && afterLoadContent && (
        <div className={styles.afterLoadContent}>
          {afterLoadContent}
        </div>
      )}
    </>
  );
};

export default LoaderContiner;
