import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', documento: '', telefono: '', direccion: ''
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const registrar = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(form) });
      Swal.fire('Cuenta creada', 'Ahora inicia sesión como cliente.', 'success');
      navigate('/login');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <main className="registro-page">
      <form className="registro-card" onSubmit={registrar}>
        <h2>Crear cuenta cliente</h2>
        <p>Regístrate para comprar repuestos en PartGo.</p>

        <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={change} required />
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={change} required />
        <input name="documento" placeholder="DNI o RUC" value={form.documento} onChange={change} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={change} />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={change} />

        <button>Registrarme</button>
        <Link to="/login">Ya tengo cuenta</Link>
      </form>
    </main>
  );
}
