import { useEffect, useState } from 'react'
import './Cabecalho.scss'

export default function Header() {
  const [active, setActive] = useState('inicio')

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="header-wrapper">
      <nav className="nav-bar">
        <div className="nav-logo">Celso Coutinho - Área 71</div>

        <ul className="nav-links">
          <li>
            <a href="#cabecalho" className={active === 'inicio' ? 'active' : ''}>Início</a>
          </li>
          <li>
            <a href="#eventos" className={active === 'eventos' ? 'active' : ''}>Eventos</a>
          </li>
          <li>
            <a href="#campanhas" className={active === 'campanhas' ? 'active' : ''}>Campanhas</a>
          </li>
          <li>
            <a href="#sobre" className={active === 'sobre' ? 'active' : ''}>Quem Somos</a>
          </li>
        </ul>

        <div className="nav-buttons">
          <a href="#login" className={`btn-login ${active === 'login' ? 'active' : ''}`}>Login</a>
        </div>
      </nav>
    </header>
  )
}