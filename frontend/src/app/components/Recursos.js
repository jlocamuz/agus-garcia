export default function Recursos() {

    return(
      <section id="services" className="py-16 bg-olivaclaro/50">
        <div className="px-4">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Recursos gratuitos
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Recomendaciones de podcasts",
                  description: "Recomendaciones de podcast",
                  icon: "🧠",
                  color: "bg-oliva/20 text-oliva border-l-4 border-oliva"
                },
                {
                  title: "Guías",
                  description: "",
                  icon: "💙",
                  color: "bg-rosa/20 text-rosa border-l-4 border-rosa"
                },
                {
                  title: "Para pintar",
                  description: "",
                  icon: "💕",
                  color: "bg-oliva/30 text-oliva border-l-4 border-oliva"
                },
              ].map((service, index) => (
                <div key={index} className={`bg-white rounded-2xl p-6 shadow-sm ${service.color}`}>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl text-2xl bg-white shadow-sm">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    )
}