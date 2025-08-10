'use client';

import { useState, useEffect } from 'react';
import { Edit3, Save, X, Plus, Trash2, Star, Clock, DollarSign, Settings } from 'lucide-react';
import { 
  getServicios,
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  diagnosticarTablaServicios,
  supabase
} from '@/app/lib/supabase';

export default function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newServicio, setNewServicio] = useState({
    id: '',
    title: '',
    price: '',
    duration: '',
    features: [''],
    popular: false,
    icon: '',
    button_text: '',
    horario: '',
    form_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos...');
      
      const [serviciosData, formulariosResult] = await Promise.all([
        getServicios(),
        supabase.from('formularios').select('*')
      ]);
      
      console.log('📋 Servicios cargados:', serviciosData);
      console.log('📝 Formularios cargados:', formulariosResult.data);
      
      setServicios(serviciosData);
      setFormularios(formulariosResult.data || []);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (servicio) => {
    console.log('✏️ Editando servicio:', servicio);
    setEditingItem({
      ...servicio,
      features: Array.isArray(servicio.features) ? servicio.features : (servicio.features ? [servicio.features] : ['']),
      price: servicio.price || '',
      duration: servicio.duration || '',
      horario: servicio.horario || '',
      form_id: servicio.form_id || '',
      icon: servicio.icon || '',
      button_text: servicio.button_text || ''
    });
  };

  const handleSave = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      console.log('💾 Iniciando guardado...');
      console.log('📊 Estado actual de editingItem:', editingItem);
      
      // Validar datos requeridos
      if (!editingItem.id || !editingItem.title?.trim()) {
        alert('ID y Título son campos requeridos');
        return;
      }
      
      // Preparar los datos para actualizar
      const updateData = {
        title: editingItem.title.trim(),
        price: editingItem.price?.trim() || null,
        duration: editingItem.duration?.trim() || null,
        features: Array.isArray(editingItem.features) 
          ? editingItem.features.filter(f => f && f.trim() !== '') 
          : [],
        popular: Boolean(editingItem.popular),
        icon: editingItem.icon?.trim() || null,
        button_text: editingItem.button_text?.trim() || null,
        horario: editingItem.horario?.trim() || null,
        form_id: editingItem.form_id?.trim() || null
      };

      console.log('📤 Datos a enviar:', updateData);

      // Usar la nueva función de actualización
      await actualizarServicio(editingItem.id, updateData);

      console.log('🔄 Recargando datos...');
      // Recargar datos para ver los cambios
      await loadData();
      setEditingItem(null);
      alert('✅ Servicio actualizado exitosamente');
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      alert(`❌ Error al actualizar el servicio: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        console.log('🗑️ Eliminando servicio:', id);
        
        await eliminarServicio(id);
        await loadData();
        alert('✅ Servicio eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error eliminando servicio:', error);
        alert(`❌ Error al eliminar el servicio: ${error.message}`);
      }
    }
  };

  const handleCreateNew = async () => {
    try {
      if (!newServicio.id?.trim() || !newServicio.title?.trim()) {
        alert('Por favor completa los campos requeridos (ID y Título)');
        return;
      }

      console.log('➕ Creando nuevo servicio:', newServicio);

      const createData = {
        id: newServicio.id.trim(),
        title: newServicio.title.trim(),
        price: newServicio.price?.trim() || null,
        duration: newServicio.duration?.trim() || null,
        features: newServicio.features.filter(f => f && f.trim() !== ''),
        popular: Boolean(newServicio.popular),
        icon: newServicio.icon?.trim() || null,
        button_text: newServicio.button_text?.trim() || null,
        horario: newServicio.horario?.trim() || null,
        form_id: newServicio.form_id?.trim() || null
      };

      await crearServicio(createData);
      await loadData();
      setNewServicio({
        id: '',
        title: '',
        price: '',
        duration: '',
        features: [''],
        popular: false,
        icon: '',
        button_text: '',
        horario: '',
        form_id: ''
      });
      setShowNewForm(false);
      alert('✅ Servicio creado exitosamente');
    } catch (error) {
      console.error('❌ Error creando servicio:', error);
      alert('❌ Error al crear el servicio: ' + error.message);
    }
  };

  const addFeature = (isEditing = false) => {
    if (isEditing) {
      setEditingItem(prev => ({
        ...prev,
        features: [...(prev.features || []), '']
      }));
    } else {
      setNewServicio(prev => ({
        ...prev,
        features: [...(prev.features || []), '']
      }));
    }
  };

  const removeFeature = (index, isEditing = false) => {
    if (isEditing) {
      setEditingItem(prev => ({
        ...prev,
        features: (prev.features || []).filter((_, i) => i !== index)
      }));
    } else {
      setNewServicio(prev => ({
        ...prev,
        features: (prev.features || []).filter((_, i) => i !== index)
      }));
    }
  };

  const updateFeature = (index, value, isEditing = false) => {
    if (isEditing) {
      setEditingItem(prev => {
        const newFeatures = [...(prev.features || [])];
        newFeatures[index] = value;
        return {
          ...prev,
          features: newFeatures
        };
      });
    } else {
      setNewServicio(prev => {
        const newFeatures = [...(prev.features || [])];
        newFeatures[index] = value;
        return {
          ...prev,
          features: newFeatures
        };
      });
    }
  };

  const handleInputChange = (field, value, isEditing = false) => {
    console.log(`🔄 Cambiando ${field}:`, value);
    
    if (isEditing) {
      setEditingItem(prev => {
        const updated = {
          ...prev,
          [field]: value
        };
        console.log('📊 Estado actualizado editingItem:', updated);
        return updated;
      });
    } else {
      setNewServicio(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Función para verificar conexión con Supabase
  const testConnection = async () => {
    try {
      console.log('🔍 Probando conexión con Supabase...');
      const result = await diagnosticarTablaServicios();
      console.log('📊 Resultado del diagnóstico:', result);
      
      if (result.success) {
        alert(`✅ Conexión OK\n- Filas: ${result.rowCount}\n- Estructura: ${result.structure?.join(', ')}`);
      } else {
        alert(`❌ Error de conexión: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error en test de conexión:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        {[1, 2, 3].map((i) => (
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
      {/* Header con botón de debug */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600">Administra los servicios de tu sitio web</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={testConnection}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            🔍 Test DB
          </button>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* Información de debug */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-900">
        <p><strong>Total servicios:</strong> {servicios.length}</p>
        <p><strong>Editando:</strong> {editingItem ? editingItem.id : 'Ninguno'}</p>
        <p><strong>Estado guardando:</strong> {saving ? 'Sí' : 'No'}</p>
      </div>

      {/* Formulario para nuevo servicio */}
      {showNewForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200 text-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Servicio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
              <input
                type="text"
                value={newServicio.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="consulta-online"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={newServicio.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Consulta Online"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="text"
                value={newServicio.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="$50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <input
                type="text"
                value={newServicio.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="60 min"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
              <input
                type="text"
                value={newServicio.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="💻"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto del Botón</label>
              <input
                type="text"
                value={newServicio.button_text}
                onChange={(e) => handleInputChange('button_text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Agendar sesión"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
              <input
                type="text"
                value={newServicio.horario}
                onChange={(e) => handleInputChange('horario', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Lunes a Viernes 9:00-18:00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formulario</label>
              <select
                value={newServicio.form_id}
                onChange={(e) => handleInputChange('form_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Seleccionar formulario</option>
                {formularios.map(form => (
                  <option key={form.id} value={form.id}>{form.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newServicio.popular}
                onChange={(e) => handleInputChange('popular', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Marcar como popular</span>
            </label>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
            {(newServicio.features || []).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Característica del servicio"
                />
                <button
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addFeature()}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              + Agregar característica
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Crear Servicio</span>
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

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="bg-white rounded-xl p-6 shadow-sm">
            {editingItem && editingItem.id === servicio.id ? (
              // Modo edición
              <div className="space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Editando:</strong> {editingItem.id}
                  </p>
                  <p className="text-xs text-yellow-600">
                    Precio actual: "{editingItem.price}"
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => handleInputChange('title', e.target.value, true)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Título"
                  />
                  <input
                    type="text"
                    value={editingItem.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value, true)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Icono"
                  />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Precio</label>
                    <input
                      type="text"
                      value={editingItem.price}
                      onChange={(e) => handleInputChange('price', e.target.value, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Precio"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Duración</label>
                    <input
                      type="text"
                      value={editingItem.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Duración"
                    />
                  </div>
                </div>
                
                <input
                  type="text"
                  value={editingItem.button_text}
                  onChange={(e) => handleInputChange('button_text', e.target.value, true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Texto del botón"
                />
                
                <input
                  type="text"
                  value={editingItem.horario || ''}
                  onChange={(e) => handleInputChange('horario', e.target.value, true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Horario (opcional)"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
                  {(editingItem.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value, true)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeFeature(index, true)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addFeature(true)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    + Agregar característica
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingItem.popular}
                      onChange={(e) => handleInputChange('popular', e.target.checked, true)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Popular</span>
                  </label>
                  
                  <select
                    value={editingItem.form_id || ''}
                    onChange={(e) => handleInputChange('form_id', e.target.value, true)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Sin formulario</option>
                    {formularios.map(form => (
                      <option key={form.id} value={form.id}>{form.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      saving 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              // Modo vista
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{servicio.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{servicio.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <DollarSign className="w-4 h-4" />
                        <span>{servicio.price || 'Sin precio'}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{servicio.duration || 'Sin duración'}</span>
                        {servicio.popular && (
                          <>
                            <Star className="w-4 h-4 text-yellow-500 ml-2" />
                            <span className="text-yellow-600">Popular</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(servicio)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(servicio.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {servicio.horario && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-800">📅 {servicio.horario}</span>
                  </div>
                )}
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Características:</h4>
                  <ul className="space-y-1">
                    {(servicio.features || []).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm font-medium">
                    {servicio.button_text || 'Sin texto'}
                  </button>
                  {servicio.formulario && (
                    <span className="text-xs text-gray-500">
                      Formulario: {servicio.formulario.nombre}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {servicios.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios</h3>
          <p className="text-gray-600">Crea tu primer servicio para comenzar.</p>
        </div>
      )}
    </div>
  );
}