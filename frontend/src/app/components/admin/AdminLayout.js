'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
// ... tus otros imports necesarios para el layout

export default function AdminLayout({ children, activeSection, onSectionChange }) {
  const { isAuthenticated, loading, login, logout } = useAuth();
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (login(password)) {
      setPassword(''); // Limpiar campo
    } else {
      alert('Contraseña incorrecta');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Acceso Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 text-gray-900"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tu layout actual del admin (aquí va tu estructura completa)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del admin */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar y contenido */}
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'contenido', label: 'Contenido', icon: '📝' },
                { id: 'servicios', label: 'Servicios', icon: '⚕️' },
                { id: 'recursos', label: 'Recursos', icon: '📚' },
                { id: 'formularios', label: 'Respuestas', icon: '📋' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeSection === item.id
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}