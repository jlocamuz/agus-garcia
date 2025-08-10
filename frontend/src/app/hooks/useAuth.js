// app/hooks/useAuth.js
'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    const expiry = localStorage.getItem('admin_auth_expiry');
    if (savedAuth === 'true' && expiry && Date.now() < parseInt(expiry)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_auth_expiry');
    }
    setLoading(false);
  }, []);

  const login = async (password) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_auth_expiry', expiry.toString());
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_auth_expiry');
  };

  return { isAuthenticated, loading, login, logout };
}