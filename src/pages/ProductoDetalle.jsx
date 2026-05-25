import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import Swal from 'sweetalert2';
import '../productoDetalle.css';

const productosFallback = [
  { id: 1, nombre: 'Aceite Lubricante 4T25W-50 1Lt', marca: 'Motul', modelo: 'Universal', precio: 95, precio_oferta: 0, stock: 15, categoria: 'Aceites', descripcion: 'Aceite lubricante para motocicleta de alto rendimiento.', imagen: '/IMAGENES/ACEITE LUBRICANTE 4T25W-50 1LT.jpg' },
  { id: 2, nombre: 'Llanta Michelin Pilot Street', marca: 'Michelin', modelo: 'Street', precio: 165, precio_oferta: 0, stock: 8, categoria: 'Llantas', descripcion: 'Llanta para moto urbana con buen agarre y duración.', imagen: '/IMAGENES/ARO CON LLANTA 5.00-12 (4H).jpg' },
  { id: 3, nombre: 'Pastillas de freno delanteras', marca: 'Bajaj', modelo: 'Universal', precio: 45, precio_oferta: 0, stock: 15, categoria: 'Frenos', descripcion: 'Pastillas resistentes para frenado seguro.', imagen: '/IMAGENES/ZAPATA FRENO ROJA.jpg' },
  { id: 4, nombre: 'Amortiguador negro WX150', marca: 'D’TIEX', modelo: 'WX150', precio: 59.6, precio_oferta: 0, stock: 10, categoria: 'Suspensión', descripcion: 'Amortiguador para motocicleta, presentación caja por unidad.', imagen: '/IMAGENES/BARRA TELESCOPICA CARGUERO.jpg' },
  { id: 5, nombre: 'Casco integral negro', marca: 'LS2', modelo: 'Integral', precio: 229, precio_oferta: 0, stock: 5, categoria: 'Accesorios', descripcion: 'Casco de seguridad para motociclista.', imagen: '/IMAGENES/FARO DELANTERO REDONDO.jpg' },
  { id: 6, nombre: 'Batería Bosch Moto', marca: 'Bosch', modelo: '12V', precio: 120, precio_oferta: 0, stock: 9, categoria: 'Baterías', descripcion: 'Batería sellada para motocicleta.', imagen: '/IMAGENES/BOBINA 12V.jpg' },
  { id: 7, nombre: 'Cadena reforzada 428', marca: 'Honda', modelo: '428', precio: 80, precio_oferta: 0, stock: 12, categoria: 'Cadenas', descripcion: 'Cadena reforzada para transmisión.', imagen: '/IMAGENES/CADENA 428-114L.jpg' },
  { id: 8, nombre: 'Foco LED Moto', marca: 'Osram', modelo: 'LED', precio: 28, precio_oferta: 0, stock: 18, categoria: 'Luces', descripcion: 'Foco LED para motocicleta.', imagen: '/IMAGENES/CAPUCHON DE BUJIA.jpg' }
];

function normalizarProducto(producto) {
  const precioFinal = Number(producto.precio_final || producto.precio_oferta || producto.precio || 0);
  return {
    ...producto,
    precio: precioFinal > 0 ? precioFinal : Number(producto.precio || 0),
    precio_final: precioFinal > 0 ? precioFinal : Number(producto.precio || 0),
    imagen: producto.imagen || '/IMAGENES/ACEITE LUBRICANTE 4T25W-50 1LT.jpg'
  };
}

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const volverPrincipal = location.state?.origen === 'principal' || !localStorage.getItem('partgo_usuario');
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [relacionados, setRelacionados] = useState([]);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await apiFetch(`/productos/${id}`);
        setProducto(normalizarProducto(data));
      } catch (error) {
        const fallback = productosFallback.find((p) => String(p.id) === String(id)) || productosFallback[0];
        setProducto(normalizarProducto(fallback));
      }

      try {
        const lista = await apiFetch('/productos');
        setRelacionados(lista.slice(0, 4).map(normalizarProducto));
      } catch (error) {
        setRelacionados(productosFallback.slice(0, 4).map(normalizarProducto));
      }
    }

    cargar();
  }, [id]);

  if (!producto) {
    return <div className="detalle-loading">Cargando producto...</div>;
  }

  const normalizarItemDetalle = (item) => {
    const precio = Number(item.precio_final || item.precio || item.precio_oferta || 0);

    return {
      ...item,
      id: Number(item.id || item.id_producto || item.producto_id),
      nombre: item.nombre || item.producto_nombre || 'Producto',
      precio,
      precio_final: precio,
      img: item.img || item.imagen || '/IMAGENES/ACEITE LUBRICANTE 4T25W-50 1LT.jpg',
      imagen: item.imagen || item.img || '/IMAGENES/ACEITE LUBRICANTE 4T25W-50 1LT.jpg',
      stock: Number(item.stock || 1),
      cantidad: Number(item.cantidad || 1)
    };
  };

  const guardarCarrito = (items) => {
    const carritoNormalizado = items.map(normalizarItemDetalle);
    localStorage.setItem('partgo_carrito', JSON.stringify(carritoNormalizado));
    localStorage.setItem('partgo_abrir_carrito', '1');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('partgo-carrito-actualizado', { detail: carritoNormalizado }));
    return carritoNormalizado;
  };

  const agregarCarrito = () => {
    const actual = JSON.parse(localStorage.getItem('partgo_carrito') || '[]').map(normalizarItemDetalle);
    const productoNormalizado = normalizarItemDetalle({ ...producto, cantidad });
    const existe = actual.find((item) => Number(item.id) === Number(productoNormalizado.id));

    const nuevo = existe
      ? actual.map((item) => Number(item.id) === Number(productoNormalizado.id) ? { ...item, cantidad: Math.min(Number(item.cantidad || 1) + cantidad, Number(item.stock || 999)) } : item)
      : [...actual, productoNormalizado];

    const carritoGuardado = guardarCarrito(nuevo);

    Swal.fire({
      icon: 'success',
      title: 'Producto agregado al carrito',
      text: 'Ahora puedes revisar tu carrito antes de finalizar la compra.',
      confirmButtonText: 'Ver carrito',
      confirmButtonColor: '#facc15'
    }).then(() => {
      navigate('/?carrito=1', { state: { abrirCarrito: true, carrito: carritoGuardado } });
    });
  };

  const comprarAhora = () => {
    guardarCarrito([{ ...producto, cantidad }]);
    const usuario = localStorage.getItem('partgo_usuario');

    if (!usuario) {
      Swal.fire({
        icon: 'question',
        title: '¿Cómo deseas comprar?',
        text: 'Puedes crear cuenta o continuar sin iniciar sesión.',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Crear cuenta / Iniciar sesión',
        denyButtonText: 'Continuar sin iniciar sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#facc15',
        denyButtonColor: '#111827'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        } else if (result.isDenied) {
          navigate('/?checkout=1');
        }
      });
      return;
    }

    navigate('/cliente#checkout');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const precio = Number(producto.precio_final || producto.precio || 0);
  const whatsappMensaje = encodeURIComponent(`Hola, quiero consultar por el producto ${producto.nombre} - cantidad ${cantidad}`);
  const whatsappUrl = `https://wa.me/51922859170?text=${whatsappMensaje}`;

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="detalle-whatsapp-svg">
      <path d="M16.02 3.2C9.08 3.2 3.45 8.83 3.45 15.77c0 2.22.58 4.39 1.69 6.3L3.35 28.8l6.89-1.76a12.53 12.53 0 0 0 5.78 1.43c6.94 0 12.57-5.63 12.57-12.57S22.96 3.2 16.02 3.2Zm0 22.94c-1.86 0-3.68-.5-5.28-1.45l-.38-.22-4.08 1.04 1.09-3.98-.25-.41a10.22 10.22 0 0 1-1.55-5.35c0-5.76 4.69-10.45 10.45-10.45s10.45 4.69 10.45 10.45-4.69 10.37-10.45 10.37Zm5.73-7.82c-.31-.16-1.85-.91-2.14-1.02-.29-.11-.5-.16-.71.16-.21.31-.82 1.02-1.01 1.22-.18.21-.37.24-.68.08-.31-.16-1.32-.49-2.52-1.55-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.35-.25-.61-.52-.53-.71-.54h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.23 3.4 5.41 4.77.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );

  return (
    <div className="detalle-page">
      <header className="detalle-topbar">
        <button onClick={() => navigate(volverPrincipal ? '/' : '/cliente')}>← Atrás</button>
        <strong>PartGo</strong>
      </header>

      <main className="detalle-container">
        <section className="detalle-gallery">
          <div className="detalle-main-image">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>
        </section>

        <section className="detalle-info">
          <span className="detalle-badge">DESTACADO</span>
          <h1>{producto.nombre}</h1>
          <h2>S/ {precio.toFixed(2)}</h2>
          <p className="stock-ok">✓ En stock</p>

          <ul className="detalle-lista">
            <li><strong>Modelo:</strong> {producto.modelo || 'Universal'}</li>
            <li><strong>Presentación:</strong> {producto.presentacion || 'Caja x 05'}</li>
            <li><strong>Marca:</strong> {producto.marca || 'PartGo'}</li>
            <li><strong>Categoría:</strong> {producto.categoria || 'Repuesto'}</li>
            <li><strong>Stock:</strong> {producto.stock}</li>
          </ul>

          <a className="detalle-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
            <span className="detalle-whatsapp-icon"><WhatsAppIcon /></span>
            <span><small>PartGo <b>Online</b></small><strong>Consulta por WhatsApp</strong></span>
          </a>

          <p className="detalle-descripcion">{producto.descripcion || 'Producto de calidad para mantenimiento y reparación de motocicletas.'}</p>

          <h3>Cantidad</h3>
          <div className="detalle-cantidad">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)}>+</button>
          </div>

          <div className="detalle-actions">
            <button className="btn-add" onClick={agregarCarrito}>AÑADIR AL CARRITO</button>
            <button className="btn-buy" onClick={comprarAhora}>COMPRAR YA</button>
          </div>

          <button className="detalle-deseos">♡ Añadir a la lista de deseos</button>

          <div className="detalle-extra">
            <p><strong>ETIQUETAS:</strong> {producto.categoria}, {producto.modelo || 'Universal'}</p>
            <p><strong>SKU:</strong> PG-{String(producto.id).padStart(5, '0')}</p>
          </div>
        </section>
      </main>

      <section className="detalle-relacionados">
        <h2>Productos relacionados</h2>
        <div className="detalle-rel-grid">
          {relacionados.map((item) => (
            <article key={item.id} onClick={() => navigate(`/producto/${item.id}`)}>
              <img src={item.imagen} alt={item.nombre} />
              <h3>{item.nombre}</h3>
              <strong>S/ {Number(item.precio_final || item.precio || 0).toFixed(2)}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
