// components/Contacto.js
"use client"
export default function Contacto() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Formulario enviado');
  };

  return (
    <section id="contact" className="py-16 bg-rosa text-white">
      <div className="px-4">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              ¿Hablamos?
            </h2>
            <p className="text-white/80">
              Estoy aquí para ayudarte. El primer paso es el más importante.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6 mb-8">
            <a href="tel:+79991234567" className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Llamar ahora</div>
                <div className="text-white/70 text-sm">+7 (999) 123-45-67</div>
              </div>
            </a>

            <a href="mailto:info@kuzmina-psycholog.ru" className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Enviar email</div>
                <div className="text-white/70 text-sm">info@kuzmina-psycholog.ru</div>
              </div>
            </a>

            <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Consultorio</div>
                <div className="text-white/70 text-sm">Moscú, Calle de Ejemplo, 123</div>
              </div>
            </div>
          </div>

          {/* Formulario rápido */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Solicitar consulta
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-oliva focus:border-transparent text-gray-900"
                required
              />
              
              <input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-oliva focus:border-transparent text-gray-900"
                required
              />
              
              <select 
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-oliva focus:border-transparent text-gray-900"
                required
              >
                <option value="">Selecciona un servicio</option>
                <option value="online">Consulta online</option>
                <option value="individual">Terapia individual</option>
                <option value="pareja">Terapia de pareja</option>
              </select>
              
              <textarea
                rows={3}
                placeholder="Cuéntame brevemente sobre tu consulta..."
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-oliva focus:border-transparent text-gray-900"
              />
              
              <button
                type="submit"
                className="w-full bg-oliva text-white py-4 px-6 font-semibold rounded-xl hover:bg-oliva/90 transition-colors"
              >
                Enviar solicitud
              </button>
            </form>
          </div>

          {/* Horarios */}
          <div className="mt-8 text-center">
            <div className="text-white/70 text-sm mb-2">Horarios de atención</div>
            <div className="font-semibold">Lunes a viernes: 9:00 - 20:00</div>
            <div className="text-white/70 text-sm">Sábados y domingos: con cita previa</div>
          </div>
        </div>
      </div>
    </section>
  );
}