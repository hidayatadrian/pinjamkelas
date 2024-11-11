'use client'
import { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot
} from 'firebase/firestore';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '../globals.css'
import dynamic from 'next/dynamic'
// Types
interface User {
    id: string;
    displayName: string;
    email: string;
}

interface Class {
    id: string;
    name: string;
    status: 'Tersedia' | 'Dipinjam';  // Using strict types
}

interface BorrowingRecord {
    id: string;
    user: string;
    className: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const AdminPage = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [borrowingRecords, setBorrowingRecords] = useState<BorrowingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check authentication
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Fetch data with real-time updates
    useEffect(() => {
        try {
            // Real-time users subscription
            const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
                const usersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as User));
                setUsers(usersData);
            });

            // Real-time classes subscription
            const unsubscribeClasses = onSnapshot(collection(db, 'classes'), (snapshot) => {
                const classesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Class));
                setClasses(classesData);
            });

            // Real-time borrowing records subscription
            const unsubscribeBorrowings = onSnapshot(collection(db, 'borrowingRecords'), (snapshot) => {
                const recordsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as BorrowingRecord));
                setBorrowingRecords(recordsData);
            });

            setLoading(false);

            // Cleanup subscriptions
            return () => {
                unsubscribeUsers();
                unsubscribeClasses();
                unsubscribeBorrowings();
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Logout failed');
        }
    };

    const addClass = async () => {
        try {
            const name = prompt('Enter class name');
            if (name?.trim()) {
                await addDoc(collection(db, 'classes'), {
                    name,
                    status: 'Tersedia'
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add class');
        }
    };

    const deleteClass = async (id: string) => {
        try {
            if (confirm('Are you sure you want to delete this class?')) {
                await deleteDoc(doc(db, 'classes', id));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete class');
        }
    };

    const updateClass = async (id: string) => {
        try {
            const name = prompt('Enter new class name');
            if (name?.trim()) {
                await updateDoc(doc(db, 'classes', id), { name });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update class');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-2 cursor-pointer hover:text-red-700"
                    onClick={handleLogout}>
                    <span>Logout</span>
                    <LogOut className="w-5 h-5" />
                </div>
            </div>

            {/* Users Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse shadow-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{user.id}</td>
                                    <td className="border px-4 py-2">{user.displayName}</td>
                                    <td className="border px-4 py-2">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Classes Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Classes</h2>
                    <button
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                        onClick={addClass}
                    >
                        Add Class
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse shadow-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(classItem => (
                                <tr key={classItem.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{classItem.id}</td>
                                    <td className="border px-4 py-2">{classItem.name}</td>
                                    <td className="border px-4 py-2">
                                        <span className={`px-2 py-1 rounded ${classItem.status === 'Tersedia'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {classItem.status}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                                onClick={() => updateClass(classItem.id)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                                onClick={() => deleteClass(classItem.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Borrowing Records Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Borrowing Records</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse shadow-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">User</th>
                                <th className="border px-4 py-2">Class</th>
                                <th className="border px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowingRecords.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{record.id}</td>
                                    <td className="border px-4 py-2">{record.user}</td>
                                    <td className="border px-4 py-2">{record.className}</td>
                                    <td className="border px-4 py-2">
                                        <span className={`px-2 py-1 rounded ${record.status === 'Approved'
                                                ? 'bg-green-100 text-green-800'
                                                : record.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;