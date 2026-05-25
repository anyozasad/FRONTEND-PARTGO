import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function ClientesCrud() {
  const empty = { tipo_documento: 'DNI', numero_documento: '', nombre: '', telefono: '', direccion: '' };
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const cargar = () => apiFetch('/clientes').then(setItems).catch(console.error);
  useEffect(() => { cargar(); }, []);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async e => {
    e.preventDefault();
    try {
      await apiFetch(editId ? `/clientes/${editId}` : '/clientes', { method: editId ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setForm(empty); setEditId(null); cargar();
    } catch(error) { Swal.fire('Error', error.message, 'error'); }
  };

  const editar = item => { setEditId(item.id); setForm({ tipo_documento: item.tipo_documento, numero_documento: item.numero_documento, nombre: item.nombre, telefono: item.telefono || '', direccion: item.direccion || '' }); };
  const eliminar = async id => { await apiFetch(`/clientes/${id}`, { method: 'DELETE' }); cargar(); };

  return <>
    <h3>Clientes</h3>
    <form className="row g-2 mb-4" onSubmit={guardar}>
      <div className="col-md-2"><select className="form-select" name="tipo_documento" value={form.tipo_documento} onChange={change}><option>DNI</option><option>RUC</option><option>CE</option><option>OTRO</option></select></div>
      <div className="col-md-2"><input className="form-control" name="numero_documento" placeholder="Documento" value={form.numero_documento} onChange={change} required /></div>
      <div className="col-md-3"><input className="form-control" name="nombre" placeholder="Nombre" value={form.nombre} onChange={change} required /></div>
      <div className="col-md-2"><input className="form-control" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={change} required /></div>
      <div className="col-md-2"><input className="form-control" name="direccion" placeholder="Dirección" value={form.direccion} onChange={change} required /></div>
      <div className="col-md-1"><button className="btn btn-dark w-100">OK</button></div>
    </form>
    <div className="table-responsive"><table className="table table-hover"><thead><tr><th>ID</th><th>Cliente</th><th>Documento</th><th>Teléfono</th><th>Acciones</th></tr></thead><tbody>{items.map(i => <tr key={i.id}><td>{i.id}</td><td>{i.nombre}</td><td>{i.tipo_documento} {i.numero_documento}</td><td>{i.telefono}</td><td><button className="btn btn-sm btn-warning me-2" onClick={() => editar(i)}>Editar</button><button className="btn btn-sm btn-danger" onClick={() => eliminar(i.id)}>Eliminar</button></td></tr>)}</tbody></table></div>
  </>;
}
