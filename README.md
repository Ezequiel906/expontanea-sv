# EXPONTANEA SV

**EXPONTANEA SV** es una tienda web de arreglos florales desarrollada como proyecto **Full Stack para portfolio**.

El proyecto incluye una experiencia completa de compra para clientes y un panel administrativo para gestionar productos, pedidos y clientes. También integra servicios externos para almacenamiento de imágenes y envío de correos.

Demo: https://expontanea-sv-one.vercel.app
API: https://expontanea-sv.onrender.com/api/health

---

## Funcionalidades

### Cliente

* Catálogo de productos.
* Filtrado de productos por ocasión.
* Detalle individual de productos.
* Carrito de compras.
* Actualización de cantidades y eliminación de productos.
* Checkout y creación de pedidos.
* Registro e inicio de sesión.
* Cierre de sesión.
* Recuperación y restablecimiento de contraseña.
* Historial de pedidos.
* Cuenta de cliente.
* Formulario de contacto.

> El checkout actualmente simula el proceso de compra y no procesa pagos reales.

### Administración

* Dashboard administrativo.
* Gestión de productos.
* Crear y editar productos.
* Subida de imágenes mediante Cloudinary.
* Gestión de pedidos.
* Consulta del detalle de pedidos.
* Actualización del estado de los pedidos.
* Gestión y consulta de clientes.
* Autenticación mediante roles `CUSTOMER` y `ADMIN`.

### Servicios externos

* **Cloudinary:** almacenamiento y gestión de imágenes de productos.
* **Resend:** envío de correos desde el formulario de contacto.

---

## Stack tecnológico

### Frontend

* React
* TypeScript
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express
* TypeScript
* REST API

### Base de datos

* MySQL
* Prisma ORM

### Autenticación

* JWT
* Roles `CUSTOMER` y `ADMIN`

### Servicios

* Cloudinary
* Resend

### Deployment

* Vercel — Frontend
* Render — Backend
* Aiven — MySQL

---

## Arquitectura

El proyecto utiliza una arquitectura cliente-servidor donde el frontend consume una API REST desarrollada con Express.

```mermaid
flowchart TD
    User[Usuario]

    User --> Vercel[Vercel<br/>React + TypeScript + Vite]

    Vercel --> API[REST API]

    API --> Render[Render<br/>Node.js + Express + TypeScript]

    Render --> Controllers[Controllers]
    Controllers --> Services[Services]
    Services --> Prisma[Prisma ORM]
    Prisma --> MySQL[(Aiven MySQL)]

    Services --> Cloudinary[Cloudinary<br/>Imágenes]
    Services --> Resend[Resend<br/>Correos]
```

### Flujo principal

```text
React
  ↓
REST API
  ↓
Express
  ↓
Controllers
  ↓
Services
  ↓
Prisma
  ↓
MySQL
```

---

## Estructura del proyecto

```text
expontanea-sv/
│
├── src/                       # Frontend
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── backend/                   # Backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   │
│   └── prisma/
│       ├── migrations/
│       └── seed/
│
├── vercel.json
├── package.json
└── README.md
```

---

## Requisitos

* Node.js 20 o superior.
* MySQL local o una instancia administrada.
* Cuenta de Cloudinary.
* Cuenta de Resend.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ezequiel906/expontanea-sv.git
cd expontanea-sv
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

---

## Variables de entorno

### Frontend

Crear un archivo `.env` en la raíz:

```env
VITE_API_URL="http://localhost:3000/api"
```

### Backend

Crear `backend/.env`:

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

**Nunca subas secretos reales al repositorio.**

---

## Base de datos y Prisma

Desde `backend/`:

```bash
npx prisma migrate deploy
```

Para desarrollo local:

```bash
npx prisma migrate dev
```

Ejecutar los datos iniciales:

```bash
npm run seed
```

El seed crea los datos iniciales necesarios para probar la aplicación, incluyendo un usuario administrador de demostración.

**Las credenciales de demostración deben cambiarse antes de utilizar el proyecto en un entorno real.**

---

## Ejecutar en desarrollo

### Backend

Desde `backend/`:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

### Frontend

Desde la raíz del proyecto:

```bash
npm run dev
```

El frontend estará disponible en:

```text
http://localhost:5173
```

Durante el desarrollo, Vite utiliza un proxy para las peticiones `/api`.

---

## Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

Desde la raíz:

```bash
npm run build
```

---

## Deployment

La aplicación está desplegada utilizando diferentes servicios:

| Servicio   | Uso                   |
| ---------- | --------------------- |
| Vercel     | Frontend              |
| Render     | Backend / API         |
| Aiven      | Base de datos MySQL   |
| Cloudinary | Imágenes de productos |
| Resend     | Correos               |

Para producción, el frontend utiliza la variable:

```env
VITE_API_URL="https://expontanea-sv.onrender.com/api"
```

El backend utiliza variables de entorno configuradas directamente en Render.

---

## Roadmap

Algunas mejoras previstas para futuras versiones:

* [ ] Reportes de ventas.
* [ ] Exportación de ventas a Excel.
* [ ] Filtros de ventas por fechas.
* [ ] Estadísticas adicionales para el dashboard.
* [ ] Productos más vendidos.
* [ ] Gestión de inventario y disponibilidad.
* [ ] Historial de cambios de estado de pedidos.
* [ ] Cupones y descuentos.
* [ ] Mejoras de búsqueda y filtros en administración.
* [ ] Mejoras adicionales de UX, responsive y accesibilidad.

---

## Objetivo del proyecto

EXPONTANEA SV fue desarrollado como un proyecto práctico de **desarrollo Full Stack**, con el objetivo de trabajar una aplicación más cercana a un escenario real.

El proyecto permitió integrar:

* Desarrollo de interfaces con React.
* TypeScript en frontend y backend.
* Creación y consumo de APIs REST.
* Autenticación y autorización mediante JWT.
* Persistencia de datos con MySQL.
* Manejo de datos mediante Prisma.
* Integración con servicios externos.
* Gestión de archivos e imágenes.
* Desarrollo de un panel administrativo.
* Deployment de frontend, backend y base de datos.

---

## Licencia

Este proyecto fue desarrollado con fines educativos y de portfolio.
