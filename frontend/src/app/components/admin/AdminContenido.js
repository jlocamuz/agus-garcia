'use client';

import { useState, useEffect } from 'react';
import { Edit3, Save, X, Plus, Trash2, Eye } from 'lucide-react';
import { 
  getTodoElContenido, 
  actualizarContenido, 
  crearContenido, 
  eliminarContenido 
}  from '@/app/lib/supabase';

export default function AdminContenido() {
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    id: '',
    seccion: '',
    tipo: '',
    contenido: '',
    orden: 0
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadContenido();
  }, []);

  const loadContenido = async () => {
    try {
      setLoading(true);
      const data = await getTodoElContenido();
      setContenido(data);
    } catch (error) {
      console.error('Error cargando contenido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = async () => {
    try {
      await actualizarContenido(editingItem.id, editingItem.contenido);
      await loadContenido();
      setEditingItem(null);
      alert('Contenido actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando contenido:', error);
      alert('Error al actualizar el contenido');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      try {
        await eliminarContenido(id);
        await loadContenido();
        alert('Contenido eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando contenido:', error);
        alert('Error al eliminar el contenido');
      }
    }
  };

  const handleCreateNew = async () => {
    try {
      if (!newItem.id || !newItem.seccion || !newItem.tipo || !newItem.contenido) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }

      await crearContenido(newItem);
      await loadContenido();
      setNewItem({
        id: '',
        seccion: '',
        tipo: '',
        contenido: '',
        orden: 0
      });
      setShowNewForm(false);
      alert('Contenido creado exitosamente');
    } catch (error) {
      console.error('Error creando contenido:', error);
      alert('Error al crear el contenido');
    }
  };

  const filteredContenido = contenido.filter(item => {
    if (filter === 'all') return true;
    return item.seccion === filter;
  });

  // Filtrar secciones para excluir contacto de los filtros
  const secciones = ['all', ...new Set(contenido.map(item => item.seccion).filter(seccion => seccion !== 'contacto'))];
  const tipos = ['titulo', 'subtitulo', 'texto', 'parrafo', 'boton', 'item-lista'];

  const getTypeColor = (tipo) => {
    const colors = {
      titulo: 'bg-blue-100 text-blue-800',
      subtitulo: 'bg-green-100 text-green-800',
      texto: 'bg-gray-100 text-gray-800',
      parrafo: 'bg-purple-100 text-purple-800',
      boton: 'bg-orange-100 text-orange-800',
      'item-lista': 'bg-pink-100 text-pink-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  // Función para obtener el nombre legible de la sección
  const getSectionDisplayName = (seccion) => {
    const nombres = {
      'hero': 'Página Principal',
      'about': 'Sobre Mí',
      'services': 'Servicios',
      'contacto': 'Contacto',
      'contact': 'Contacto',
      'footer': 'Footer (Pie de Página)',
      'redes': 'Redes Sociales'
    };
    return nombres[seccion] || seccion;
  };

  // Función para obtener el icono de la sección
  const getSectionIcon = (seccion) => {
    const iconos = {
      'hero': '🏠',
      'about': '👤',
      'services': '⚡',
      'contacto': '📞',
      'contact': '📞',
      'footer': '📄',
      'redes': '📱'
    };
    return iconos[seccion] || '📝';
  };

  // Función para obtener ejemplos según la sección
  const getExamplesForSection = (seccion) => {
    const ejemplos = {
      'footer': [
        { campo: 'footer-nombre', ejemplo: 'Agustina García' },
        { campo: 'footer-profesion', ejemplo: 'Psicóloga Clínica' },
        { campo: 'footer-telefono', ejemplo: '📞 +54 9 261 123-4568' },
        { campo: 'footer-email', ejemplo: '✉️ agustina@psiag.com' },
        { campo: 'footer-horarios-semana', ejemplo: 'Lunes a Viernes: 9:00 - 18:00hs' },
        { campo: 'footer-horarios-fines', ejemplo: 'Fines de semana: Con cita previa' }
      ],
      'redes': [
        { campo: 'redes-whatsapp', ejemplo: '5492611234567' },
        { campo: 'redes-instagram', ejemplo: 'agustina.psicologa' },
        { campo: 'redes-tiktok', ejemplo: 'agustina.psicologa' },
        { campo: 'redes-telegram', ejemplo: 'agustinapsicologia' },
        { campo: 'redes-linkedin', ejemplo: 'agustina-garcia-psicologa' },
        { campo: 'redes-facebook', ejemplo: 'agustina.psicologia' }
      ],
      'hero': [
        { campo: 'hero-nombre', ejemplo: 'Agustina García' },
        { campo: 'hero-profesion', ejemplo: 'Psicóloga Clínica' },
        { campo: 'hero-descripcion', ejemplo: 'Te ayudo a lidiar con el estrés...' },
        { campo: 'hero-boton-principal', ejemplo: 'Empezar terapia' }
      ]
    };
    return ejemplos[seccion] || [];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Contenido</h1>
          <p className="text-gray-600">Edita todos los textos de tu sitio web</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Elemento</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {secciones.map((seccion) => (
            <button
              key={seccion}
              onClick={() => setFilter(seccion)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === seccion
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {seccion === 'all' ? '📋 Todos' : `${getSectionIcon(seccion)} ${getSectionDisplayName(seccion)}`}
            </button>
          ))}
        </div>
        
        {/* Contador de elementos */}
        <div className="mt-3 text-sm text-gray-500">
          Mostrando {filteredContenido.length} de {contenido.length} elementos
          {filter !== 'all' && ` en la sección "${getSectionDisplayName(filter)}"`}
        </div>
      </div>

      {/* Formulario para nuevo elemento */}
      {showNewForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200 text-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Elemento de Contenido</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="ID único (ej: footer-nombre)"
              value={newItem.id}
              onChange={(e) => setNewItem({...newItem, id: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            
            <select
              value={newItem.seccion}
              onChange={(e) => setNewItem({...newItem, seccion: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            >
              <option value="">Seleccionar sección</option>
              <option value="hero">🏠 Página Principal (Hero)</option>
              <option value="about">👤 Sobre Mí</option>
              <option value="services">⚡ Servicios</option>
              <option value="footer">📄 Footer (Pie de Página)</option>
              <option value="redes">📱 Redes Sociales</option>
            </select>
            
            <select
              value={newItem.tipo}
              onChange={(e) => setNewItem({...newItem, tipo: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            >
              <option value="">Seleccionar tipo</option>
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Orden"
              value={newItem.orden}
              onChange={(e) => setNewItem({...newItem, orden: parseInt(e.target.value)})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          
          <textarea
            placeholder="Contenido del elemento"
            value={newItem.contenido}
            onChange={(e) => setNewItem({...newItem, contenido: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4 text-gray-900 placeholder-gray-500"
          />
          
          {/* Ejemplos según la sección seleccionada */}
          {newItem.seccion && getExamplesForSection(newItem.seccion).length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium mb-2">
                💡 Ejemplos para {getSectionDisplayName(newItem.seccion)}:
              </p>
              
              {/* Información especial para redes sociales */}
              {newItem.seccion === 'redes' && (
                <div className="mb-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                  <p className="text-xs text-green-700 font-medium mb-2">
                    ℹ️ <strong>URLs automáticas:</strong> Solo pon usuarios/números, las URLs se generan solas
                  </p>
                  <div className="text-xs text-green-600 space-y-1">
                    <p><strong>WhatsApp:</strong> Solo número (ej: 5492611234567) → https://wa.me/5492611234567</p>
                    <p><strong>Instagram:</strong> Solo usuario sin @ (ej: agustina.psicologa) → https://instagram.com/agustina.psicologa</p>
                    <p><strong>TikTok:</strong> Solo usuario sin @ (ej: agustina.psicologa) → https://tiktok.com/@agustina.psicologa</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getExamplesForSection(newItem.seccion).map((ejemplo, index) => (
                  <div key={index} className="text-xs text-blue-600">
                    <strong>{ejemplo.campo}:</strong> "{ejemplo.ejemplo}"
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Crear</span>
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      {/* Lista de contenido */}
      <div className="space-y-4">
        {filteredContenido.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.tipo)}`}>
                    {item.tipo}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {getSectionIcon(item.seccion)} {getSectionDisplayName(item.seccion)}
                  </span>
                  <span className="text-sm text-gray-400">#{item.orden}</span>
                  
                  {/* Badge especial para footer y redes */}
                  {item.seccion === 'footer' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      📄 Footer
                    </span>
                  )}
                  {item.seccion === 'redes' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      📱 Redes
                    </span>
                  )}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{item.id}</h3>
                
                {editingItem && editingItem.id === item.id ? (
                  <div className="space-y-3">
                    {item.tipo === 'texto' || item.tipo === 'parrafo' ? (
                      <textarea
                        value={editingItem.contenido}
                        onChange={(e) => setEditingItem({...editingItem, contenido: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editingItem.contenido}
                        onChange={(e) => setEditingItem({...editingItem, contenido: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                      />
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {item.contenido}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {editingItem && editingItem.id === item.id ? null : (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContenido.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenido</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'No hay elementos de contenido creados aún.' 
              : `No hay contenido en la sección "${getSectionDisplayName(filter)}".`
            }
          </p>
          {(filter === 'footer' || filter === 'redes') && (
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Crear contenido de {getSectionDisplayName(filter)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}