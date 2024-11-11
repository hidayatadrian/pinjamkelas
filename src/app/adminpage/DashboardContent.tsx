'use client'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import React, { useEffect, useState } from 'react';
interface Class {
    id: string;
    status: 'Tersedia' | 'Dipinjam';
}

interface ClassStats {
    total: number;
    available: number;
    borrowed: number;
}
interface StatCardProps {
    title: string;
    value: number;
    color: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
export const fetchClassStats = async (): Promise<ClassStats> => {
    const classesCollection = collection(db, 'classes');
    const classSnapshot = await getDocs(classesCollection);
    const classList = classSnapshot.docs.map(doc => doc.data() as Class);

    const total = classList.length;
    const available = classList.filter(cls => cls.status === 'Tersedia').length;
    const borrowed = classList.filter(cls => cls.status === 'Dipinjam').length;

    return {
        total,
        available,
        borrowed
    };
};
// Dashboard Content Component
const DashboardContent: React.FC<StatCardProps> = ({ title, value, color }) => (
    <div className="p-4 border rounded-md shadow-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);
const StatsCards: React.FC = () => {
    const [stats, setStats] = useState({ total: 0, available: 0, borrowed: 0 });

    useEffect(() => {
        const getStats = async () => {
            const classStats = await fetchClassStats();
            setStats(classStats);
        };
        getStats();
    }, []);

    const statsCards = [
        {
            title: 'Total Kelas',
            value: stats.total,
            color: 'text-blue-600'
        },
        {
            title: 'Kelas Tersedia',
            value: stats.available,
            color: 'text-green-600'
        },
        {
            title: 'Kelas Dipinjam',
            value: stats.borrowed,
            color: 'text-red-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsCards.map((card, index) => (
                <StatCard key={index} title={card.title} value={card.value} color={card.color} />
            ))}
        </div>
    );
};
export default StatsCards;