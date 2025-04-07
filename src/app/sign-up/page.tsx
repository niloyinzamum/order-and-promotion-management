'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './sign-up.module.css';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('Account created successfully! Redirecting to sign-in...');
                setTimeout(() => router.push('/sign-in'), 2000); // Redirect to sign-in page
            } else {
                setError(data.error || 'Failed to create account');
            }
        } catch (err) {
            console.error('Error during sign-up:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.signintext}>Sign Up</div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>
                    Sign Up
                </button>
            </form>
            <button
                className={`${styles.button} ${styles.goBackButton}`}
                onClick={() => router.back()}
            >
                Go Back
            </button>
        </div>
    );
};

export default SignUp;