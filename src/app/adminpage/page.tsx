'use client'
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc
} from 'firebase/firestore';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {auth} from '../../lib/firebase'
import '../globals.css'
interface User {
    id: string;
    displayName: string;
    email: string;
}

interface Class {
    id: string;
    name: string;
    status: number;
}

interface BorrowingRecord {
    id: string;
    user: string;
    className: string;
    status: 'Pending' | 'Approved';
}

const AdminPage = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [borrowingRecords, setBorrowingRecords] = useState<BorrowingRecord[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchClasses();
        fetchBorrowingRecords();
    }, []);
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
    const fetchUsers = async () => {
        const userSnapshot = await getDocs(collection(db, 'users'));
        const usersData = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersData);
    };

    const fetchClasses = async () => {
        const classSnapshot = await getDocs(collection(db, 'classes'));
        const classesData = classSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
        setClasses(classesData);
    };

    const fetchBorrowingRecords = async () => {
        const recordSnapshot = await getDocs(collection(db, 'borrowingRecords'));
        const recordsData = recordSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BorrowingRecord));
        setBorrowingRecords(recordsData);
    };

    const addClass = async () => {
        const name = prompt('Enter class name');
        if (name) {
            await addDoc(collection(db, 'classes'), { name, status: "Tersedia" });
            fetchClasses();
        }
    };

    const deleteClass = async (id: string) => {
        await deleteDoc(doc(db, 'classes', id));
        fetchClasses();
    };

    const updateClass = async (id: string) => {
        const name = prompt('Enter new class name');
        if (name) {
            await updateDoc(doc(db, 'classes', id), { name });
            fetchClasses();
        }
    };

    return (
        <div className="p-8">
            <div className="flex">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className='ml-2  hover:text-red-700 cursor-pointer' onClick={handleLogout}> Logout</p>
            <LogOut 
            onClick={handleLogout}
            className='cursor-pointer mb-4 ml-1  hover:text-red-700'
            />
            </div>
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Users</h2>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="border px-4 py-2">{user.id}</td>
                                <td className="border px-4 py-2">{user.displayName}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Classes</h2>
                <button
                    className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
                    onClick={addClass}
                >
                    Add Class
                </button>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map(classItem => (
                            <tr key={classItem.id}>
                                <td className="border px-4 py-2">{classItem.id}</td>
                                <td className="border px-4 py-2">{classItem.name}</td>
                                <td className="border px-4 py-2">{classItem.status}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                                        onClick={() => updateClass(classItem.id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                        onClick={() => deleteClass(classItem.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Borrowing Records</h2>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">User</th>
                            <th className="border px-4 py-2">Class</th>
                            <th className="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowingRecords.map(record => (
                            <tr key={record.id}>
                                <td className="border px-4 py-2">{record.id}</td>
                                <td className="border px-4 py-2">{record.user}</td>
                                <td className="border px-4 py-2">{record.className}</td>
                                <td className="border px-4 py-2">{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
