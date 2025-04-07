'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';
import styles from './layout.module.css';

// Import Font Awesome icons
import { FaTags, FaBox, FaShoppingCart } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const [showDropdown, setShowDropdown] = useState(false);

    // Exclude layout for sign-in and sign-up pages
    if (pathname === '/sign-in' || pathname === '/sign-up') {
        return (
            <html lang="en">
                <body>{children}</body>
            </html>
        );
    }

    const userEmail = 'user@example.com';
    const userInitial = userEmail.charAt(0).toUpperCase();

    const handleLogout = () => {
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        window.location.href = '/sign-in';
    };

    return (
        <html lang="en">
            <body>
                <div className={styles.container}>
                    {/* Enhanced Sidebar with proper active states */}
                    <aside className={styles.sidebar}>
                        <nav>
                            <ul>
                                <li className={pathname === '/promotion-management' ? styles.active : ''}>
                                    <Link href="/promotion-management">
                                        <FaTags className={styles.icon} /> Promotion Management
                                    </Link>
                                </li>
                                <li className={pathname === '/product-management' ? styles.active : ''}>
                                    <Link href="/product-management">
                                        <FaBox className={styles.icon} /> Product Management
                                    </Link>
                                </li>
                                <li className={pathname === '/order-management' ? styles.active : ''}>
                                    <Link href="/order-management">
                                        <FaShoppingCart className={styles.icon} /> Order Management
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className={styles.mainContent}>
                        {/* Profile Circle - Top Right */}
                        <div className={styles.profileContainer}>
                            <div
                                className={styles.profileCircle}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {userInitial}
                            </div>
                            {showDropdown && (
                                <div className={styles.dropdown}>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>

                        {/* Page Content */}
                        <div className={styles.pageContent}>{children}</div>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default Layout;