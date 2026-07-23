import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="header__brand">
        Football Hub
      </NavLink>
      <nav className="header__nav">
        <NavLink to="/" end className="header__link">
          Home
        </NavLink>
        <NavLink to="/players" className="header__link">
          Players
        </NavLink>
      </nav>
    </header>
  )
}
