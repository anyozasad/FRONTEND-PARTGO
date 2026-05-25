# PartGo - Sistema web de ventas de repuestos

Proyecto frontend en React + Vite para cumplir requerimientos funcionales y no funcionales de un sistema de ventas de repuestos de moto.

## Usuario de prueba

- Correo: `admin@gmail.com`
- Contraseña: `123456`

También existe:

- Correo: `vendedor@gmail.com`
- Contraseña: `123456`

## Cómo ejecutar

```bash
npm install
npm run dev
```

Luego abre la URL que aparece en la terminal, normalmente:

```bash
http://localhost:5173
```

## Módulos funcionales incluidos

- Pantalla pública de inicio estilo tienda para clientes.
- Acceso al login del administrador desde el ícono Admin y el botón LOGIN ADMIN.
- Login y cierre de sesión.
- Rutas protegidas.
- Dashboard con métricas.
- CRUD de productos/repuestos.
- CRUD de categorías.
- CRUD de clientes.
- Registro de ventas con carrito.
- Validación de stock en ventas.
- Historial de ventas.
- CRUD de usuarios.
- CRUD de roles.
- Gestión de datos de empresa.

## Requerimientos no funcionales aplicados

- Seguridad básica con rutas protegidas y sesión local.
- Usabilidad con interfaz clara y responsiva.
- Validaciones en formularios y ventas.
- Mantenibilidad con estructura por carpetas: `components`, `context`, `pages`, `services`.
- Rendimiento adecuado usando React y Vite.
- Disponibilidad para pruebas sin backend mediante datos locales en `localStorage`.

## Modo backend real

Por defecto el proyecto funciona con datos locales para que pueda demostrarse sin servidor.

Para conectarlo a un backend real, crea un archivo `.env` con:

```env
VITE_MOCK_API=false
VITE_API_URL=http://localhost:3000/api/v1
```


## Actualización final

La pantalla pública de tienda ahora tiene:

- Menú funcional: Inicio, Nosotros, Productos, Contacto y Distribuidores.
- Botón LOGIN ADMIN para ingresar al panel administrativo.
- Búsqueda de repuestos por nombre, marca o categoría.
- Filtro por categorías.
- Carrito visual.
- Animaciones en el banner, tarjetas, productos y botones.

Credenciales de prueba:

```txt
admin@partgo.com
123456
```
