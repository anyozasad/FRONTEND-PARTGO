import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarPassword from './pages/RecuperarPassword';
import ProductoDetalle from './pages/ProductoDetalle';
import Cliente from './pages/Cliente';
import Dashboard from './pages/Dashboard';
import ProductosCrud from './pages/ProductosCrud';
import CategoriasCrud from './pages/CategoriasCrud';
import ClientesCrud from './pages/ClientesCrud';
import Ventas from './pages/Ventas';
import UsuariosCrud from './pages/UsuariosCrud';
import RolesCrud from './pages/RolesCrud';
import Empresa from './pages/Empresa';
import PedidosAdmin from './pages/PedidosAdmin';
import Notificaciones from './pages/Notificaciones';
import Marcas from './pages/Marcas';
import Proveedores from './pages/Proveedores';
import Ofertas from './pages/Ofertas';
import MetodosPago from './pages/MetodosPago';
import Reclamos from './pages/Reclamos';
import HistorialStock from './pages/HistorialStock';
import Auditoria from './pages/Auditoria';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/producto/:id" element={<ProductoDetalle />} />
      <Route path="/cliente" element={<ProtectedRoute><Cliente /></ProtectedRoute>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<ProductosCrud />} />
        <Route path="/categorias" element={<CategoriasCrud />} />
        <Route path="/clientes" element={<ClientesCrud />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/pedidos" element={<PedidosAdmin />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/usuarios" element={<UsuariosCrud />} />
        <Route path="/roles" element={<RolesCrud />} />
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/metodos-pago" element={<MetodosPago />} />
        <Route path="/reclamos" element={<Reclamos />} />
        <Route path="/historial-stock" element={<HistorialStock />} />
        <Route path="/auditoria" element={<Auditoria />} />

      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
