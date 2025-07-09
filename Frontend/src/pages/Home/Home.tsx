import FadeInSection from '../../components/FadeInSection/FadeInSection'

import Header from '../../components/Cabecalho/Cabecalho'
import Inicio from './Components/Inicio/Inicio'
import Eventos from './Components/Eventos/Eventos'
import Galeria from './Components/Galeria/Galeria'
import Contato from './Components/Contato/Contato'
import Rodape from '../../components/Rodape/Rodape'

import './Home.scss'

export default function Home() {
  return (
    <>
      <Header />
      <FadeInSection>
        <Inicio />
      </FadeInSection>
      <FadeInSection>
        <Eventos />
      </FadeInSection>
      <FadeInSection>
        <Galeria />
      </FadeInSection>
      <FadeInSection>
        <Contato />
      </FadeInSection>
      <Rodape />
    </>
  )
}
