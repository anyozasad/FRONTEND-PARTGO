import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const salir = async () => {
    const resp = await Swal.fire({
      title: '¿Estás seguro de cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#facc15',
      cancelButtonColor: '#111827'
    });

    if (resp.isConfirmed) {
      logout();
      navigate('/login');
    }
  };

  const moverMenu = (direccion) => {
    if (!navRef.current) return;
    navRef.current.scrollBy({ top: direccion === 'arriba' ? -180 : 180, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand text-decoration-none">
          <span className="brand-icon">PG</span>
          <div>
            <strong>PartGo</strong>
            <small>Repuestos de Moto</small>
          </div>
        </Link>

        <button type="button" className="sidebar-scroll-btn" onClick={() => moverMenu('arriba')} title="Subir menú">
          <ChevronUp size={18} />
        </button>

        <nav ref={navRef} className="nav flex-column gap-1 mt-3 admin-nav-scroll">
          <Link className="nav-link" to="/dashboard">Panel Principal</Link>
          <Link className="nav-link" to="/productos">Productos</Link>
          <Link className="nav-link" to="/categorias">Categorías</Link>
          <Link className="nav-link" to="/clientes">Clientes</Link>
          <Link className="nav-link" to="/pedidos">Pedidos de clientes</Link>
          <Link className="nav-link" to="/notificaciones">Notificaciones</Link>
          <Link className="nav-link" to="/ventas">Ventas internas</Link>
          <Link className="nav-link" to="/usuarios">Usuarios</Link>
          <Link className="nav-link" to="/roles">Roles</Link>
          <Link className="nav-link" to="/empresa">Empresa</Link>
          <Link className="nav-link" to="/marcas">Marcas</Link>
          <Link className="nav-link" to="/proveedores">Proveedores</Link>
          <Link className="nav-link" to="/ofertas">Ofertas</Link>
          <Link className="nav-link" to="/metodos-pago">Métodos de pago</Link>
          <Link className="nav-link" to="/historial-stock">Historial stock</Link>
          <Link className="nav-link" to="/reclamos">Reclamos</Link>
          <Link className="nav-link" to="/auditoria">Auditoría</Link>
        </nav>

        <button type="button" className="sidebar-scroll-btn" onClick={() => moverMenu('abajo')} title="Bajar menú">
          <ChevronDown size={18} />
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h5 className="mb-0">Sistema de ventas PartGo</h5>
            <small className="text-muted">Control de productos, clientes, pedidos, pagos, boletas y stock</small>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="badge text-bg-light">{usuario?.nombre || 'Usuario'}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={salir}>Salir</button>
          </div>
        </header>

        <section className="content-card">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
