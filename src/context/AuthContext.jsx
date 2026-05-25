import { createContext, useContext, useMemo, useState } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('partgo_usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('partgo_token', data.token);
      localStorage.setItem('partgo_usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      return data;
    } catch (error) {
      // login local de respaldo para exposición cuando el backend no está encendido
      const usuariosDemo = [
        { id: 1, nombre: 'Administrador', email: 'admin@gmail.com', password: '123456', rol_id: 1, rol: 'Administrador' },
        { id: 2, nombre: 'Vendedor', email: 'vendedor@gmail.com', password: '123456', rol_id: 2, rol: 'Vendedor' },
        { id: 3, nombre: 'Cliente PartGo', email: 'cliente@gmail.com', password: '123456', rol_id: 3, rol: 'Cliente' }
      ];

      const demo = usuariosDemo.find((u) => u.email === email && u.password === password);
      if (!demo) throw error;

      const usuarioSeguro = { ...demo };
      delete usuarioSeguro.password;

      localStorage.setItem('partgo_token', 'partgo_demo_token');
      localStorage.setItem('partgo_usuario', JSON.stringify(usuarioSeguro));
      setUsuario(usuarioSeguro);
      return { token: 'partgo_demo_token', usuario: usuarioSeguro };
    }
  };

  const logout = () => {
    localStorage.removeItem('partgo_token');
    localStorage.removeItem('partgo_usuario');
    setUsuario(null);
  };

  const value = useMemo(() => ({ usuario, login, logout, isAuth: !!usuario }), [usuario]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
