import { Link } from 'react-router-dom';

<Link to="/contato" className="nav-link">Contato</Link>

import './Contato.scss'

export default function Contato() {
  return (
    <section id="contato" className="contato">
      <h2>Fale Conosco</h2>
      <a href="https://wa.me/5599999999999" target="_blank" rel="noreferrer">
        Mandar Mensagem no WhatsApp
      </a>
    </section>
  )
}
