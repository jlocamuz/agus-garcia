import { Inter } from 'next/font/google'
import Header from './components/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: 'Agustina García - Psicóloga Personal',
  description: 'Psicóloga clínica especializada en ansiedad, depresión y terapia de pareja. Consultas online y presenciales en Moscú.',
  keywords: 'psicóloga, terapia, ansiedad, depresión, pareja, Moscú, consulta online',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#bac5a4" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} bg-white`}>
        <Header />
        
        <main className="min-h-screen">
          {children}
        </main>
        
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
                  <p>📍 Moscú, Calle de Ejemplo, 123</p>
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

            {/* Botones de redes sociales con paleta personalizada */}
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-oliva p-3 rounded-full hover:bg-oliva/80 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.56c-.12.56-.44.7-.9.44l-2.48-1.84-1.2 1.16c-.13.13-.24.24-.5.24l.18-2.52 4.64-4.18c.2-.18-.04-.28-.32-.1l-5.74 3.6-2.48-.78c-.54-.17-.55-.54.11-.8l9.7-3.74c.45-.17.84.11.7.8z"/>
                </svg>
              </a>
              <a href="#" className="bg-rosa p-3 rounded-full hover:bg-rosa/80 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.688"/>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}