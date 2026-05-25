import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await login(form.email, form.password);
      const usuario = data.usuario;

      if (Number(usuario.rol_id) === 3) {
        const carritoPendiente = JSON.parse(localStorage.getItem('partgo_carrito') || '[]');
        navigate(carritoPendiente.length ? '/cliente#carrito' : '/cliente');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <button type="button" className="login-back-home" onClick={() => navigate('/')}>← Atrás</button>
      <div className="login-gold-orb" />

      <form className="login-card" onSubmit={handleSubmit}>
        <h2>PartGo</h2>
        <p className="text-muted">Inicia sesión para administrar la tienda</p>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ingrese su correo"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingrese su contraseña"
            required
          />
        </div>

        <button className="btn btn-dark w-100 login-main-btn" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className="login-footer-link">
          <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
          <span>¿Eres cliente nuevo?</span>
          <Link to="/registro">Crear cuenta cliente</Link>
        </div>
      </form>
    </main>
  );
}
