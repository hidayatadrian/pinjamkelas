'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../globals.css';
import { app, db, provider, auth } from '../../lib/firebase';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const handleGoogleRegister = async () => {

        console.log('Google register clicked');
        try {
            setLoading(true);
            setError('');

            // Trigger Google sign-in popup
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
                // Create user document in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    // Add any additional fields you want to store
                    role: 'user',
                    isEmailVerified: user.emailVerified,
                });

                // Get the user's ID token
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;

                // Store the token in localStorage if needed
                if (token) {
                    localStorage.setItem('token', token);
                }

                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                }));

                console.log('Successfully registered:', user.email);
                router.push('/dashboard'); // or wherever you want to redirect new users
        

        } catch (error: any) {
            // Handle different types of errors
            if (error.code === 'auth/popup-closed-by-user') {
                setError('Registration was cancelled');
            } else if (error.code === 'auth/email-already-in-use') {
                setError('An account already exists with this email address');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (error.code === 'auth/operation-not-allowed') {
                setError('Google sign-in is not enabled. Please contact support.');
            } else {
                setError('Failed to register. Please try again.');
                console.error('Registration error:', error);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="max-w-6xl w-full flex shadow-lg rounded-xl overflow-hidden">
                {/* Image Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-8">
                    <img
                        src="/umm.jpg"
                        alt="Universitas Muhammadiyah Malang"
                        className="w-full h-auto object-cover rounded-lg"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 bg-white p-8">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        {/* Logo or Header */}
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-blue-900">Create Account</h1>
                            <p className="mt-2 text-gray-600">Get started with your account</p>
                        </div>

                        {/* Google Register Button */}
                        <div className="mt-8">
                            <button
                                onClick={handleGoogleRegister}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <img
                                    src="/google.svg"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                <span className="text-gray-700">Sign up with Google</span>
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-gray-600">
                            Already have an account?{' '}
                            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


