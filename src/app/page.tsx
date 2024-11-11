'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../app/globals.css';
import { doc, getDoc } from "firebase/firestore";
import { app, db, provider, auth } from '../lib/firebase';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
export default function Page() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      console.log("Google login clicked");
  
      // Melakukan sign-in dengan Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("Successfully logged in:", user.email);
  
      // Mendapatkan UID pengguna
      const uid = user.uid;
  
      // Mengambil data pengguna dari Firestore untuk mendapatkan role
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        const userEmail = userData.email;
        

        console.log("Role dari firebase yang diambil adalah ", userRole);
        // Validasi role dan arahkan ke halaman yang sesuai
        if (userEmail === "wh42294@gmail.com") {
          console.log("Akun anda adalah admin");
          router.push("/adminpage");
        } else if (userRole === "user") {
          console.log("Akun anda adalah user");
          router.push("/dashboard");
        } else {
          console.error("Role tidak dikenal:", userRole);
          router.push("/unauthorized"); // arahkan ke halaman error atau unauthorized
        }
      } else {
        console.error("Dokumen pengguna tidak ditemukan di Firestore");
        router.push("/unauthorized"); // atau arahkan ke halaman untuk error
      }
    } catch (error) {
      console.error("Error saat login:", error);
      // Tambahkan handling error jika diperlukan
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row shadow-lg rounded-xl overflow-hidden">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
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
              <h1 className="text-2xl font-bold text-blue-900">Welcome Back</h1>
              <p className="mt-2 text-gray-600">Website peminjaman kelas Teknik Industri</p>
            </div>
  
            {/* Google Login Button */}
            <div className="mt-8">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img 
                  src="/google.svg" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                <span className="text-gray-700">Continue with Google</span>
              </button>
            </div>
  
            {/* Register Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
}