import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export default function RolesCrud() {
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editId, setEditId] = useState(null);

  const cargar = () => apiFetch('/roles').then((data) => setRoles(data.filter((r) => String(r.nombre).toUpperCase() !== 'ANALISTA'))).catch(console.error);
  useEffect(() => { cargar(); }, []);

  const guardar = async e => {
    e.preventDefault();
    if (nombre.trim().toUpperCase() === 'ANALISTA') return alert('El rol ANALISTA no se usa en el sistema.');
    await apiFetch(editId ? `/roles/${editId}` : '/roles', { method: editId ? 'PUT' : 'POST', body: JSON.stringify({ nombre }) });
    setNombre(''); setEditId(null); cargar();
  };

  const editar = r => { setEditId(r.id); setNombre(r.nombre); };
  const eliminar = async id => { await apiFetch(`/roles/${id}`, { method: 'DELETE' }); cargar(); };

  return <>
    <h3>Roles</h3>
    <form className="row g-2 mb-4" onSubmit={guardar}>
      <div className="col-md-6"><input className="form-control" placeholder="Nombre del rol" value={nombre} onChange={e => setNombre(e.target.value)} required /></div>
      <div className="col-md-2"><button className="btn btn-dark w-100">{editId ? 'Actualizar' : 'Guardar'}</button></div>
    </form>
    <div className="table-responsive"><table className="table table-hover"><thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead><tbody>{roles.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.nombre}</td><td><button className="btn btn-sm btn-warning me-2" onClick={() => editar(r)}>Editar</button><button className="btn btn-sm btn-danger" onClick={() => eliminar(r.id)}>Eliminar</button></td></tr>)}</tbody></table></div>
  </>;
}
