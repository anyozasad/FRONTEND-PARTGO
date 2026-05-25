import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

const ventasDemo = [
  { id: 1, numero_comprobante: 'B001-000001', cliente: 'Cliente PartGo', documento: '71790069', metodo_pago: 'YAPE', total: 150, estado: 'PAGADO', fecha: new Date().toISOString() },
  { id: 2, numero_comprobante: 'B001-000002', cliente: 'Carlos Ramos', documento: '74581236', metodo_pago: 'TARJETA', total: 280, estado: 'ENVIADO', fecha: new Date().toISOString() }
];

export default function Ventas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    apiFetch('/ventas').then(setVentas).catch(() => setVentas(ventasDemo));
  }, []);

  return (
    <>
      <h3>Historial de ventas internas y pedidos</h3>
      <p className="text-muted">Las compras que realiza el cliente desde la tienda aparecen aquí y en Pedidos de clientes.</p>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr><th>N° comprobante</th><th>Cliente</th><th>Documento</th><th>Pago</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td>{v.numero_comprobante}</td>
                <td>{v.cliente}</td>
                <td>{v.documento}</td>
                <td>{v.metodo_pago}</td>
                <td>S/ {Number(v.total).toFixed(2)}</td>
                <td><span className="badge text-bg-success">{v.estado}</span></td>
                <td>{new Date(v.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
