import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export default function Empresa() {
  const empty = { nombre: 'PartGo', ruc: '', direccion: '', telefono: '', correo: '' };
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const cargar = () => apiFetch('/empresa').then(setEmpresas).catch(console.error);
  useEffect(() => { cargar(); }, []);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async e => {
    e.preventDefault();
    await apiFetch(editId ? `/empresa/${editId}` : '/empresa', { method: editId ? 'PUT' : 'POST', body: JSON.stringify(form) });
    setForm(empty); setEditId(null); cargar();
  };

  const editar = emp => { setEditId(emp.id); setForm({ nombre: emp.nombre, ruc: emp.ruc, direccion: emp.direccion, telefono: emp.telefono, correo: emp.correo }); };

  return <>
    <h3>Datos de la empresa</h3>
    <form className="row g-2 mb-4" onSubmit={guardar}>
      {['nombre','ruc','direccion','telefono','correo'].map(campo => <div className="col-md-4" key={campo}><input className="form-control" name={campo} placeholder={campo.toUpperCase()} value={form[campo]} onChange={change} required /></div>)}
      <div className="col-md-2"><button className="btn btn-dark w-100">{editId ? 'Actualizar' : 'Guardar'}</button></div>
    </form>
    <div className="table-responsive"><table className="table table-hover"><thead><tr><th>Nombre</th><th>RUC</th><th>Dirección</th><th>Teléfono</th><th>Correo</th><th></th></tr></thead><tbody>{empresas.map(e => <tr key={e.id}><td>{e.nombre}</td><td>{e.ruc}</td><td>{e.direccion}</td><td>{e.telefono}</td><td>{e.correo}</td><td><button className="btn btn-sm btn-warning" onClick={() => editar(e)}>Editar</button></td></tr>)}</tbody></table></div>
  </>;
}
