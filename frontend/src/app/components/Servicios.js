export default function Servicios() {
  const servicios = [
    {
      title: "Consulta online",
      price: "$",
      duration: "60 min",
      features: ["Videollamada", "Desde casa", "Horario flexible", "Grabación disponible"],
      popular: true,
      icon: "💻",
      button: "Agendar sesión ",
      link: ""
    },
    {
      title: "Cursos",
      price: "$",
      duration: "60 min",
      features: ["Sesión presencial", "Enfoque personalizado", "Confidencialidad total", "Ambiente profesional"],
      icon: "👤",
      button: "Reservar lugar",
      link: "",
    },
    {
      title: "Charlas",
      price: "$",
      duration: "60 min",
      features: ["Sesión presencial", "Enfoque personalizado", "Confidencialidad total", "Ambiente profesional"],
      icon: "👤",
      button: "Reservar lugar",
      link: ""
    },
  ];

  return (
    <section id="approach" className="py-16 bg-white">
      <div className="px-4">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Modalidades
            </h2>
            <p className="text-gray-600">
              Elige el formato que mejor se adapte a ti
            </p>
          </div>

          <div className="space-y-6">
            {servicios.map((service, index) => (
              <div key={index} className={`relative rounded-2xl p-6 border-2 ${
                service.popular 
                  ? 'bg-oliva text-white border-oliva' 
                  : 'bg-white border-olivaclaro hover:border-oliva transition-colors'
              }`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-rosa text-white px-4 py-1 text-sm font-bold rounded-full">
                      Más popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2">
                    {service.title}
                  </h3>
                  <div className="text-3xl font-bold mb-1">
                    {service.price}
                  </div>
                  <div className={`text-sm ${service.popular ? 'text-white/80' : 'text-gray-600'}`}>
                    {service.duration}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <svg className={`w-5 h-5 ${service.popular ? 'text-white/80' : 'text-oliva'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${service.popular ? 'text-white/90' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 font-semibold rounded-xl transition-colors ${
                  service.popular
                    ? 'bg-white text-oliva hover:bg-olivaclaro'
                    : 'bg-oliva text-white hover:bg-oliva/90'
                }`}>
                  {service.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
