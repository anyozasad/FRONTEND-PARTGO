import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../services/api';

export default function RecuperarPassword() {
  const [form, setForm] = useState({ email: '', nuevaPassword: '' });
  const [loading, setLoading] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (!form.email) return Swal.fire('Correo obligatorio', 'Ingresa tu correo registrado.', 'warning');

    try {
      setLoading(true);
      const data = await apiFetch('/auth/recuperar-password', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      Swal.fire('Contraseña actualizada', data.password_temporal ? `Tu contraseña temporal es: ${data.password_temporal}` : 'Ya puedes iniciar sesión con tu nueva contraseña.', 'success');
    } catch (error) {
      Swal.fire('No se pudo recuperar', error.message || 'Verifica tu correo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={enviar}>
        <h2>Recuperar contraseña</h2>
        <p className="text-muted">Ingresa tu correo y una nueva contraseña. Si dejas la contraseña vacía, el sistema usará 123456 como temporal.</p>

        <div className="mb-3">
          <label className="form-label">Correo registrado</label>
          <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Nueva contraseña</label>
          <input className="form-control" type="password" value={form.nuevaPassword} onChange={(e) => setForm({ ...form, nuevaPassword: e.target.value })} placeholder="Opcional" />
        </div>

        <button className="btn btn-dark w-100 login-main-btn" disabled={loading}>{loading ? 'Procesando...' : 'Actualizar contraseña'}</button>

        <div className="login-footer-link">
          <Link to="/login">Volver al login</Link>
        </div>
      </form>
    </main>
  );
}
