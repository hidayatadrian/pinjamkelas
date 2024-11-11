import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ProfilContent: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            setUserName(user.displayName);
            setUserEmail(user.email);
            setUserPhoto(user.photoURL); // Mengambil URL foto profil

            const userDocRef = doc(db, 'users', user.uid);
            getDoc(userDocRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        setUserRole(userData.role);
                    } else {
                        console.log('Dokumen pengguna tidak ditemukan');
                    }
                })
                .catch((error) => {
                    console.error('Error mengambil data role:', error);
                });
        }
    }, []);

    return (
        <div className='text-black p-4 sm:p-6 lg:p-8'>
            <h1 className="text-3xl font-bold mb-6 text-center">Profil Pengguna</h1>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6 lg:max-w-3xl mx-auto">
                {/* Bagian Foto Profil */}
                <div className="mb-4 sm:mb-0 sm:w-1/3 flex justify-center">
                    <img 
                        src={userPhoto || '/default-profile.png'} // Gunakan gambar default jika photoURL kosong
                        alt="Foto Profil"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300"
                    />
                </div>
                
                {/* Bagian Informasi Pengguna */}
                <div className="text-center sm:text-left sm:w-2/3">
                    <p className="text-xl font-semibold mb-2">{userName || 'Nama tidak tersedia'}</p>
                    <p className="text-gray-600 mb-1"><strong>Email:</strong> {userEmail || 'Tidak tersedia'}</p>
                    <p className="text-gray-600"><strong>Role:</strong> {userRole || 'Tidak tersedia'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilContent;
