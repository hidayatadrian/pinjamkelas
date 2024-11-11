// /app/adminpage/page.tsx
import dynamic from 'next/dynamic'

// Import AdminPage dynamically with SSR disabled
const AdminPageComponent = dynamic(
  () => import('../components/AdminPage'),
  { ssr: false }
)

export default function AdminPage() {
  return <AdminPageComponent />
}