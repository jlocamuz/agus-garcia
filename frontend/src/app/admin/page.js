// pages/admin.js o app/admin/page.js
'use client';

import { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminContenido from '../components/admin/AdminContenido';
import AdminServicios from '../components/admin/AdminServicios';
import AdminRecursos from '../components/admin/AdminRecursos';
import AdminRespuestas from '../components/admin/AdminRespuestas';
export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'contenido':
        return <AdminContenido />;
      case 'servicios':
        return <AdminServicios />;
      case 'recursos':
        return <AdminRecursos />;
      case 'formularios':
        return <AdminRespuestas />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      {renderSection()}
    </AdminLayout>
  );
}