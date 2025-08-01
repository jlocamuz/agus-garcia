export default function AboutMe() {
    return(
        <section id="about" className="py-16 bg-white">
        <div className="px-4">
          <div className="max-w-sm mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Sobre mí
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed text-left">
              <p>
                Soy psicóloga con más de 8 años de experiencia especializada en trastornos de ansiedad, depresión y problemas de pareja.
              </p>
              <p>
                Mi enfoque combina terapia cognitivo-conductual y métodos humanísticos, creyendo firmemente que cada persona tiene los recursos internos para cambiar.
              </p>
              <p>
                Graduada de la Universidad Estatal Lomonósov de Moscú, me actualizo constantemente participando en congresos profesionales.
              </p>
            </div>

            {/* Credenciales */}
            <div className="bg-olivaclaro rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4 text-left">Formación</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-oliva rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed text-left">Universidad Estatal Lomonósov de Moscú</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-oliva rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed text-left">Especialización en Terapia Cognitivo-Conductual</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-oliva rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed text-left">Métodos Humanísticos en Psicología</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}