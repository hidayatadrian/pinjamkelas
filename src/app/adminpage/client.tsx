'use client'
import dynamic from 'next/dynamic'

const AdminComponent = dynamic(
  () => import('../components/AdminPage'),
  { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }
)

export default function AdminClient() {
  return <AdminComponent />
}