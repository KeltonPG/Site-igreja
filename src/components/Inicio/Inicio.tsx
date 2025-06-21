import { useState, useEffect } from 'react'
import { FaArrowDown } from 'react-icons/fa'
import FadeInSection from '../FadeInSection/FadeInSection'
import './Inicio.scss'

export default function Inicio() {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200)
  }, [])

  const rolarParaHorarios = () => {
    const section = document.getElementById('eventos')
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <FadeInSection>
      <section className={`inicio-section ${fadeIn ? 'fade-in' : ''}`} id="inicio">
        <div className="overlay" />
        <div className="conteudo">
          <div className="textos">
            <h1>Celso Coutinho - Área 71</h1>
            <p>
              Uma igreja comprometida com a fé, amor e transformação de vidas
              por meio da palavra de Deus.
            </p>
            <button className="btn-rolar" onClick={rolarParaHorarios}>
              <FaArrowDown /> Ver eventos
            </button>
          </div>
        </div>
      </section>
    </FadeInSection>
  )
}
