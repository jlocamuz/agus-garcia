import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from './components/ConditionalLayout'

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
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}