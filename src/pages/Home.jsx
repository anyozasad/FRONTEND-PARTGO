import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import promoBanner from '../assets/promo-banner.png';
import { apiFetch } from '../services/api';
import {
  Search,
  Heart,
  ShoppingCart,
  Home as HomeIcon,
  Package,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  Clock,
  Headphones,
  Menu,
  Building2,
  Star,
  CheckCircle2,
  User,
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard
} from 'lucide-react';

const productosBase = [
  { id: 1, oferta: true, nombre: 'Aceite Lubricante 4T25W-50 1Lt', marca: 'Motul', modelo: 'Universal', precio: 95, stock: 15, categoria: 'Aceites', img: '/IMAGENES/ACEITE LUBRICANTE 4T25W-50 1LT.jpg' },
  { id: 2, oferta: true, nombre: 'Amortiguador Negro WX150', marca: 'D’TIEX', modelo: 'WX150', precio: 59.6, stock: 10, categoria: 'Motor', img: '/IMAGENES/BARRA TELESCOPICA CARGUERO.jpg' },
  { id: 3, oferta: true, nombre: 'Pastillas de Freno', marca: 'Bajaj', modelo: 'Universal', precio: 45, stock: 15, categoria: 'Frenos', img: '/IMAGENES/ZAPATA FRENO ROJA.jpg' },
  { id: 4, oferta: true, nombre: 'Cadena 428-114L', marca: 'Honda', modelo: '428', precio: 80, stock: 12, categoria: 'Cadenas', img: '/IMAGENES/CADENA 428-114L.jpg' },
  { id: 5, nuevo: true, nombre: 'Casco Integral Negro', marca: 'LS2', modelo: 'Integral', precio: 229, stock: 5, categoria: 'Cascos', img: '/IMAGENES/FARO DELANTERO REDONDO.jpg' },
  { id: 6, nuevo: true, nombre: 'Alternador 4P CGL', marca: 'PartGo', modelo: 'CGL', precio: 120, stock: 9, categoria: 'Motor', img: '/IMAGENES/ALTERNADOR 4P CGL.jpg' },
  { id: 7, nuevo: true, nombre: 'Aro con Llanta 5.00-12', marca: 'PartGo', modelo: '5.00-12', precio: 150, stock: 7, categoria: 'Llantas', img: '/IMAGENES/ARO CON LLANTA 5.00-12 (4H).jpg' },
  { id: 8, nuevo: true, nombre: 'Capuchón de Bujía', marca: 'NGK', modelo: 'Universal', precio: 28, stock: 18, categoria: 'Luces', img: '/IMAGENES/CAPUCHON DE BUJIA.jpg' }
];

const categoriasBase = ['Todos', 'Aceites', 'Llantas', 'Cascos', 'Frenos', 'Baterías', 'Luces', 'Cadenas', 'Motor'];

const normalizarProductoTienda = (producto) => {
  const precioOferta = Number(producto.precio_oferta || 0);
  const precioNormal = Number(producto.precio || producto.precio_final || 0);
  const precio = precioOferta > 0 ? precioOferta : precioNormal;
  return {
    ...producto,
    id: Number(producto.id || producto.id_producto || producto.producto_id),
    nombre: producto.nombre || 'Producto',
    marca: producto.marca || 'PartGo',
    modelo: producto.modelo || producto.modelo_moto || 'Universal',
    precio,
    precio_final: precio,
    stock: Number(producto.stock || 0),
    categoria: producto.categoria || 'Repuesto',
    img: producto.img || producto.imagen || '/IMAGENES/ACEITE LUBRICANTE 4T25W-50 1LT.jpg',
    imagen: producto.imagen || producto.img || '/IMAGENES/ACEITE LUBRICANTE 4T25W-50 1LT.jpg',
    oferta: Number(producto.en_oferta || producto.oferta || 0) === 1,
    nuevo: Number(producto.es_nuevo || producto.nuevo || 0) === 1,
    destacado: Number(producto.destacado || 0) === 1
  };
};

const normalizarItemCarrito = (item) => {
  const precio = Number(item.precio_final || item.precio || 0);
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

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [categorias, setCategorias] = useState(categoriasBase);
  const [catalogo, setCatalogo] = useState(productosBase.map(normalizarProductoTienda));
  const [tipoVista, setTipoVista] = useState('inicio');
  const [menuActivo, setMenuActivo] = useState('inicio');
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [opcionesCompraAbierto, setOpcionesCompraAbierto] = useState(false);
  const [deseosAbierto, setDeseosAbierto] = useState(false);
  const [listaDeseos, setListaDeseos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cliente, setCliente] = useState({ nombre: '', apellidos: '', telefono: '', correo: '', departamento: '', provincia: '', distrito: '', direccion: '', referencia: '', documento: '', metodoPago: 'YAPE', comprobante: 'Boleta' });
  const [boletaGenerada, setBoletaGenerada] = useState(null);

  const productos = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return catalogo.filter((p) => {
      const coincideCategoria = categoria === 'Todos' || p.categoria === categoria;
      const coincideBusqueda = !q || `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(q);
      const coincideTipo =
        tipoVista === 'inicio' ? (p.destacado || p.oferta || p.nuevo) :
        tipoVista === 'todos' ||
        (tipoVista === 'ofertas' && p.oferta) ||
        (tipoVista === 'nuevos' && p.nuevo);
      return coincideCategoria && coincideBusqueda && coincideTipo;
    });
  }, [catalogo, busqueda, categoria, tipoVista]);

  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const totalDeseos = listaDeseos.length;
  const subtotal = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const envio = carrito.length ? 10 : 0;
  const total = subtotal + envio;

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const [productosApi, categoriasApi] = await Promise.all([
          apiFetch('/productos').catch(() => []),
          apiFetch('/categorias').catch(() => [])
        ]);

        if (Array.isArray(productosApi) && productosApi.length) {
          setCatalogo(productosApi.map(normalizarProductoTienda));
        }

        if (Array.isArray(categoriasApi) && categoriasApi.length) {
          setCategorias(['Todos', ...categoriasApi.map((c) => c.nombre)]);
        }
      } catch (error) {
        setCatalogo(productosBase.map(normalizarProductoTienda));
        setCategorias(categoriasBase);
      }
    };

    cargarCatalogo();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vieneACarrito = params.get('carrito') === '1' || localStorage.getItem('partgo_abrir_carrito') === '1' || location.state?.abrirCarrito;
    const vieneACheckout = params.get('checkout') === '1' || location.state?.abrirCheckout;

    if (vieneACarrito || vieneACheckout) {
      const carritoState = Array.isArray(location.state?.carrito) ? location.state.carrito : null;
      const guardado = (carritoState || JSON.parse(localStorage.getItem('partgo_carrito') || '[]')).map(normalizarItemCarrito);

      if (guardado.length) {
        setCarrito(guardado);
        guardarItemsCarrito(guardado);
      }
    } else if (!localStorage.getItem('partgo_mantener_carrito')) {
      localStorage.removeItem('partgo_carrito');
      setCarrito([]);
    }

    if (vieneACarrito) {
      setCheckoutAbierto(false);
      setCarritoAbierto(true);
      localStorage.removeItem('partgo_abrir_carrito');
      window.history.replaceState({}, '', '/');
    }

    if (vieneACheckout) {
      setCarritoAbierto(false);
      setCheckoutAbierto(true);
      window.history.replaceState({}, '', '/');
    }
  }, [location.search, location.state]);

  const guardarItemsCarrito = (items) => {
    localStorage.setItem('partgo_carrito', JSON.stringify(items.map(normalizarItemCarrito)));
    window.dispatchEvent(new Event('storage'));
  };

  const irA = (id) => {
    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const destino = document.getElementById(id);
    if (!destino) return;

    const offset = id === 'nosotros' ? 150 : 105;
    const y = destino.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
  };

  const irMenu = (menu, id) => {
    setMenuActivo(menu);
    irA(id);
  };

  const irDetalle = (producto) => navigate(`/producto/${producto.id}`, { state: { origen: 'principal' } });

  const usuarioLogueado = () => !!localStorage.getItem('partgo_usuario');

  const guardarCarritoPrincipal = () => guardarItemsCarrito(carrito);

  const comprarDesdeCarrito = () => {
    if (carrito.length === 0) return;
    guardarCarritoPrincipal();

    if (!usuarioLogueado()) {
      setOpcionesCompraAbierto(true);
      return;
    }

    navigate('/cliente#carrito');
  };

  const irACrearCuenta = () => {
    guardarCarritoPrincipal();
    setOpcionesCompraAbierto(false);
    setCarritoAbierto(false);
    navigate('/login');
  };

  const continuarSinIniciarSesion = () => {
    guardarCarritoPrincipal();
    setOpcionesCompraAbierto(false);
    setCarritoAbierto(false);
    setCheckoutAbierto(true);
  };

  const agregarCarrito = (producto) => {
    setCarrito((actual) => {
      const productoNormalizado = normalizarItemCarrito({ ...producto, cantidad: 1 });
      const existe = actual.find((item) => Number(item.id) === Number(productoNormalizado.id));
      const nuevoCarrito = existe
        ? actual.map((item) => Number(item.id) === Number(productoNormalizado.id) ? { ...item, cantidad: Math.min(item.cantidad + 1, item.stock) } : item)
        : [...actual, productoNormalizado];
      guardarItemsCarrito(nuevoCarrito);
      return nuevoCarrito;
    });
    setMensaje(`${producto.nombre} agregado al carrito`);
    setTimeout(() => setMensaje(''), 1800);
  };

  const cambiarCantidad = (id, tipo) => {
    setCarrito((actual) => actual
      .map((item) => {
        if (item.id !== id) return item;
        const nuevaCantidad = tipo === 'sumar' ? item.cantidad + 1 : item.cantidad - 1;
        return { ...item, cantidad: Math.min(Math.max(nuevaCantidad, 1), item.stock) };
      })
      .filter((item) => item.cantidad > 0));
  };

  const quitarProducto = (id) => setCarrito((actual) => {
    const nuevoCarrito = actual.filter((item) => item.id !== id);
    guardarItemsCarrito(nuevoCarrito);
    return nuevoCarrito;
  });

  const alternarDeseo = (producto) => {
    setListaDeseos((actual) => {
      const existe = actual.some((item) => item.id === producto.id);
      if (existe) {
        setMensaje(`${producto.nombre} quitado de deseos`);
        return actual.filter((item) => item.id !== producto.id);
      }
      setMensaje(`${producto.nombre} agregado a deseos`);
      return [...actual, producto];
    });
    setTimeout(() => setMensaje(''), 1800);
  };

  const quitarDeseo = (id) => setListaDeseos((actual) => actual.filter((item) => item.id !== id));

  const numeroBoleta = () => `B001-${String(Date.now()).slice(-8).padStart(8, '0')}`;

  const abrirBoleta = (venta) => {
    const fechaActual = new Date();
    const fecha = venta.fecha || fechaActual.toLocaleDateString('es-PE');
    const hora = fechaActual.toLocaleTimeString('es-PE');

    const limpiar = (valor) => String(valor ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

    const subtotal = Number(venta.subtotal || 0);
    const envio = Number(venta.envio || 0);
    const total = Number(venta.total || subtotal + envio);
    const opGravada = total / 1.18;
    const igv = total - opGravada;

    const numero = limpiar(venta.numero || numeroBoleta());
    const tipo = limpiar((venta.cliente?.comprobante || 'BOLETA').toUpperCase());
    const clienteNombre = limpiar(`${venta.cliente?.nombre || ''} ${venta.cliente?.apellidos || ''}`.trim() || 'Cliente');
    const documento = limpiar(venta.cliente?.documento || '-');
    const telefono = limpiar(venta.cliente?.telefono || '-');
    const email = limpiar(venta.cliente?.correo || '-');
    const direccion = limpiar(venta.cliente?.direccion || '-');
    const pagoTexto = limpiar(venta.cliente?.metodoPago || '-');

    const filas = (venta.productos || []).map((item) => {
      const precio = Number(item.precio || 0);
      const cantidad = Number(item.cantidad || 1);
      return `
        <tr>
          <td class="producto"><b>${limpiar(item.nombre)}</b><span>Repuesto</span></td>
          <td>${cantidad}</td>
          <td>S/ ${precio.toFixed(2)}</td>
          <td>S/ ${(precio * cantidad).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const qrTexto = encodeURIComponent(`PARTGO|${tipo}|${numero}|${documento}|${total.toFixed(2)}`);
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${qrTexto}`;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${tipo} ${numero} - PartGo</title>
        <style>
          *{box-sizing:border-box}body{margin:0;padding:24px;background:#e5e7eb;font-family:Arial,Helvetica,sans-serif;color:#111827}.boleta{width:430px;margin:0 auto;background:#fff;border-radius:18px;padding:24px;box-shadow:0 18px 55px rgba(15,23,42,.18)}.empresa{text-align:center;border-bottom:2px dashed #cbd5e1;padding-bottom:16px;margin-bottom:16px}.logo{width:66px;height:66px;margin:0 auto 10px;border-radius:18px;background:#facc15;color:#020617;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:24px}.empresa h1{margin:0;font-size:38px;line-height:1;font-weight:900;color:#0f172a}.empresa p{margin:5px 0;color:#64748b;font-size:13px}.ruc{color:#111827!important;font-weight:800}.badge{display:inline-block;margin-top:10px;padding:8px 18px;border-radius:999px;background:#0f172a;color:#fff;font-size:13px;font-weight:900;letter-spacing:.4px}.numero{margin-top:10px;font-size:14px;font-weight:900;color:#0f172a}.datos{display:grid;gap:7px;font-size:13.5px;line-height:1.35;margin:16px 0}.datos div{display:grid;grid-template-columns:92px 1fr;gap:8px}.estado{background:#dcfce7;color:#166534;text-align:center;border-radius:12px;padding:10px;font-weight:900;margin:14px 0;letter-spacing:.3px}table{width:100%;border-collapse:collapse;margin-top:14px;font-size:12.5px}th{text-align:left;color:#0f172a;border-bottom:1px solid #cbd5e1;padding:8px 4px;font-weight:900}td{padding:10px 4px;border-bottom:1px solid #e5e7eb;vertical-align:top}.producto b{display:block;font-size:12.5px;color:#020617}.producto span{display:block;color:#64748b;font-size:11.5px;margin-top:2px}th:nth-child(n+2),td:nth-child(n+2){text-align:right;white-space:nowrap}.totales{margin-top:16px;padding-top:14px;border-top:2px dashed #cbd5e1}.fila{display:flex;justify-content:space-between;margin-bottom:8px;font-size:13.5px}.final{display:flex;justify-content:space-between;align-items:baseline;margin-top:12px;font-size:28px;font-weight:900;color:#0f172a}.qr{text-align:center;margin-top:18px}.qr img{width:112px;height:112px}.qr p{margin:6px 0 0;color:#64748b;font-size:11px}.gracias{text-align:center;margin-top:18px}.gracias h2{margin:0 0 6px;font-size:22px;color:#0f172a}.gracias p{margin:0;color:#64748b;font-size:12px}.legal{margin-top:14px;text-align:center;color:#94a3b8;font-size:10.5px;line-height:1.35}.acciones{display:flex;gap:12px;margin-top:20px}.acciones button{flex:1;border:none;border-radius:12px;padding:13px 14px;cursor:pointer;font-size:15px;font-weight:900}.pdf{background:#facc15;color:#020617}.cerrar{background:#0f172a;color:#fff}@media print{body{background:#fff;padding:0}.boleta{width:80mm;box-shadow:none;border-radius:0;margin:0 auto}.acciones{display:none}}
        </style>
      </head>
      <body>
        <main class="boleta"><section class="empresa"><div class="logo">PG</div><h1>PartGo</h1><p>Repuestos de Moto</p><p class="ruc">RUC: 20601234567</p><span class="badge">${tipo} ELECTRÓNICA</span><div class="numero">${numero}</div></section><section class="datos"><div><strong>Cliente:</strong><span>${clienteNombre}</span></div><div><strong>DNI/RUC:</strong><span>${documento}</span></div><div><strong>Teléfono:</strong><span>${telefono}</span></div><div><strong>Correo:</strong><span>${email}</span></div><div><strong>Dirección:</strong><span>${direccion}</span></div><div><strong>Fecha:</strong><span>${fecha}</span></div><div><strong>Hora:</strong><span>${hora}</span></div><div><strong>Pago:</strong><span>${pagoTexto}</span></div></section><div class="estado">COMPROBANTE EMITIDO</div><table><thead><tr><th>Producto</th><th>Cant.</th><th>P.U.</th><th>Importe</th></tr></thead><tbody>${filas}</tbody></table><section class="totales"><div class="fila"><span>Op. gravada</span><strong>S/ ${opGravada.toFixed(2)}</strong></div><div class="fila"><span>IGV 18%</span><strong>S/ ${igv.toFixed(2)}</strong></div><div class="fila"><span>Envío</span><strong>S/ ${envio.toFixed(2)}</strong></div><div class="final"><span>Total</span><span>S/ ${total.toFixed(2)}</span></div></section><section class="qr"><img src="${qr}" alt="QR comprobante" /><p>Consulta referencial del comprobante electrónico</p></section><section class="gracias"><h2>Gracias por su compra</h2><p>PartGo - Pedido registrado correctamente.</p></section><p class="legal">Representación impresa de la ${tipo} electrónica.<br/>Este comprobante fue generado por el sistema PartGo.</p><section class="acciones"><button class="pdf" onclick="window.print()">Guardar PDF</button><button class="cerrar" onclick="window.close()">Cerrar</button></section></main>
      </body>
      </html>`;

    const ventana = window.open('', '_blank', 'width=540,height=820');
    if (ventana) { ventana.document.open(); ventana.document.write(html); ventana.document.close(); }
  };

  const finalizarCompra = (e) => {
    e.preventDefault();
    if (!cliente.nombre.trim() || !cliente.apellidos.trim() || !cliente.telefono.trim() || !cliente.correo.trim() || !cliente.departamento || !cliente.provincia || !cliente.distrito || !cliente.direccion.trim() || !cliente.documento.trim()) {
      setMensaje('Completa todos los datos obligatorios');
      setTimeout(() => setMensaje(''), 2200);
      return;
    }

    if (carrito.length === 0) {
      setMensaje('Tu carrito está vacío');
      setTimeout(() => setMensaje(''), 2200);
      return;
    }

    const venta = {
      id: Date.now(),
      numero: numeroBoleta(),
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      cliente,
      productos: carrito,
      subtotal,
      envio,
      total
    };

    const ventasGuardadas = JSON.parse(localStorage.getItem('partgo_checkout_ventas') || '[]');
    localStorage.setItem('partgo_checkout_ventas', JSON.stringify([venta, ...ventasGuardadas]));
    localStorage.removeItem('partgo_carrito');

    setBoletaGenerada(venta);
    abrirBoleta(venta);
    setCarrito([]);
    setCarritoAbierto(false);
  };

  if (checkoutAbierto) {
    return (
      <div className="store-guest-checkout-page">
        {mensaje && <div className="store-toast">{mensaje}</div>}
        <main className="store-guest-checkout-wrap">
          <section className="store-billing-box">
            <button type="button" className="store-back-cart" onClick={() => { setCheckoutAbierto(false); setCarritoAbierto(true); }}>← Volver al carrito</button>
            <h1>Detalles de facturación</h1>
            <form className="store-billing-form" onSubmit={finalizarCompra}>
              <div className="two-cols">
                <label>Nombre *<input value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} placeholder="Nombre" /></label>
                <label>Apellidos *<input value={cliente.apellidos} onChange={(e) => setCliente({ ...cliente, apellidos: e.target.value })} placeholder="Apellidos" /></label>
              </div>
              <label>Teléfono *<input value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} placeholder="Teléfono" /></label>
              <label>Dirección de correo electrónico *<input value={cliente.correo} onChange={(e) => setCliente({ ...cliente, correo: e.target.value })} placeholder="correo@gmail.com" /></label>
              <label>País / Región *<b className="store-country">Perú</b></label>
              <label>Departamento *<select value={cliente.departamento} onChange={(e) => setCliente({ ...cliente, departamento: e.target.value })}><option value="">Seleccionar Departamento</option><option>Ucayali</option><option>San Martín</option><option>Huánuco</option><option>Loreto</option><option>Amazonas</option><option>Lima</option></select></label>
              <label>Provincia *<select value={cliente.provincia} onChange={(e) => setCliente({ ...cliente, provincia: e.target.value })}><option value="">Seleccionar Provincia</option><option>Coronel Portillo</option><option>Maynas</option><option>Lima</option><option>Huánuco</option><option>San Martín</option></select></label>
              <label>Distrito *<select value={cliente.distrito} onChange={(e) => setCliente({ ...cliente, distrito: e.target.value })}><option value="">Seleccionar Distrito</option><option>Callería</option><option>Yarinacocha</option><option>Iquitos</option><option>Tarapoto</option><option>Huánuco</option></select></label>
              <label>Dirección de la calle *<input value={cliente.direccion} onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} placeholder="Nombre de la calle y número de la casa" /><input value={cliente.referencia} onChange={(e) => setCliente({ ...cliente, referencia: e.target.value })} placeholder="Apartamento, habitación, etc. (opcional)" /></label>
              <label>DNI o RUC *<input value={cliente.documento} onChange={(e) => setCliente({ ...cliente, documento: e.target.value })} placeholder="DNI o RUC" /></label>
              <button className="store-hidden-submit" type="submit">Realizar pedido</button>
            </form>
          </section>

          <aside className="store-order-box">
            <h2>Tu pedido</h2>
            <div className="order-head"><span>Producto</span><span>Subtotal</span></div>
            {carrito.length === 0 ? <p className="store-empty-cart">Todavía no agregaste productos.</p> : carrito.map((item) => (
              <div className="order-row" key={item.id}><b>{item.nombre} × {item.cantidad}</b><strong>S/ {(item.precio * item.cantidad).toFixed(2)}</strong></div>
            ))}
            <div className="order-line"><span>Subtotal</span><b>S/ {subtotal.toFixed(2)}</b></div>
            <div className="order-line"><span>Envío</span><b>S/ {envio.toFixed(2)}</b></div>
            <div className="order-total"><span>Total</span><b>S/ {total.toFixed(2)}</b></div>
            <label className="radio-line"><input type="radio" checked readOnly /> Depósito y/o Transferencia Bancaria</label>
            <div className="pay-note">Realice su pago directamente en nuestra cuenta bancaria. Su pedido no se enviará hasta que los fondos se hayan liquidado.</div>
            <label className="radio-line"><input type="radio" /> Pago con tarjeta de crédito VISA / Mastercard</label>
            <label className="radio-line"><input type="checkbox" /> Me gustaría recibir correos electrónicos exclusivos con descuentos e información de productos</label>
            <select value={cliente.comprobante} onChange={(e) => setCliente({ ...cliente, comprobante: e.target.value })}><option>Boleta</option><option>Factura</option></select>
            <button className="store-place-order" type="button" onClick={finalizarCompra}>REALIZAR EL PEDIDO</button>
          </aside>
        </main>

        {boletaGenerada && (
          <div className="store-modal-bg">
            <section className="store-success-modal">
              <div className="success-check">✓</div>
              <h2>Compra finalizada</h2>
              <p>Tu pedido fue registrado. Se generó la boleta completa.</p>
              <button type="button" onClick={() => { setBoletaGenerada(null); setCheckoutAbierto(false); }}>OK</button>
            </section>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="store-page">
      {mensaje && <div className="store-toast">{mensaje}</div>}
      <div className="store-top-bar">📍 UCAYALI - SAN MARTÍN - HUÁNUCO - LORETO - AMAZONAS</div>

      <header className="store-header fade-down">
        <button className="store-logo store-clean-button" onClick={() => irA('inicio')}>
          <div className="store-logo-icon">P</div>
          <div><h1>PartGo</h1><span>Repuestos de Moto</span></div>
        </button>

        <div className="store-search-box">
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar repuestos, aceites, llantas..." />
          <button type="button" onClick={() => { setMenuActivo('productos'); setTipoVista('todos'); setCategoria('Todos'); irA('productos'); }}><Search size={22} /></button>
        </div>

        <div className="store-contact-info"><strong>Escríbanos 24/7:</strong><span>977 828 531</span></div>

        <div className="store-icons">
          <Link to="/login" className="store-admin-icon" title="Entrar como administrador"><User size={24} /><small>Admin</small></Link>
          <button type="button" className="store-wish-button" onClick={() => setDeseosAbierto(true)} title="Abrir lista de deseos"><Heart className="store-heart" /><span>{totalDeseos}</span></button>
          <button type="button" className="store-cart store-cart-button" onClick={() => setCarritoAbierto(true)} title="Abrir carrito">
            <ShoppingCart /><span>{totalItems}</span>
          </button>
        </div>
      </header>

      <nav className="store-nav fade-down delay-1">
        <button type="button" onClick={() => { setMenuActivo('inicio'); setTipoVista('inicio'); setCategoria('Todos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={menuActivo === 'inicio' ? 'active' : ''}><HomeIcon size={22}/> INICIO</button>
        <button type="button" onClick={() => { setTipoVista('inicio'); setCategoria('Todos'); irMenu('nosotros', 'nosotros'); }} className={menuActivo === 'nosotros' ? 'active' : ''}><Menu size={22}/> NOSOTROS</button>
        <button type="button" onClick={() => { setCategoria('Todos'); setTipoVista('todos'); irMenu('productos', 'productos'); }} className={menuActivo === 'productos' ? 'active' : ''}><Package size={22}/> PRODUCTOS</button>
        <button type="button" onClick={() => { setCategoria('Todos'); setTipoVista('ofertas'); irMenu('ofertas', 'productos'); }} className={menuActivo === 'ofertas' ? 'active' : ''}>OFERTAS</button>
        <button type="button" onClick={() => { setCategoria('Todos'); setTipoVista('nuevos'); irMenu('nuevos', 'productos'); }} className={menuActivo === 'nuevos' ? 'active' : ''}>NUEVOS</button>
        <button type="button" onClick={() => irMenu('contacto', 'contacto')} className={menuActivo === 'contacto' ? 'active' : ''}><Phone size={22}/> CONTACTO</button>
        <button type="button" onClick={() => irMenu('distribuidores', 'distribuidores')} className={menuActivo === 'distribuidores' ? 'active' : ''}><MapPin size={24}/> DISTRIBUIDORES</button>
      </nav>

      <section className="store-hero" id="inicio">
        <div className="store-hero-content fade-up">
          <p className="store-tag">REPUESTOS Y ACCESORIOS PARA MOTOS</p>
          <h2>Encuentra todo para tu moto en <span>PartGo</span></h2>
          <p>Lubricantes, frenos, llantas, baterías, cadenas y accesorios con calidad garantizada.</p>
          <button type="button" onClick={() => { setCategoria('Todos'); setTipoVista('todos'); irMenu('productos', 'productos'); }} className="store-btn">Ver productos</button>
        </div>
        <div className="store-hero-promo float-animation">
          <img src={promoBanner} alt="Promoción de lubricantes PartGo" />
        </div>
      </section>

      <section className="store-features fade-up delay-1">
        <div className="store-feature"><Truck size={44}/><h3>Envíos Nacionales</h3><p>Envíos a diferentes ciudades del Perú.</p></div>
        <div className="store-feature"><ShieldCheck size={44}/><h3>100% Calidad</h3><p>Productos confiables para tu moto.</p></div>
        <div className="store-feature"><Clock size={44}/><h3>Atención Rápida</h3><p>Respondemos tus consultas al instante.</p></div>
        <div className="store-feature"><Headphones size={44}/><h3>Soporte Técnico</h3><p>Te ayudamos a elegir el repuesto correcto.</p></div>
      </section>

      <section className="store-section" id="nosotros">
        <div className="store-section-text fade-left">
          <p className="store-tag">SOBRE NOSOTROS</p>
          <h2>PartGo, tienda de repuestos para motos</h2>
          <p>Brindamos productos confiables para mantenimiento, reparación y mejora de motocicletas. El cliente puede comprar desde la tienda y el administrador gestiona productos, clientes, ventas y reportes.</p>
          <div className="store-checks"><span><CheckCircle2 /> Atención rápida</span><span><CheckCircle2 /> Stock actualizado</span><span><CheckCircle2 /> Productos garantizados</span></div>
        </div>
        <div className="store-about-card fade-right"><Building2 size={60}/><h3>PartGo</h3><p>Repuestos, lubricantes y accesorios para motos.</p></div>
      </section>

      <section className="store-categories" id="productos">
        <h2>Productos y categorías</h2>
        <div className="store-category-list">{categorias.map((cat) => <button type="button" className={categoria === cat ? 'selected' : ''} key={cat} onClick={() => { setMenuActivo('productos'); setCategoria(cat); setTipoVista('todos'); }}>{cat}</button>)}</div>
      </section>

      <section className="store-products">
        <div className="store-products-title"><h2>{tipoVista === 'ofertas' ? 'Productos en oferta' : tipoVista === 'nuevos' ? 'Productos nuevos' : tipoVista === 'todos' ? 'Todos los productos' : 'Productos destacados'}</h2><span>{(tipoVista === 'inicio' ? productos.slice(0, 8) : productos).length} resultados</span></div>
        <div className="store-product-grid">
          {(tipoVista === 'inicio' ? productos.slice(0, 8) : productos).map((p, index) => (
            <div className="store-product-card pop-card" style={{ animationDelay: `${index * 80}ms` }} key={p.id} onClick={() => irDetalle(p)}>
              <button type="button" className={`store-card-heart ${listaDeseos.some((item) => item.id === p.id) ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); alternarDeseo(p); }} title="Agregar a deseos"><Heart size={19}/></button>
              <div className="store-product-img"><img src={p.img} alt={p.nombre} /></div>
              <span>{p.categoria} | {p.marca}</span>
              <h3>{p.nombre}</h3>
              <div className="store-card-badges">
                {p.oferta && <small className="store-badge-offer">Oferta</small>}
                {p.nuevo && <small className="store-badge-new">Nuevo</small>}
                {p.destacado && <small className="store-badge-featured">Destacado</small>}
                {p.stock <= 0 && <small className="store-badge-soldout">Agotado</small>}
              </div>
              <p>S/ {p.precio.toFixed(2)}</p>
              <button type="button" disabled={p.stock <= 0} onClick={(e) => { e.stopPropagation(); agregarCarrito(p); }}>{p.stock <= 0 ? 'Agotado' : 'Agregar al carrito'}</button>
            </div>
          ))}
        </div>
        {(tipoVista === 'inicio' ? productos.slice(0, 8) : productos).length === 0 && <p className="store-empty">No se encontraron productos con esa búsqueda.</p>}
      </section>

      <section className="store-section store-distributors" id="distribuidores">
        <div className="store-section-text fade-left"><p className="store-tag">DISTRIBUIDORES</p><h2>Atendemos varias regiones del Perú</h2><p>Trabajamos con puntos de distribución para facilitar la entrega de repuestos y accesorios.</p></div>
        <div className="store-city-grid fade-right">{['Ucayali', 'San Martín', 'Huánuco', 'Loreto', 'Amazonas'].map((c) => <div key={c}><MapPin /> {c}</div>)}</div>
      </section>

      <section className="store-contact-page" id="contacto">
        <div className="store-contact-info-box">
          <div className="contact-block">
            <h3><Phone size={20}/> Llámenos:</h3>
            <p>Resolvemos tus consultas y dudas.</p>
            <strong>(061) 784 413 – Pucallpa</strong>
            <strong>(061) 782 113 – Tarapoto</strong>
          </div>

          <div className="contact-block">
            <h3>✉ Escríbenos:</h3>
            <p>Rellena nuestro formulario y nos pondremos en contacto contigo a la brevedad.</p>
            <strong>E-mail: ventas@totalimport.com.pe</strong>
          </div>

          <div className="contact-block">
            <h3><MapPin size={20}/> Nuestros Horarios:</h3>
            <p>Lunes - Viernes: 8:00 am - 06:00 pm<br/>Sábados: 08:00 am - 1:00 pm</p>
          </div>

          <div className="contact-block">
            <h3><MapPin size={20}/> Oficina Principal:</h3>
            <strong>Jr. José Galvez N° 960 – Pucallpa</strong>
          </div>

          <div className="contact-block">
            <h3><MapPin size={20}/> Agencia:</h3>
            <strong>Av. Vía de evitamiento N° 1565 – Tarapoto – San Martín</strong>
          </div>
        </div>

        <form className="store-contact-form">
          <label>Nombre</label>
          <input type="text" />
          <label>E-mail</label>
          <input type="email" />
          <label>Asunto</label>
          <input type="text" />
          <label>Mensaje</label>
          <textarea rows="6"></textarea>
          <button type="button">ENVIAR</button>
        </form>
      </section>

      <footer className="store-footer"><strong>PartGo</strong> — El icono <b>Admin</b> permite ingresar al panel administrativo.</footer>


      {deseosAbierto && (
        <div className="store-modal-bg store-wishlist-page" onClick={() => setDeseosAbierto(false)}>
          <section className="store-wishlist-panel pop-checkout" onClick={(e) => e.stopPropagation()}>
            <div className="store-modal-head"><h2>Mi lista de deseos</h2><button onClick={() => setDeseosAbierto(false)}><X /></button></div>
            <div className="store-wishlist-table">
              <div className="store-wishlist-head"><span>Nombre del producto</span><span>Precio por unidad</span><span>Estado de inventario</span><span>Acción</span></div>
              {listaDeseos.length === 0 ? <p className="store-empty-cart">No se han añadido productos a la lista de deseos</p> : listaDeseos.map((item) => (
                <div className="store-wishlist-row" key={item.id}>
                  <div className="store-wishlist-product"><span><img src={item.img} alt={item.nombre} /></span><b>{item.nombre}</b><small>{item.marca} | {item.categoria}</small></div>
                  <strong>S/ {item.precio.toFixed(2)}</strong>
                  <em className="stock-status">{item.stock <= 0 ? 'Agotado' : '✓ En stock'}</em>
                  <div className="store-wishlist-actions"><button type="button" onClick={() => agregarCarrito(item)}>Agregar al carrito</button><button type="button" className="store-trash" onClick={() => quitarDeseo(item.id)}><Trash2 size={18}/></button></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {carritoAbierto && (
        <div className="store-modal-bg" onClick={() => setCarritoAbierto(false)}>
          <aside className="store-cart-panel slide-cart" onClick={(e) => e.stopPropagation()}>
            <div className="store-modal-head"><h2>Carrito de compras</h2><button onClick={() => setCarritoAbierto(false)}><X /></button></div>
            {carrito.length === 0 ? <p className="store-empty-cart">Tu carrito está vacío.</p> : (
              <>
                <div className="store-cart-list">
                  {carrito.map((item) => (
                    <div className="store-cart-item" key={item.id}>
                      <div className="store-cart-img"><img src={item.img} alt={item.nombre} /></div>
                      <div className="store-cart-info"><strong>{item.nombre}</strong><span>S/ {item.precio.toFixed(2)}</span><small>Stock: {item.stock}</small></div>
                      <div className="store-qty"><button onClick={() => cambiarCantidad(item.id, 'restar')}><Minus size={15}/></button><b>{item.cantidad}</b><button onClick={() => cambiarCantidad(item.id, 'sumar')}><Plus size={15}/></button></div>
                      <button className="store-trash" onClick={() => quitarProducto(item.id)}><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
                <div className="store-summary"><p><span>Subtotal</span><b>S/ {subtotal.toFixed(2)}</b></p><p><span>Envío</span><b>S/ {envio.toFixed(2)}</b></p><h3><span>Total</span><b>S/ {total.toFixed(2)}</b></h3></div>
                <button className="store-checkout-btn" onClick={comprarDesdeCarrito}><CreditCard size={20}/> Finalizar compra</button>
              </>
            )}
          </aside>
        </div>
      )}

      {opcionesCompraAbierto && (
        <div className="store-modal-bg" onClick={() => setOpcionesCompraAbierto(false)}>
          <section className="store-checkout-modal pop-checkout" onClick={(e) => e.stopPropagation()}>
            <div className="store-modal-head">
              <h2>¿Cómo deseas comprar?</h2>
              <button type="button" onClick={() => setOpcionesCompraAbierto(false)}><X /></button>
            </div>
            <p className="store-empty-cart">Puedes crear cuenta para guardar tu compra o continuar como invitado.</p>
            <button className="store-checkout-btn" type="button" onClick={irACrearCuenta}>Crear cuenta / Iniciar sesión</button>
            <button className="store-checkout-btn" type="button" onClick={continuarSinIniciarSesion}>Continuar sin iniciar sesión</button>
          </section>
        </div>
      )}

      {checkoutAbierto && (
        <div className="store-modal-bg" onClick={() => setCheckoutAbierto(false)}>
          <form className="store-checkout-modal pop-checkout" onSubmit={finalizarCompra} onClick={(e) => e.stopPropagation()}>
            <div className="store-modal-head"><h2>Checkout</h2><button type="button" onClick={() => setCheckoutAbierto(false)}><X /></button></div>
            <label>Nombre completo<input value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} placeholder="Ej: Juan Pérez" /></label>
            <label>Teléfono<input value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} placeholder="Ej: 977 828 531" /></label>
            <label>Dirección<input value={cliente.direccion} onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} placeholder="Dirección de entrega" /></label>
            <label>Método de pago<select value={cliente.metodoPago} onChange={(e) => setCliente({ ...cliente, metodoPago: e.target.value })}><option>Efectivo</option><option>Yape / Plin</option><option>Tarjeta</option><option>Transferencia</option></select></label>
            <div className="store-summary checkout"><p><span>Productos</span><b>{totalItems}</b></p><p><span>Subtotal</span><b>S/ {subtotal.toFixed(2)}</b></p><p><span>Envío</span><b>S/ {envio.toFixed(2)}</b></p><h3><span>Total a pagar</span><b>S/ {total.toFixed(2)}</b></h3></div>
            <button className="store-checkout-btn" type="submit">Confirmar compra</button>
          </form>
        </div>
      )}
    </div>
  );
}
