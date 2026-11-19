import EclipseHero from '../sections/home/EclipseHero'
import SelectedWork from '../sections/home/SelectedWork'
import Manifesto from '../sections/home/Manifesto'
import ServicesPreview from '../sections/home/ServicesPreview'
import Process from '../sections/home/Process'
import ContactCTA from '../sections/home/ContactCTA'

export default function Home() {
  return (
    <>
      <EclipseHero />
      <SelectedWork />
      <Manifesto />
      <ServicesPreview />
      <Process />
      <ContactCTA />
    </>
  )
}
