import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'

export const AuthenticatedLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <section
        aria-label="Authenticated workspace"
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#f1f5f9',
        }}
      >
        <Outlet />
      </section>
    </div>
  )
}
