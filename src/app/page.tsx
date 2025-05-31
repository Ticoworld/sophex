import Hero from '@/components/sections/Hero'
import ValueProp from '@/components/sections/ValueProp'
import NFTShowcase from '@/components/sections/NFTShowcase'
import Workflow from '@/components/sections/Workflow'
import CTA from '@/components/sections/CTA'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ValueProp />
      <NFTShowcase />
      <Workflow />
      <CTA />
      <Footer />
    </main>
  )
}