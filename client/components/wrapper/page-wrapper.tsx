import Navbar from '../homePage_V1/Navbar'
import Footer from '../homePage_V1/Footer'
import NavBar2 from './navbar'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}