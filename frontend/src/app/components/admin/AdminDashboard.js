'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Folder, 
  Settings, 
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import { 
  getTodoElContenido, 
  getRecursos, 
  getServicios,
  supabase 
} from '@/app/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contenido: 0,
    servicios: 0,
    recursos: 0,
    respuestas: 0,
    recursosItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [contenidoRes, serviciosRes, recursosRes, respuestasRes, actividadRes] = await Promise.all([
          fetch('/api/contenido'),
          fetch('/api/servicios'),
          fetch('/api/recursos'),
          fetch('/api/respuestas'),
          fetch('/api/actividad'),
        ]);
        const contenidoJson = await contenidoRes.json();
        const serviciosJson = await serviciosRes.json();
        const recursosJson = await recursosRes.json();
        const respuestasJson = await respuestasRes.json();
        const actividadJson = await actividadRes.json();
        const contenidoData = contenidoJson.contenido || [];
        const serviciosData = serviciosJson.servicios || [];
        const recursosData = recursosJson.recursos || [];
        const respuestasData = respuestasJson.respuestas || [];
        const actividadData = actividadJson.actividad || [];
        const totalItemsRecursos = recursosData.reduce((total, recurso) => {
          return total + (recurso.items?.length || 0);
        }, 0);
        setStats({
          contenido: contenidoData.length,
          servicios: serviciosData.length,
          recursos: recursosData.length,
          respuestas: respuestasData.length,
          recursosItems: totalItemsRecursos
        });
        setRecentActivity(actividadData);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Contenido Web',
      value: stats.contenido,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Elementos de contenido'
    },
    {
      title: 'Servicios',
      value: stats.servicios,
      icon: Settings,
      color: 'bg-green-500',
      description: 'Servicios disponibles'
    },
    {
      title: 'Recursos',
      value: `${stats.recursos}/${stats.recursosItems}`,
      icon: Folder,
      color: 'bg-purple-500',
      description: 'Recursos/Items'
    },
    {
      title: 'Respuestas',
      value: stats.respuestas,
      icon: MessageSquare,
      color: 'bg-orange-500',
      description: 'Formularios recibidos'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tu sitio web</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Nueva respuesta de formulario
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.nombre ? `${activity.nombre}` : 'Nombre desconocido'}
                      {activity.email ? ` • ${activity.email}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.servicio_id ? `Servicio: ${activity.servicio_id}` : ''}
                      {activity.telefono ? ` • Tel: ${activity.telefono}` : ''}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay actividad reciente</p>
            </div>
          )}
        </div>

    
      </div>

 
    </div>
  );
}