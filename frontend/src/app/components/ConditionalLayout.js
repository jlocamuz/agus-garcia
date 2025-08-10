'use client';

import { usePathname } from 'next/navigation'
import Header from './Header'
import SocialMediaButtons from './SocialMediaButtons'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <>
      {/* Solo mostrar Header si NO es página de admin */}
      {!isAdminPage && <Header />}
      
      <main className="min-h-screen">
        {children}
      </main>
      
      {/* Solo mostrar Footer si NO es página de admin */}
      {!isAdminPage && (
        <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12">
          <div className="max-w-sm mx-auto px-4 text-center space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Agustina García</h3>
              <p className="text-gray-400">Psicóloga Clínica</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Contacto rápido</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>📞 +7 (999) 123-45-67</p>
                  <p>✉️ info@kuzmina-psycholog.ru</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Horarios</h4>
                <div className="text-sm text-gray-300">
                  <p>Lunes a viernes: 9:00 - 20:00</p>
                  <p>Fines de semana: Con cita previa</p>
                </div>
              </div>
            </div>

            <SocialMediaButtons />
          </div>
        </footer>
      )}
    </>
  )
}