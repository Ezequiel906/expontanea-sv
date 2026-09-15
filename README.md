# EXPONTANEA SV

EXPONTANEA SV es una tienda web de arreglos florales construida como proyecto full stack para portfolio. Incluye experiencia de cliente, carrito, checkout, autenticación, panel administrativo, gestión de productos con imágenes en Cloudinary, pedidos, clientes, recuperación de contraseña y formulario de contacto con Resend.

## Stack

- Frontend: React, TypeScript, Vite, React Router.
- Backend: Node.js, Express, TypeScript.
- Base de datos: MySQL.
- ORM: Prisma.
- Autenticación: JWT, roles `CUSTOMER` y `ADMIN`.
- Imágenes: Cloudinary.
- Correos: Resend.

## Funcionalidades principales

- Catálogo general y filtrado por ocasión.
- Detalle de producto.
- Carrito y checkout sin pagos reales.
- Creación de pedidos.
- Registro, login, logout y recuperación de contraseña.
- Panel admin con dashboard, productos, pedidos y clientes.
- Crear/editar productos subiendo imágenes a Cloudinary.
- Actualización de estado de pedidos.
- Formulario de contacto funcional mediante Resend.

## Requisitos

- Node.js 20 o superior.
- MySQL disponible localmente o administrado.
- Cuenta de Cloudinary.
- Cuenta de Resend.

## Variables de entorno

Frontend: crear `.env` en la raíz si se necesita apuntar a un backend externo.

```env
VITE_API_URL="http://localhost:3000/api"
```

Backend: crear `backend/.env`.

```env
DATABASE_URL="mysql://user:password@localhost:3306/expontanea_sv"
JWT_SECRET="change_me"
PORT="3000"
FRONTEND_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"
RESEND_API_KEY="re_example"
RESEND_FROM_EMAIL="EXPONTANEA SV <onboarding@resend.dev>"
CONTACT_TO_EMAIL="contact@example.com"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

No subas secretos reales al repositorio.

## Instalación

Instalar dependencias del frontend:

```bash
npm install
```

Instalar dependencias del backend:

```bash
cd backend
npm install
```

## Base de datos y Prisma

Desde `backend/`:

```bash
npx prisma migrate deploy
```

Para desarrollo local, también puedes usar:

```bash
npx prisma migrate dev
```

Ejecutar seed:

```bash
npm run seed
```

El seed crea datos iniciales y un usuario administrador de demostración. Cambia cualquier credencial antes de usar un entorno real.

## Ejecutar en desarrollo

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
npm run dev
```

El frontend incluye proxy de desarrollo para `/api`. En producción usa `VITE_API_URL`.

## Build

Backend:

```bash
cd backend
npm run build
npm start
```

Frontend:

```bash
npm run build
```

## Deployment sugerido

- Frontend: Vercel.
- Backend: Render.
- Base de datos: MySQL administrado.
- Imágenes: Cloudinary.
- Correos: Resend.

Configura en Vercel `VITE_API_URL` apuntando al backend de Render. Configura en Render las variables del backend, especialmente `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `CORS_ORIGIN`, `RESEND_API_KEY` y credenciales de Cloudinary.
