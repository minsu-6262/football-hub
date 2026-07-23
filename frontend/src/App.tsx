import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import PlayersPage from './pages/PlayersPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="players" element={<PlayersPage />} />
      </Route>
    </Routes>
  )
}
