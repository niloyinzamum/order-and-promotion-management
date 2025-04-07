'use client';

import React, { useState } from 'react';
import styles from './sign-in.module.css';
import { useRouter } from 'next/navigation';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success) {
                document.cookie = `authToken=${data.token}; path=/;`;
                router.push('/order-management');
            } else {
                setError(data.error || 'Failed to sign in');
            }
        } catch (err) {
            console.error('Error during sign-in:', err);}
    };

    return (
        <div className={styles.container}>
            <div className={styles.signintext}>Sign In</div>
            {error && <p className={styles.error}>{error}</p>}
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
                    Sign In
                </button>
            </form>
            <p className={styles.signUpLink}>
                Need an account?{' '}
                <span onClick={() => router.push('/sign-up')} className={styles.link}>
                    Sign up here
                </span>
            </p>
        </div>
    );
};

export default SignIn;