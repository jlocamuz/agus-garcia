// components/DynamicForm.js
'use client';

import { useState } from 'react';

export default function DynamicForm({ formulario, servicio, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Error al enviar el formulario. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (campo) => {
    const commonClasses = "w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-oliva focus:border-transparent text-gray-900";

    switch (campo.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            key={campo.name}
            type={campo.type}
            name={campo.name}
            placeholder={campo.placeholder}
            value={formData[campo.name] || ''}
            onChange={(e) => handleInputChange(campo.name, e.target.value)}
            className={commonClasses}
            required={campo.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            key={campo.name}
            name={campo.name}
            placeholder={campo.placeholder}
            value={formData[campo.name] || ''}
            onChange={(e) => handleInputChange(campo.name, e.target.value)}
            rows={4}
            className={commonClasses}
            required={campo.required}
          />
        );

      case 'select':
        return (
          <select
            key={campo.name}
            name={campo.name}
            value={formData[campo.name] || ''}
            onChange={(e) => handleInputChange(campo.name, e.target.value)}
            className={commonClasses}
            required={campo.required}
          >
            <option value="">Selecciona una opción</option>
            {campo.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'info':
        return (
          <div key={campo.name} className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-blue-50 text-blue-800">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{campo.label}:</span>
            </div>
            <div className="mt-2 font-semibold text-blue-900">
              {campo.value || servicio?.horario}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
        {formulario?.nombre || `Solicitar ${servicio?.title}`}
      </h3>
      <p className="text-gray-600 text-center mb-6">
        {servicio?.icon} Completa tus datos para continuar
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formulario?.campos?.map((campo) => (
          <div key={campo.name}>
            {campo.type !== 'info' && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {campo.label}
                {campo.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {renderField(campo)}
          </div>
        ))}

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 font-semibold rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-oliva text-white py-4 px-6 font-semibold rounded-xl hover:bg-oliva/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : (formulario?.button_text || 'Enviar solicitud')}
          </button>
        </div>
      </form>
    </div>
  );
}