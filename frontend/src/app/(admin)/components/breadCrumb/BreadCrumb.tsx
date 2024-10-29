// components/Breadcrumb.tsx
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './breadCrumb.module.css'

const Breadcrumb: React.FC = () => {

    const pathname = usePathname();
    const pathnames = pathname.split('/').filter((x) => x);

    const breadcrumbItems = pathnames.map((path, index) => {
        const href = `/${pathnames.slice(0, index + 1).join('/')}`;
        return {
        label: path.charAt(0).toUpperCase() + path.slice(1), // Capitalize the first letter
        href,
        };
    });

    return (
        <nav aria-label="Breadcrumb">
            {/* <i className="fa-solid fa-people-roof"></i> */}
            <ol className={styles.breadcrumb}>
                <li><i className={`fa-solid fa-people-roof ${styles.breadcrumbItem}`}></i></li>
                {breadcrumbItems.map((item, index) => (
                    <li key={index} className={styles.breadcrumbItem}>
                        {index === breadcrumbItems.length - 1 ? 
                            <span>{item.label}</span>
                            : <Link href={item.href}>{item.label}</Link>
                        }
                        {index < breadcrumbItems.length - 1 && <span> / </span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
