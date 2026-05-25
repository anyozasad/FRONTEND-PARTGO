import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function ProductosCrud() {
  const empty = {
    categoria_id: '', nombre: '', marca: '', modelo: '', descripcion: '', precio: '', precio_oferta: '', stock: '', imagen: '', en_oferta: 0, es_nuevo: 0, destacado: 0, agotado: 0, estado: 1
  };
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [buscar, setBuscar] = useState('');

  const cargar = async () => {
    setProductos(await apiFetch('/productos'));
    setCategorias(await apiFetch('/categorias'));
  };

  useEffect(() => { cargar().catch(console.error); }, []);

  const change = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value });
  };

  const guardar = async e => {
    e.preventDefault();
    try {
      await apiFetch(editId ? `/productos/${editId}` : '/productos', {
        method: editId ? 'PUT' : 'POST',
        body: JSON.stringify({ ...form, stock: Number(form.agotado) === 1 ? 0 : form.stock })
      });
      Swal.fire('Correcto', editId ? 'Producto actualizado' : 'Producto creado', 'success');
      setForm(empty);
      setEditId(null);
      cargar();
    } catch(error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const editar = p => {
    setEditId(p.id);
    setForm({
      categoria_id: p.categoria_id || '', nombre: p.nombre || '', marca: p.marca || '', modelo: p.modelo || p.modelo_moto || '', descripcion: p.descripcion || '',
      precio: p.precio || '', precio_oferta: p.precio_oferta || '', stock: p.stock || '', imagen: p.imagen || '', en_oferta: p.en_oferta || 0, es_nuevo: p.es_nuevo || 0, destacado: p.destacado || 0, agotado: Number(p.stock || 0) <= 0 ? 1 : 0, estado: p.estado ?? 1
    });
  };

  const eliminar = async id => {
    if (!confirm('¿Eliminar producto?')) return;
    await apiFetch(`/productos/${id}`, { method: 'DELETE' });
    cargar();
  };

  const filtrados = productos.filter(p => `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(buscar.toLowerCase()));

  return <>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h3>Productos / Repuestos</h3>
        <p className="text-muted mb-0">Administra stock, imágenes, ofertas y productos nuevos para la tienda del cliente.</p>
      </div>
      <input className="form-control search" placeholder="Buscar repuesto..." value={buscar} onChange={e => setBuscar(e.target.value)} />
    </div>

    <form className="row g-2 mb-4" onSubmit={guardar}>
      <div className="col-md-3"><select className="form-select" name="categoria_id" value={form.categoria_id} onChange={change} required><option value="">Categoría</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
      <div className="col-md-3"><input className="form-control" name="nombre" placeholder="Nombre del producto" value={form.nombre} onChange={change} required /></div>
      <div className="col-md-2"><input className="form-control" name="marca" placeholder="Marca" value={form.marca} onChange={change} /></div>
      <div className="col-md-2"><input className="form-control" name="modelo" placeholder="Modelo moto" value={form.modelo} onChange={change} /></div>
      <div className="col-md-1"><input className="form-control" name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={change} required /></div>
      <div className="col-md-1"><input className="form-control" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={change} required /></div>
      <div className="col-md-3"><input className="form-control" name="precio_oferta" type="number" step="0.01" placeholder="Precio oferta" value={form.precio_oferta} onChange={change} /></div>
      <div className="col-md-9"><input className="form-control" name="imagen" placeholder="URL de imagen del producto" value={form.imagen} onChange={change} /></div>
      <div className="col-md-12"><input className="form-control" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={change} /></div>
      <div className="col-md-8 d-flex gap-4 align-items-center">
        <label><input type="checkbox" name="en_oferta" checked={!!Number(form.en_oferta)} onChange={change} /> Oferta</label>
        <label><input type="checkbox" name="es_nuevo" checked={!!Number(form.es_nuevo)} onChange={change} /> Nuevo</label>
        <label><input type="checkbox" name="destacado" checked={!!Number(form.destacado)} onChange={change} /> Destacado</label>
        <label><input type="checkbox" name="agotado" checked={!!Number(form.agotado)} onChange={change} /> Agotado</label>
      </div>
      <div className="col-md-4"><button className="btn btn-dark w-100">{editId ? 'Actualizar' : 'Guardar producto'}</button></div>
    </form>

    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th>Marca</th><th>Precio</th><th>Stock</th><th>Estado tienda</th><th>Acciones</th></tr></thead>
        <tbody>{filtrados.map(p => <tr key={p.id}>
          <td>{p.imagen && <img src={p.imagen} alt={p.nombre} style={{ width: 62, height: 62, objectFit: 'cover', borderRadius: 12 }} />}</td>
          <td><strong>{p.nombre}</strong><br /><small>{p.descripcion}</small></td>
          <td>{p.categoria}</td><td>{p.marca}</td><td>S/ {Number(p.precio).toFixed(2)}</td>
          <td><span className={p.stock <= 5 ? 'badge text-bg-danger' : 'badge text-bg-success'}>{p.stock}</span></td>
          <td>{Number(p.en_oferta) === 1 && <span className="badge text-bg-warning me-1">Oferta</span>}{Number(p.es_nuevo) === 1 && <span className="badge text-bg-dark me-1">Nuevo</span>}{Number(p.destacado) === 1 && <span className="badge text-bg-primary me-1">Destacado</span>}{Number(p.stock) <= 0 && <span className="badge text-bg-danger">Agotado</span>}</td>
          <td><button className="btn btn-sm btn-warning me-2" onClick={() => editar(p)}>Editar</button><button className="btn btn-sm btn-danger" onClick={() => eliminar(p.id)}>Eliminar</button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </>;
}
