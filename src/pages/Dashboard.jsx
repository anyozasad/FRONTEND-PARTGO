import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';

const datosDemoDashboard = {
  total_productos: 24,
  total_clientes: 8,
  total_ventas: 12,
  ingresos: 1850,
  stock_bajo: 3,
  notificaciones: 4,
  ultimasVentas: [
    { id: 1, numero_comprobante: 'B001-000001', cliente: 'Cliente PartGo', metodo_pago: 'YAPE', total: 150, estado: 'PAGADO' },
    { id: 2, numero_comprobante: 'B001-000002', cliente: 'Carlos Ramos', metodo_pago: 'TARJETA', total: 280, estado: 'ENVIADO' }
  ],
  stockBajo: [
    { id: 1, nombre: 'Pastillas de freno', categoria: 'Frenos', stock: 2 },
    { id: 2, nombre: 'Aceite 4T', categoria: 'Motor', stock: 3 }
  ],
  productosVendidos: [
    { nombre: 'Aceite 4T', cantidad_vendida: 18, total_generado: 702 },
    { nombre: 'Cadena reforzada', cantidad_vendida: 9, total_generado: 720 }
  ]
};

export default function Dashboard() {
  const [data, setData] = useState({
    total_productos: 0,
    total_clientes: 0,
    total_ventas: 0,
    ingresos: 0,
    stock_bajo: 0,
    notificaciones: 0,
    ultimasVentas: [],
    stockBajo: [],
    productosVendidos: []
  });

  useEffect(() => {
    apiFetch('/dashboard').then(setData).catch(() => setData(datosDemoDashboard));
  }, []);

  const cards = [
    ['Productos', data.total_productos],
    ['Clientes', data.total_clientes],
    ['Pedidos/Ventas', data.total_ventas],
    ['Ingresos S/', Number(data.ingresos || 0).toFixed(2)],
    ['Stock bajo', data.stock_bajo],
    ['Alertas', data.notificaciones]
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Panel Principal</h3>
          <p className="text-muted mb-0">Resumen administrativo de clientes, pedidos, stock y notificaciones.</p>
        </div>
        <Link className="btn btn-dark" to="/pedidos">Ver pedidos de clientes</Link>
      </div>

      <div className="row g-3 mt-1 mb-4">
        {cards.map(([title, value]) => (
          <div className="col-md-4 col-xl-2" key={title}>
            <div className="metric-card">
              <span>{title}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="admin-card">
            <h4>Últimos pedidos de clientes</h4>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>N°</th><th>Cliente</th><th>Pago</th><th>Total</th><th>Estado</th></tr></thead>
                <tbody>
                  {(data.ultimasVentas || []).map(v => (
                    <tr key={v.id}>
                      <td>{v.numero_comprobante}</td>
                      <td>{v.cliente}</td>
                      <td>{v.metodo_pago}</td>
                      <td>S/ {Number(v.total).toFixed(2)}</td>
                      <td><span className="badge text-bg-success">{v.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="admin-card">
            <h4>Stock bajo</h4>
            {(data.stockBajo || []).map(p => (
              <div className="stock-row" key={p.id}>
                {p.imagen && <img src={p.imagen} alt={p.nombre} />}
                <div><strong>{p.nombre}</strong><small>{p.categoria}</small></div>
                <span className="badge text-bg-danger">{p.stock}</span>
              </div>
            ))}
            {!data.stockBajo?.length && <p className="text-muted">No hay productos con stock bajo.</p>}
          </div>
        </div>

        <div className="col-12">
          <div className="admin-card">
            <h4>Productos más vendidos</h4>
            <div className="row g-3">
              {(data.productosVendidos || []).map(p => (
                <div className="col-md-4" key={p.nombre}>
                  <div className="best-card"><strong>{p.nombre}</strong><span>{p.cantidad_vendida} vendidos</span><small>S/ {Number(p.total_generado).toFixed(2)}</small></div>
                </div>
              ))}
              {!data.productosVendidos?.length && <p className="text-muted">Aún no hay datos de ventas.</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
