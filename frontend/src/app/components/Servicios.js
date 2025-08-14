'use client';

import { useState, useEffect } from 'react';
import { getServicios, enviarRespuestaFormulario } from "@/app/lib/supabase"
import DynamicForm from './DynamicForm';

export default function Servicios() {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar servicios desde Supabase al montar el componente
  useEffect(() => {
    async function loadServicios() {
      try {
        const data = await getServicios();
        setServicios(data);
      } catch (error) {
        console.error('Error cargando servicios:', error);
      } finally {
        setLoading(false);
      }
    }

    loadServicios();
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      await enviarRespuestaFormulario(
        selectedService.id,
        selectedService.form_id,
        formData
      );

      alert(`¡Solicitud para "${selectedService.title}" enviada! Te contactaré pronto.`);
      setShowModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error enviando formulario:', error);
      throw error;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <section id="servicios" className="py-16 bg-white">
        <div className="px-4">
          <div className="max-w-sm mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oliva mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando servicios...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="servicios" className="py-16 bg-white">
        <div className="px-4">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Servicios
              </h2>
              <p className="text-gray-600">
                Elige el servicio que mejor se adapte a ti
              </p>
            </div>

            <div className="space-y-6">
              {servicios.map((service, index) => (
                <div 
                  key={service.id || index} 
                  data-service={service.id}
                  className={`relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                    service.popular 
                      ? 'bg-oliva text-white border-oliva' 
                      : 'bg-white border-olivaclaro hover:border-oliva'
                  }`}
                >
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

                  {/* Mostrar horario si existe */}
                  {service.horario && (
                    <div className={`text-center mb-4 p-3 rounded-xl ${
                      service.popular ? 'bg-white/20' : 'bg-oliva/10'
                    }`}>
                      <div className={`text-sm font-medium ${
                        service.popular ? 'text-white/90' : 'text-oliva'
                      }`}>
                        📅 {service.horario}
                      </div>
                    </div>
                  )}

                  <ul className="space-y-3 mb-6">
                    {service.features?.map((feature, featureIndex) => (
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

                  <button 
                    onClick={() => handleServiceClick(service)}
                    className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      service.popular
                        ? 'bg-white text-oliva hover:bg-olivaclaro hover:shadow-lg'
                        : 'bg-oliva text-white hover:bg-oliva/90 hover:shadow-lg'
                    }`}
                  >
                    {service.button_text}
                  </button>
                </div>
              ))}
            </div>

            {servicios.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay servicios disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal con formulario dinámico */}
      {showModal && selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all max-h-[90vh] overflow-y-auto">
              {/* Botón cerrar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Formulario dinámico */}
              <DynamicForm
                formulario={selectedService.formulario}
                servicio={selectedService}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}