import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

const pedidosDemo = [
  { id: 1, numero_comprobante: 'B001-000001', cliente: 'Cliente PartGo', documento: '71790069', metodo_pago: 'YAPE', total: 150, estado: 'PENDIENTE' },
  { id: 2, numero_comprobante: 'B001-000002', cliente: 'Carlos Ramos', documento: '74581236', metodo_pago: 'TARJETA', total: 280, estado: 'EN_PREPARACION' }
];

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [detalle, setDetalle] = useState(null);

  const cargar = () => apiFetch('/admin/pedidos').then(setPedidos).catch(() => setPedidos(pedidosDemo));
  useEffect(() => { cargar(); }, []);

  const verDetalle = async (id) => {
    try {
      setDetalle(await apiFetch(`/admin/pedidos/${id}`));
    } catch {
      const base = pedidosDemo.find((p) => p.id === id);
      setDetalle({ ...base, telefono: '922859170', direccion: 'Pucallpa, Perú', tipo_comprobante: 'BOLETA', detalle: [
        { id: 1, producto_nombre: 'Aceite Lubricante 4T', cantidad: 1, precio_unitario: 95, subtotal: 95 },
        { id: 2, producto_nombre: 'Pastillas de freno', cantidad: 1, precio_unitario: 55, subtotal: 55 }
      ]});
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await apiFetch(`/admin/pedidos/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) });
    } catch {
      setPedidos((actual) => actual.map((p) => p.id === id ? { ...p, estado } : p));
    }
    Swal.fire('Actualizado', `Pedido marcado como ${estado}`, 'success');
    cargar();
  };

  return (
    <>
      <h3>Pedidos de clientes</h3>
      <p className="text-muted">Aquí aparece lo que compra el usuario desde la tienda. El administrador puede revisar datos, pago, boleta y productos.</p>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>N°</th><th>Cliente</th><th>Documento</th><th>Pago</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{p.numero_comprobante}</td>
                <td>{p.cliente}</td>
                <td>{p.documento}</td>
                <td>{p.metodo_pago}</td>
                <td>S/ {Number(p.total).toFixed(2)}</td>
                <td><span className="badge text-bg-info">{p.estado}</span></td>
                <td>
                  <button className="btn btn-sm btn-dark me-2" onClick={() => verDetalle(p.id)}>Ver</button>
                  <select className="form-select form-select-sm d-inline-block" style={{ width: 150 }} value={p.estado} onChange={(e) => cambiarEstado(p.id, e.target.value)}>
                    {['PENDIENTE','PAGADO','EN_PREPARACION','ENVIADO','ENTREGADO','CANCELADO'].map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalle && (
        <div className="admin-card mt-4">
          <h4>Detalle del pedido {detalle.numero_comprobante}</h4>
          <p><strong>Cliente:</strong> {detalle.cliente} | <strong>Teléfono:</strong> {detalle.telefono} | <strong>Dirección:</strong> {detalle.direccion}</p>
          <p><strong>Comprobante:</strong> {detalle.tipo_comprobante} | <strong>Pago:</strong> {detalle.metodo_pago} | <strong>Total:</strong> S/ {Number(detalle.total).toFixed(2)}</p>
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Imagen</th><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
              <tbody>
                {detalle.detalle.map(d => (
                  <tr key={d.id}>
                    <td>{d.producto_imagen && <img src={d.producto_imagen} alt={d.producto_nombre} style={{ width: 55, height: 55, objectFit: 'cover', borderRadius: 10 }} />}</td>
                    <td>{d.producto_nombre}</td>
                    <td>{d.cantidad}</td>
                    <td>S/ {Number(d.precio_unitario).toFixed(2)}</td>
                    <td>S/ {Number(d.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
