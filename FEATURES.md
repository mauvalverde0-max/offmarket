# 🛒 OffMarket - Plataforma de Comparación de Precios Inteligente

**OffMarket** es una aplicación web moderna de e-commerce que utiliza geolocalización en tiempo real, IA y puntos de lealtad para ayudar a los usuarios a encontrar los mejores precios en productos locales.

## ✨ Características Principales Implementadas

### 🗺️ 1. Geolocalización Interactiva
- **Ubicación en tiempo real**: Obtén acceso a tu ubicación exacta (con permiso)
- **Mapa interactivo**: Visualiza tiendas cercanas en un radio personalizable (1-50 km)
- **Filtrado automático**: Los productos se filtran según la distancia
- **Información de tiendas**: Calificaciones, dirección, tipo de negocio

**Archivos**: `utils/geolocation.js`, `components/MapComponent.js`

---

### 🛒 2. Carrito de Compras Integrado
- **Carrito persistente**: Tus productos se guardan en localStorage
- **Carrito por tienda**: Organización automática de items por proveedor
- **Sidepanel flotante**: Acceso rápido al carrito desde cualquier página
- **Gestión de cantidad**: Aumenta/disminuye productos fácilmente
- **Contador en tiempo real**: Badge con número de items

**Archivos**: `utils/cart.js`, `components/CartSidebar.js`, `pages/_app.js`

---

### 💳 3. Flujo de Checkout Multi-Paso
- **Paso 1**: Revisión del carrito por tienda
- **Paso 2**: Dirección de entrega, correo y teléfono
- **Paso 3**: Selección de método de pago (Tarjeta, PayPal, Transferencia)
- **Paso 4**: Confirmación con número de orden único
- **Ganancia de puntos**: Automáticamente al completar compra

**Archivos**: `pages/checkout.js`

---

### 🎁 4. Sistema de Puntos de Lealtad
- **Acumulación**: 1 punto por cada $1 gastado
- **Historial**: Registro completo de puntos ganados/canjeados
- **Recompensas**: 5 opciones de canje (envío gratis, descuentos 5-15%, combos)
- **Panel de puntos**: Visualización clara de saldo y oportunidades
- **Datos persistentes**: Se guardan en localStorage por usuario

**Archivos**: `utils/points.js`, `components/PointsRedeemer.js`, `pages/loyalty-points.js`

---

### 🏷️ 5. Promociones Geolaterales
- **Banner automático**: Rotación de promociones cada 10 segundos
- **Información clara**: Descuentos, tipos de oferta, días restantes
- **Filtrado por ubicación**: Muestra promos relevantes a tu zona
- **Integración visual**: Banner flotante en la parte superior

**Archivos**: `components/PromotionBanner.js`, `utils/mockData.js`

---

### ⭐ 6. Calificaciones y Reseñas de Productos
- **Formulario de rating**: Sistema de estrellas (1-5) con comentarios
- **Límite de caracteres**: 500 caracteres máximo por reseña
- **Validación**: Requiere al menos una estrella
- **Historial**: Las reseñas se guardan y muestran en el producto

**Archivos**: `components/ProductRating.js`, `pages/product/[id].js`

---

### 💰 7. Comparador de Precios
- **Vista lateral**: Comparación del mismo producto en diferentes tiendas
- **Ranking**: Muestra el mejor precio destacado
- **Cálculo de ahorros**: Diferencia entre precio máximo y mínimo
- **Información de distancia**: Muestra km desde tu ubicación

**Archivos**: `components/PriceComparison.js`

---

### 🏪 8. Panel de Control para Dueños de Tiendas (Locales)
- **Gestión de productos**: Agregar, editar, eliminar items
- **Estadísticas**: Ventas totales, calificación promedio, reseñas
- **Dashboard intuitivo**: Acceso rápido a herramientas importantes
- **Botones de acción**: Enlaces directos a gestión de productos
- **Datos simulados**: Métricas demográficas para pruebas

**Archivos**: `pages/local/dashboard.js`, `pages/local/products/manage.js`

---

### 📋 9. Detalle Completo de Productos
- **Galería de imágenes**: Múltiples vistas del producto (simuladas)
- **Información de tienda**: Vendedor, rating, reseñas
- **Selector de cantidad**: Interfaz intuitiva
- **Cálculo de subtotal**: En tiempo real
- **Opciones de compra**: Comprar ahora o agregar al carrito
- **Información adicional**: Especificaciones, envío, retornos
- **Puntos de lealtad**: Muestra cuántos puntos se ganan

**Archivos**: `pages/product/[id].js`, `components/PriceComparison.js`

---

### 📊 10. Dashboard de Ahorros Mejorado
- **Gráficos comparativos**: Uso con/sin app (datos mensuales)
- **Estadísticas personalizadas**: Puntos, alertas activas, últimas compras
- **Panel de control**: Acceso a todas las secciones principales
- **Ahorro total calculado**: Suma de diferencias mensuales

**Archivos**: `pages/dashboard.js`, `components/DashboardSavings.js`

---

### 🤖 11. Asistente IA Mejorado
- **Interfaz de chat**: Conversación fluida con el asistente
- **Acciones inteligentes**: Agregar al carrito, crear alertas, recordatorios
- **Historial de mensajes**: Se guarda durante la sesión
- **Auto-scroll**: Siempre ves el último mensaje

**Archivos**: `pages/assistant.js`, `backend/src/lib/ai-assistant.js`

---

### 🔐 12. Autenticación y Roles
- **Login/Register**: Autenticación con JWT
- **Roles diferenciados**: `customer` (comprador) y `local` (dueño tienda)
- **Token persistente**: Se guarda en localStorage
- **Protección de rutas**: Solo usuarios autenticados pueden comprar

**Archivos**: `pages/login.js`, `pages/register.js`, `pages/_app.js`

---

## 📁 Estructura del Proyecto

```
offmarket/
├── frontend/
│   ├── components/
│   │   ├── CartSidebar.js           # Carrito lateral
│   │   ├── Header.js                # Navegación mejorada
│   │   ├── MapComponent.js          # Mapa de tiendas
│   │   ├── PointsRedeemer.js        # Canje de puntos
│   │   ├── PromotionBanner.js       # Banner de promociones
│   │   ├── ProductCard.js           # Card de producto
│   │   ├── ProductRating.js         # Formulario de rating
│   │   ├── PriceComparison.js       # Comparador de precios
│   │   ├── NotificationContainer.js # Sistema de notificaciones
│   │   └── DashboardSavings.js      # Gráficos de ahorro
│   ├── pages/
│   │   ├── index.js                 # Homepage
│   │   ├── checkout.js              # Flujo de compra
│   │   ├── loyalty-points.js        # Panel de puntos
│   │   ├── product/[id].js          # Detalle de producto
│   │   ├── local/dashboard.js       # Dashboard de tienda
│   │   ├── local/products/manage.js # Gestión de productos
│   │   ├── dashboard.js             # Dashboard de usuario
│   │   ├── assistant.js             # Chat de IA
│   │   ├── alerts.js                # Alertas de precio
│   │   ├── login.js                 # Autenticación
│   │   └── register.js              # Registro
│   ├── utils/
│   │   ├── cart.js                  # Lógica del carrito
│   │   ├── geolocation.js           # Servicios de ubicación
│   │   ├── points.js                # Sistema de puntos
│   │   ├── mockData.js              # Datos de prueba
│   │   ├── fetcher.js               # Cliente HTTP
│   │   └── ...
│   └── styles/
│       └── globals.css              # Estilos globales
├── backend/
│   ├── src/
│   │   ├── routes/                  # Endpoints API
│   │   ├── middleware/              # Autenticación, validación
│   │   ├── lib/                     # Lógica de negocio (IA, email)
│   │   └── db/                      # Esquema de base datos
│   ├── index.js                     # Servidor Express
│   ├── init-db.js                   # Inicialización BD
│   └── package.json
└── README.md
```

---

## 🚀 Cómo Ejecutar Localmente

### Prerequisitos
- Node.js 16+
- npm o yarn

### Frontend (Desarrollo)

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### Backend (Desarrollo)

```bash
cd backend
npm install
npm run dev
```

El backend estará en http://localhost:5000

---

## 📊 Funcionalidades Técnicas

### Servicios Implementados

**`geolocation.js`**:
- `getLocationPermission()`: Obtiene coordenadas actuales
- `watchLocation()`: Monitoreo en tiempo real
- `calculateDistance()`: Cálculo de distancia (fórmula Haversine)
- `filterNearbyStores()`: Filtrado por radio

**`cart.js`**:
- `addToCart()`: Agregar producto
- `removeFromCart()`: Eliminar item
- `updateCartQuantity()`: Cambiar cantidad
- `getCartByStore()`: Organización por tienda
- `getCartTotal()`: Cálculo de total

**`points.js`**:
- `addPoints()`: Sumar puntos (con historial)
- `redeemPoints()`: Canjear puntos
- `getRewardOptions()`: Opciones de canje disponibles
- `calculatePointsForPurchase()`: Puntos por monto

**`mockData.js`**:
- Tiendas, productos, promociones para demostración
- Fácil extensión para conectar con API real

---

## 🎨 Diseño Visual

- **Tema**: Dark mode premium con gradientes azul/púrpura/cian
- **Responsive**: Optimizado para mobile, tablet y desktop
- **Animaciones**: Transiciones suaves y hover effects
- **Accesibilidad**: Contraste adecuado, navegación por teclado
- **Emojis**: Iconografía intuitiva y amigable

---

## 🔌 Integración con APIs

### Backend (`localhost:5000`)

- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle producto
- `GET /api/stores` - Tiendas cercanas
- `POST /api/alerts` - Crear alerta de precio
- `POST /api/checkout` - Procesar pago
- `GET /api/admin/points/:userId` - Puntos del usuario
- `POST /api/assistant` - Chat IA

---

## 📱 Características por Rol

### Cliente/Comprador
- ✓ Ver productos por geolocalización
- ✓ Crear alertas de precio
- ✓ Agregar al carrito y comprar
- ✓ Calificar productos
- ✓ Acumular puntos de lealtad
- ✓ Ver comparativa de precios
- ✓ Chatear con IA asistente

### Dueño de Tienda
- ✓ Gestionar catálogo de productos
- ✓ Ver estadísticas de ventas
- ✓ Monitorear calificaciones
- ✓ Acceder a dashboard analítico
- ✓ Cargar múltiples productos

---

## 🔐 Seguridad

- ✓ JWT para autenticación
- ✓ Validación de entrada en backend
- ✓ CORS configurado
- ✓ Tokens con expiración
- ✓ Endpoints protegidos por rol

---

## 📈 Próximas Mejoras Sugeridas

1. **Integración real de pagos**: Conectar Stripe/PayPal
2. **Notificaciones push**: Alertas de precios en tiempo real
3. **Upload de imágenes**: Cloudinary para fotos de productos
4. **Deployment**: Railway/Render para backend, Vercel para frontend
5. **Base de datos real**: PostgreSQL en producción
6. **Tests automatizados**: Jest + React Testing Library
7. **Analytics**: Google Analytics o Mixpanel
8. **Autenticación social**: Google/GitHub login

---

## 👨‍💻 Tecnologías Utilizadas

**Frontend**:
- Next.js 14.2.35
- React 18.2.0
- Tailwind CSS 3.3.0
- SWR 2.4.0 (data fetching)
- JavaScript puro (sin librerías externas para cart/puntos)

**Backend**:
- Express.js
- SQLite
- Node-cron
- JWT
- OpenAI API (simulada)

**Deployment**:
- Vercel (Frontend)
- Railway/Render (Backend - pendiente)

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Siéntete libre de usar, modificar y distribuir.

---

## 🤝 Contribuciones

¿Quieres mejorar OffMarket? ¡Las PRs son bienvenidas!

---

**Última actualización**: ${new Date().toLocaleDateString('es-ES')}

**Estado**: ✅ Todas las 10 características principales implementadas y funcionando
