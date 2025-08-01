export default function Hero(){
    return(
      <section className="bg-gradient-to-br from-olivaclaro via-white to-oliva/20 min-h-screen flex items-center">
        <div className="w-full px-4 py-8">
          <div className="max-w-sm mx-auto text-center space-y-8">
            {/* Imagen de perfil circular */}
            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-oliva/30 to-rosa/30 p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src="/images/agus3.png"
                    alt="Agustina García - Psicóloga"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

            </div>

            {/* Información principal */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Agustina García
                </h1>
                <p className="text-lg text-oliva font-medium">
                  Psicóloga Clínica
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed px-4">
                Te ayudo a lidiar con el estrés, la ansiedad y a construir relaciones saludables contigo mismo y con los demás.
              </p>

              {/* Estadísticas rápidas */}
            </div>

            {/* Botones de acción */}
            <div className="space-y-3 px-4">
              <a
                href="#contact"
                className="block w-full bg-oliva text-white py-4 px-6 rounded-full font-medium text-center hover:bg-oliva/90 transition-colors shadow-lg"
              >
                Empezar terapia
              </a>
              <a
                href="#about"
                className="block w-full border-2 border-oliva text-oliva py-4 px-6 rounded-full font-medium text-center hover:bg-olivaclaro transition-colors"
              >
                Conocer más
              </a>
            </div>
          </div>
        </div>
      </section>
    )
}