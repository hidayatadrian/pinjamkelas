'use client'
import React, { useState } from 'react';
import {
    HomeIcon,
    File,
    ClipboardListIcon,
    UserIcon,
    MenuIcon,
    XIcon,
    LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { app, db, provider, auth } from '../../lib/firebase';
import '../globals.css'
interface DashboardProps { }
import ProfilContent from '../dashboard/ProfilContent'


const Dashboard: React.FC<DashboardProps> = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const router = useRouter();
    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <KelasContent />;
            case 'kelas':
                return <ProfilContent />;
            case 'peminjaman':
                return <PeminjamanContent />;
            case 'profil':
                return <ProfilContent />;
            default:
                return <ProfilContent />;
        }
    };


    const handleLogout = async () => {
        try {
            const user = auth.currentUser;
                await auth.signOut();
                console.log('User successfully logged out');
                router.push('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };


    const SidebarButton = ({
        icon: Icon,
        label,
        section,
        onClick,
    }: {
        icon: React.ComponentType<{ className?: string }>,
        label: string,
        section: string,
        onClick?: () => void;
    }) => (
        <button
            onClick={() => {
                // Jika `onClick` didefinisikan, panggil `onClick`; jika tidak, ubah `activeSection`.
                if (onClick) {
                    onClick();
                } else {
                    setActiveSection(section);
                }
                setIsSidebarOpen(false);
            }}
            className={`
            flex items-center w-full p-3 rounded transition-colors duration-200
            ${activeSection === section
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-100 text-gray-700 hover:text-blue-600'}
        `}
        >
            <Icon className="h-6 w-6 mr-3" />
            {label}
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-100 ">
            {/* Mobile Sidebar Toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <div
                className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-10 text-blue-600 ml-12 mt-2 lg:ml-0 lg:mt-0">
                        Sistem Peminjaman
                    </h1>

                    <nav className="space-y-2">
                        <SidebarButton
                            icon={HomeIcon}
                            label="Dashboard"
                            section="dashboard"
                        />
                        <SidebarButton
                            icon={File}
                            label="List Kelas"
                            section="kelas"
                        />
                        <SidebarButton
                            icon={ClipboardListIcon}
                            label="Riwayat Peminjaman"
                            section="peminjaman"
                        />
                        <SidebarButton
                            icon={UserIcon}
                            label="Profil"
                            section="profil"
                        />
                        <SidebarButton
                            icon={LogOut}
                            label="Logout"
                            section="Logout"
                            onClick={handleLogout}
                        />

                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <main
                className="flex-1 overflow-y-auto p-6 md:ml-0"
                onClick={() => setIsSidebarOpen(false)}
            >
                {renderContent()}
            </main>
        </div>
    );
};


// Kelas Content Component
const KelasContent: React.FC = () => {
    return (
        <div className='text-black'>
            <h1 className="text-3xl font-bold mb-6">Berikut adalah halaman dashboard user</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className='mb-3'>- Akses halaman list kelas untuk melakukan peminjaman kelas.</p>
                <p className='mb-3'>- Akses halaman riwayat peminjaman kelas untuk melihat riwayat peminjaman anda.</p>
                <p className=''>- Akses halaman profil untuk melihat profil anda yang terdaftar.</p>
            </div>
        </div>
    );
};

// Peminjaman Content Component
const PeminjamanContent: React.FC = () => {
    return (
        <div className='text-black'>
            <h1 className="text-3xl font-bold">Riwayat Peminjaman</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>Riwayat peminjaman kelas Anda.</p>
            </div>
        </div>
    );
};

// Profil Content Component



export default Dashboard;