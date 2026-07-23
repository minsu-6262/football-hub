import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function MainLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}
