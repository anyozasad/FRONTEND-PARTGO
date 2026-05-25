import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function UsuariosCrud() {
  const empty = { nombre: '', email: '', password: '', rol_id: '', estado: 1 };
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const cargar = async () => { setUsuarios(await apiFetch('/usuarios')); setRoles(await apiFetch('/roles')); };
  useEffect(() => { cargar().catch(console.error); }, []);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async e => {
    e.preventDefault();
    try {
      const body = editId ? { nombre: form.nombre, email: form.email, rol_id: form.rol_id, estado: form.estado } : form;
      await apiFetch(editId ? `/usuarios/${editId}` : '/usuarios', { method: editId ? 'PUT' : 'POST', body: JSON.stringify(body) });
      setForm(empty); setEditId(null); cargar();
    } catch(error) { Swal.fire('Error', error.message, 'error'); }
  };

  const editar = u => { setEditId(u.id); const rol = roles.find(r => r.nombre === u.rol); setForm({ nombre: u.nombre, email: u.email, password: '', rol_id: rol?.id || '', estado: u.estado }); };
  const eliminar = async id => { await apiFetch(`/usuarios/${id}`, { method: 'DELETE' }); cargar(); };

  return <>
    <h3>Usuarios</h3>
    <form className="row g-2 mb-4" onSubmit={guardar}>
      <div className="col-md-3"><input className="form-control" name="nombre" placeholder="Nombre" value={form.nombre} onChange={change} required /></div>
      <div className="col-md-3"><input className="form-control" name="email" type="email" placeholder="Correo" value={form.email} onChange={change} required /></div>
      {!editId && <div className="col-md-2"><input className="form-control" name="password" type="password" placeholder="Contraseña" value={form.password} onChange={change} required /></div>}
      <div className="col-md-2"><select className="form-select" name="rol_id" value={form.rol_id} onChange={change} required><option value="">Rol</option>{roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}</select></div>
      <div className="col-md-2"><button className="btn btn-dark w-100">{editId ? 'Actualizar' : 'Guardar'}</button></div>
    </form>
    <div className="table-responsive"><table className="table table-hover"><thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{usuarios.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td><td>{u.estado ? 'Activo' : 'Inactivo'}</td><td><button className="btn btn-sm btn-warning me-2" onClick={() => editar(u)}>Editar</button><button className="btn btn-sm btn-danger" onClick={() => eliminar(u.id)}>Eliminar</button></td></tr>)}</tbody></table></div>
  </>;
}
