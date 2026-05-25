import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export default function Notificaciones() {
  const [items, setItems] = useState([]);
  const cargar = () => apiFetch('/admin/notificaciones').then(setItems).catch(console.error);
  useEffect(() => { cargar(); }, []);

  const marcar = async (id) => {
    await apiFetch(`/admin/notificaciones/${id}`, { method: 'PATCH' });
    cargar();
  };

  return (
    <>
      <h3>Notificaciones</h3>
      <p className="text-muted">Cuando el cliente compra, aquí aparece una alerta para el administrador.</p>
      <div className="row g-3">
        {items.map(n => (
          <div className="col-md-6" key={n.id}>
            <div className={`notification-card ${n.leido ? '' : 'unread'}`}>
              <strong>{n.titulo}</strong>
              <p>{n.mensaje}</p>
              <small>{new Date(n.creado_en).toLocaleString()}</small>
              {!n.leido && <button className="btn btn-sm btn-dark mt-2" onClick={() => marcar(n.id)}>Marcar leído</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
