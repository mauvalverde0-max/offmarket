# 🧪 Guía de Pruebas - OffMarket

Esta guía te ayudará a probar todas las features implementadas en OffMarket.

## ✅ Checklist de Pruebas Manuales

### 1️⃣ Geolocalización e Inicio

- [ ] Abre http://localhost:3000
- [ ] La página principal muestra el hero section con el logo
- [ ] Verás un banner de promociones rotativo (cambia cada 10s)
- [ ] Los botones "Registrarse" e "Ingresar" están visibles

### 2️⃣ Registro e Autenticación

- [ ] Haz clic en "Registrarse"
- [ ] Completa el formulario (email: test@example.com, contraseña: Test123!)
- [ ] Selecciona rol "Customer" o "Local"
- [ ] Haz clic en "Crear Cuenta"
- [ ] Deberías ser redirigido al dashboard

**Datos de prueba**:
```
Email: test@example.com
Contraseña: Test123!
Rol: customer
```

### 3️⃣ Navegación Principal

- [ ] El header muestra el logo, enlaces, carrito y menú móvil
- [ ] Haz clic en el ícono del carrito 🛒 - debería abrir el panel lateral
- [ ] En móvil, el menú hamburguesa funciona correctamente
- [ ] Los enlaces de navegación funcionan: Alertas, Puntos, IA, Dashboard

### 4️⃣ Geolocalización (Ubicación)

- [ ] En la homepage, verás un componente de mapa
- [ ] Debe pedir permiso de ubicación (acepta)
- [ ] Muestra tu latitud/longitud aproximada
- [ ] El slider de radio funciona (1-50 km)
- [ ] Muestra tiendas cercanas con distancia en km

**Si rechazas geolocalización**:
- ✓ Usa NYC como ubicación por defecto (40.7128, -74.006)

### 5️⃣ Productos y Carrito

- [ ] En homepage ves "Today's Best Deals" (productos destacados)
- [ ] Haz clic en "Agregar" en una tarjeta de producto
- [ ] Se agregó al carrito (badge muestra 1)
- [ ] El carrito lateral se abre automáticamente
- [ ] Puedes aumentar/disminuir cantidad en el sidepanel
- [ ] El subtotal se actualiza correctamente

### 6️⃣ Detalles de Producto

- [ ] Haz clic en el nombre de un producto
- [ ] Se abre la página `/product/[id]`
- [ ] Ves imagen grande (emoji), calificación, especificaciones
- [ ] Puedes cambiar cantidad con botones +/-
- [ ] Botones "Comprar Ahora" y "Agregar al Carrito" funcionan
- [ ] Se muestra "Comparar Precios" con el mismo producto en otras tiendas
- [ ] Hay un formulario "⭐ Calificar Producto"

### 7️⃣ Formulario de Calificación

- [ ] En detalle de producto, haz clic en "Escribir Reseña"
- [ ] Aparece formulario de rating (1-5 estrellas)
- [ ] Puedes escribir un comentario (máx 500 caracteres)
- [ ] Haz clic en "Publicar Reseña"
- [ ] Se muestra mensaje "✓ ¡Gracias por tu reseña!"

### 8️⃣ Checkout (Proceso de Compra)

- [ ] Agrega productos al carrito
- [ ] Abre el carrito y haz clic en "Proceder al Pago 💳"
- [ ] Vas a `/checkout`

**Paso 1 - Revisión**:
- [ ] Ves todos los productos organizados por tienda
- [ ] Muestra subtotales por tienda
- [ ] Total correcto

**Paso 2 - Dirección**:
- [ ] Completa: email, dirección, ciudad, código postal, teléfono
- [ ] Valida que los campos sean obligatorios
- [ ] Botón "Continuar a pago" se activa

**Paso 3 - Pago**:
- [ ] Ves 3 opciones: Tarjeta, PayPal, Transferencia
- [ ] Si seleccionas "Tarjeta", aparecen campos: número, vencimiento, CVC
- [ ] Hay un aviso: "ℹ️ Usa números de prueba (ej: 4242...)"
- [ ] Haz clic en "Completar Compra"

**Paso 4 - Confirmación**:
- [ ] Ves "¡Compra Completada!" con checkmark verde
- [ ] Se genera número de orden único (ORD-TIMESTAMP)
- [ ] Muestra desglose: Subtotal, Puntos ganados, Total
- [ ] Botones: "Ver mis compras" y "Volver al inicio"
- [ ] El carrito se vaciá

### 9️⃣ Puntos de Lealtad

- [ ] Completa una compra (te dará X puntos)
- [ ] Haz clic en "🎁 Puntos" en el header
- [ ] Se abre `/loyalty-points`
- [ ] Ves cantidad de puntos disponibles (grande)
- [ ] Hay 5 opciones de canje:
  - Envío Gratis (100 pts)
  - Descuento 5% (50 pts)
  - Descuento 10% (100 pts)
  - Descuento 15% (150 pts)
  - Envío + 5% desc (150 pts)
- [ ] Haz clic en una recompensa
- [ ] Modal de confirmación aparece
- [ ] Después de canjear, los puntos disminuyen
- [ ] En "Historial" ves registro de ganancia/canje

### 🔟 Panel Local (Dueño de Tienda)

**Paso 1 - Login como Local**:
- [ ] Regístrate con rol "local"
- [ ] O inicia sesión con una cuenta local existente

**Paso 2 - Panel de Control**:
- [ ] Haz clic en "🏪 Mis Productos" en el header
- [ ] Se abre `/local/products/manage`
- [ ] Ves estadísticas: Productos, Ventas, Calificación, Reseñas
- [ ] Hay botones de acción: Gestionar, Análisis, Configuración

**Paso 3 - Agregar Producto**:
- [ ] Haz clic en "Agregar Producto"
- [ ] Se abre formulario con campos:
  - Nombre *
  - Precio Unitario *
  - Precio Mayorista
  - Categoría *
  - Emoji del Producto
  - Descripción
- [ ] Completa el formulario
- [ ] Haz clic en "Guardar"
- [ ] El producto aparece en la lista

**Paso 4 - Gestionar Productos**:
- [ ] En la lista, puedes ver tus productos
- [ ] Hay botón 🗑️ para eliminar
- [ ] El localStorage persiste los datos

**Paso 5 - Dashboard Local**:
- [ ] Haz clic en "🏪 Panel de Control de Tienda"
- [ ] Se abre `/local/dashboard`
- [ ] Ves 4 cards de estadísticas
- [ ] Sección "Últimos Productos" muestra los primeros 6
- [ ] Tips de venta en la parte inferior

### 1️⃣1️⃣ Alertas de Precio

- [ ] En un producto, haz clic en "🔔 Alerta"
- [ ] Prompt pide precio objetivo
- [ ] Ingresa un precio (ej: 1.99)
- [ ] Si tienes token: "✓ Alerta creada exitosamente"
- [ ] Si no tienes token: Te redirige a login

### 1️⃣2️⃣ Dashboard de Usuario

- [ ] Haz clic en "📊 Dashboard" en el header
- [ ] Se abre `/dashboard`
- [ ] Ves estadísticas personales
- [ ] Gráfico "Ahorros Mensuales" muestra comparación
- [ ] Puntos de lealtad disponibles
- [ ] Quick links a otras secciones

### 1️⃣3️⃣ Asistente IA

- [ ] Haz clic en "🤖 IA" en el header
- [ ] Se abre `/assistant`
- [ ] Ves interfaz de chat
- [ ] Escribe un mensaje: "¿Qué productos tienes?"
- [ ] El asistente responde
- [ ] Puedes escribir mensajes adicionales
- [ ] El historial se mantiene durante la sesión

### 1️⃣4️⃣ Promociones

- [ ] El banner superior muestra una promoción
- [ ] Cada 10 segundos cambia a una diferente
- [ ] Muestra: título, descripción, descuento, días restantes
- [ ] Botón X cierra el banner (desaparece)
- [ ] Se puede recargar la página para que vuelva

### 1️⃣5️⃣ Responsive Design

**Mobile (< 768px)**:
- [ ] El header se colapsa en menú hamburguesa
- [ ] El carrito muestra badge con contador
- [ ] ProductCard se ve en 1 columna
- [ ] Checkout es legible y usable
- [ ] Input fields son lo suficientemente grandes

**Tablet (768px - 1024px)**:
- [ ] Layout se adapta a 2 columnas
- [ ] Navegación es visible
- [ ] Elementos están bien espaciados

**Desktop (> 1024px)**:
- [ ] Layout completo con múltiples columnas
- [ ] Todos los elementos visibles
- [ ] Hover effects funcionan

---

## 🔧 Testing en Consola

Puedes usar la consola del navegador (F12) para probar:

```javascript
// Pruebar servicios de carrito
import { addToCart, getCart, getCartTotal } from './utils/cart'
addToCart({ id: 1, name: 'Test', price: 10 }, 2)
getCart()
getCartTotal()

// Prubar puntos
import { addPoints, getUserPoints } from './utils/points'
addPoints('user1', 100)
getUserPoints('user1')

// Prubar geolocalización
import { calculateDistance } from './utils/geolocation'
calculateDistance(40.7128, -74.006, 40.7580, -73.9855) // ~4.8 km
```

---

## 🐛 Problemas Comunes y Soluciones

### "Geolocalización no funciona"
- **Solución**: El navegador pedirá permiso. Click en "Permitir"
- Si rechazas, usará NYC como ubicación por defecto

### "No veo productos en el carrito"
- **Solución**: Agrega un producto primero
- Abre DevTools → Storage → LocalStorage → offmarket_cart

### "Los puntos no se guardan"
- **Solución**: Debes estar autenticado
- Los puntos se guardan en localStorage por userId

### "El checkout muestra error de pago"
- **Solución**: Es simulado, no hay pago real
- Se genera número de orden al "completar"

### "Los estilos ven extraños"
- **Solución**: Limpia caché: Ctrl+Shift+Delete
- O hard refresh: Ctrl+Shift+R

---

## 📊 Datos de Prueba Predefinidos

**Tiendas Mock**:
```
1. Súper Mercado Central (40.7128, -74.006)
2. Tienda Local Express (40.7258, -74.0076)
3. Mercado Mayorista (40.7480, -73.9862)
```

**Productos Mock**:
```
1. Leche Fresca 1L - $2.99 (Tienda 1)
2. Pan Integral - $3.49 (Tienda 1)
3. Huevos Docena - $4.99 (Tienda 2)
4. Tomates Frescos - $1.99 (Tienda 3)
5. Manzanas - $2.49 (Tienda 3)
```

**Promociones Mock**:
```
1. 20% descuento en lácteos
2. Envío gratis en órdenes > $30
3. 2x1 en frutas seleccionadas
```

---

## 🚀 Testing Automático (Futuro)

Se puede agregar tests con:
```bash
npm install --save-dev @testing-library/react jest @testing-library/jest-dom
```

Ejemplos:
```javascript
// pages/__tests__/cart.test.js
import { addToCart, getCart } from '@/utils/cart'

test('agregar producto al carrito', () => {
  const product = { id: 1, name: 'Test', price: 10 }
  addToCart(product, 2)
  const cart = getCart()
  expect(cart).toHaveLength(1)
  expect(cart[0].quantity).toBe(2)
})
```

---

## ✨ Notas de Testing

1. **localStorage**: Se usa para persistencia. Abre DevTools si necesitas limpiar
2. **Datos Mock**: Todos los datos vienen de `utils/mockData.js`
3. **Autenticación**: JWT se guarda en localStorage ('token' y 'user')
4. **Imágenes**: Usa emojis en lugar de URLs reales
5. **API**: Backend en `localhost:5000`, frontend en `localhost:3000`

---

**Última actualización**: ${new Date().toLocaleDateString('es-ES')}
