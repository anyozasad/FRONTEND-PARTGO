import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function CategoriasCrud() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editId, setEditId] = useState(null);

  const cargar = () => apiFetch('/categorias').then(setItems).catch(console.error);
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(editId ? `/categorias/${editId}` : '/categorias', {
        method: editId ? 'PUT' : 'POST', body: JSON.stringify(form)
      });
      setForm({ nombre: '', descripcion: '' });
      setEditId(null);
      cargar();
    } catch (error) { Swal.fire('Error', error.message, 'error'); }
  };

  const editar = (item) => { setEditId(item.id); setForm({ nombre: item.nombre, descripcion: item.descripcion || '' }); };
  const eliminar = async (id) => { await apiFetch(`/categorias/${id}`, { method: 'DELETE' }); cargar(); };

  return (
    <>
      <h3>Categorías de repuestos</h3>
      <form className="row g-2 mb-4" onSubmit={guardar}>
        <div className="col-md-4"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
        <div className="col-md-6"><input className="form-control" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required /></div>
        <div className="col-md-2"><button className="btn btn-dark w-100">{editId ? 'Actualizar' : 'Guardar'}</button></div>
      </form>
      <Table headers={['ID', 'Nombre', 'Descripción', 'Acciones']} rows={items.map(i => [i.id, i.nombre, i.descripcion, <Actions onEdit={() => editar(i)} onDelete={() => eliminar(i.id)} />])} />
    </>
  );
}

function Actions({ onEdit, onDelete }) { return <><button className="btn btn-sm btn-warning me-2" onClick={onEdit}>Editar</button><button className="btn btn-sm btn-danger" onClick={onDelete}>Eliminar</button></>; }
function Table({ headers, rows }) { return <div className="table-responsive"><table className="table table-hover"><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((c,j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>; }
