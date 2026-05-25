
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function AdminCrudSimple({ titulo, recurso, campos }) {
  const empty = Object.fromEntries(campos.map(c => [c.name, c.default ?? '']));
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const cargar = () => apiFetch(`/${recurso}`).then(setItems).catch(console.error);
  useEffect(() => { cargar(); }, [recurso]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(editId ? `/${recurso}/${editId}` : `/${recurso}`, {
        method: editId ? 'PUT' : 'POST',
        body: JSON.stringify(form)
      });
      Swal.fire('Correcto', editId ? 'Registro actualizado' : 'Registro creado', 'success');
      setForm(empty); setEditId(null); cargar();
    } catch (error) { Swal.fire('Error', error.message, 'error'); }
  };

  const editar = (item) => { setEditId(item.id); setForm({ ...empty, ...item }); };
  const eliminar = async (id) => {
    if (!confirm('¿Eliminar registro?')) return;
    await apiFetch(`/${recurso}/${id}`, { method: 'DELETE' });
    cargar();
  };

  return <>
    <h3>{titulo}</h3>
    <p className="text-muted">Módulo administrativo del sistema PartGo.</p>
    <form className="row g-2 mb-4" onSubmit={guardar}>
      {campos.map(c => (
        <div className={c.col || 'col-md-3'} key={c.name}>
          <input className="form-control" type={c.type || 'text'} name={c.name} placeholder={c.label} value={form[c.name] ?? ''} onChange={change} required={c.required} />
        </div>
      ))}
      <div className="col-md-2"><button className="btn btn-dark w-100">{editId ? 'Actualizar' : 'Guardar'}</button></div>
    </form>

    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead><tr><th>ID</th>{campos.slice(0,6).map(c => <th key={c.name}>{c.label}</th>)}<th>Acciones</th></tr></thead>
        <tbody>{items.map(item => <tr key={item.id}>
          <td>{item.id}</td>
          {campos.slice(0,6).map(c => <td key={c.name}>{String(item[c.name] ?? '')}</td>)}
          <td><button className="btn btn-sm btn-warning me-2" onClick={() => editar(item)}>Editar</button><button className="btn btn-sm btn-danger" onClick={() => eliminar(item.id)}>Eliminar</button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </>;
}
