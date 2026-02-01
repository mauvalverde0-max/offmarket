# 🛒 OffMarket - Nuevas Características

## ✨ Lo que acabamos de agregar:

### 1. 💰 Comparador de Precios en Supermercados Argentinos

- **Supermercados integrados:**
  - 🔴 Changomas
  - 💙 Disco
  - ⭐ Walmart
  - 🔷 Carrefour
  - 📦 Jumbo

- **Características:**
  - Busca cualquier producto
  - Compara precios instantáneamente
  - Muestra cuánto ahorras
  - Identifica el supermercado más barato
  - Descuentos y disponibilidad

**Ubicación:** Página principal, sección "💰 Comparador de Precios"

---

### 2. 🤖 Chatbot Avanzado Potenciado con IA

- **Capacidades:**
  - 🔍 Busca productos en los 5 supermercados
  - 💬 Conversación natural (con ChatGPT)
  - 📊 Comparación automática de precios
  - 🎯 Preguntas rápidas predefinidas
  - 🧠 Entrenamiento automático (aprende de conversaciones)
  - 🌍 Soporte bilingüe (ES/EN)

- **Cómo usar:**
  1. Haz clic en 🤖 (esquina inferior derecha)
  2. Escribe tu pregunta:
     - "Precio de leche" → Te muestra comparativa
     - "¿Dónde compro más barato?" → Recomienda supermercado
     - "Ayuda" → Muestra opciones disponibles

**Ubicación:** Botón flotante 🤖 en la esquina inferior derecha

---

### 3. 🌐 Selector de Idioma Mejorado

- **Ubicación:** Header superior (al lado de "Offmarket")
- **Idiomas:**
  - 🇦🇷 Español (ES)
  - 🇺🇸 Inglés (EN)

- **Lo que cambia:**
  - Toda la interfaz se traduce
  - Mensajes del chatbot
  - Nombres de productos
  - Textos de botones

**Nota:** El idioma se guarda en localStorage

---

### 4. 🧠 Sistema de Entrenamiento de IA

- **Cómo funciona:**
  - Cada conversación se guarda localmente
  - El chatbot aprende de patrones comunes
  - Se conecta a ChatGPT si está configurado
  - Respuestas mejoran con el uso

- **Archivos de configuración:**
  - `utils/openaiConfig.js` - Prompts de entrenamiento
  - `utils/supermarketAPI.js` - APIs de supermercados

---

## 🚀 Cómo Habilitar ChatGPT (Opcional pero Recomendado)

### Pasos rápidos:

1. **Obtener API Key:**
   - Ve a https://platform.openai.com
   - Crea una cuenta si no tienes
   - Ve a API keys → Create new secret key
   - Copia la clave (empieza con `sk-`)

2. **Agregar a tu proyecto:**
   - Abre `frontend/.env.local`
   - Agrega: `NEXT_PUBLIC_OPENAI_API_KEY=sk-tu-clave-aqui`
   - Reinicia el servidor: `npm run dev`

3. **Listo!** 
   - El chatbot ahora usará ChatGPT para respuestas inteligentes
   - Si no hay API Key, funciona con respuestas simuladas

---

## 📱 Interfaz Mejorada

### Página Principal (index.js):

```
┌─────────────────────────────────────────────────────┐
│  🛒 Offmarket  [Smart Shopping]   🇦🇷 ES 🇺🇸 EN   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Search Bar] [Retail/Wholesale Toggles]            │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📊 Promociones y Descuentos                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  💰 Comparador de Precios                   │   │
│  │  [Buscar Producto...]  🔍                   │   │
│  │                                             │   │
│  │  Leche:                                     │   │
│  │  🏆 Walmart $240  Disco $255  Changomas $245  │
│  │  💚 Ahorras $15 (6%)                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🛒 Productos Disponibles                   │   │
│  │  [Productos en Grid]                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│                                          🤖  (flotante) │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Estructura de Archivos Nuevos

```
frontend/
├── utils/
│   ├── supermarketAPI.js          ← APIs de supermercados
│   ├── openaiConfig.js            ← Configuración de ChatGPT
│   └── i18n.js                    ← Sistema de idiomas
├── components/
│   ├── AdvancedChatbot.js         ← Chatbot con IA
│   ├── PriceComparison.js         ← Comparador mejorado
│   ├── Header.js                  ← Header con selector de idioma
│   └── ...
├── SETUP_CHATGPT_SUPERMERCADOS.md ← Guía detallada
└── .env.local.example             ← Variables de entorno
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Buscar Precio de Leche
```
Usuario: "¿Cuál es el precio de leche?"

Bot: "📊 Precios para leche:
Walmart: $240 (MÁS BARATO) ✅
Disco: $255
Changomas: $245
Carrefour: $260
Jumbo: $250

💚 Ahorras $20 comprando en Walmart"
```

### Ejemplo 2: Recomendación de Supermercado
```
Usuario: "¿Dónde compro más barato?"

Bot: "Depende del producto, pero generalmente:
- Para almacén: Walmart suele ser más barato
- Para frescos: Disco tiene buena variedad
- Ofertas puntuales: Changomas
¿Qué producto buscas?"
```

### Ejemplo 3: Entrenar el Chatbot
```
Usuario 1: "Ayuda"
Bot: "Puedo ayudarte a:
- 🔍 Buscar productos
- 💰 Comparar precios
- 📍 Encontrar tiendas
- 🛒 Asesoramiento de compras"

(El bot aprende que cuando alguien dice "Ayuda" 
debe mostrar opciones disponibles)
```

---

## 🔐 Variables de Entorno

**Crear archivo `frontend/.env.local`:**

```bash
# OpenAI API (opcional pero recomendado)
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Idioma por defecto
NEXT_PUBLIC_DEFAULT_LANGUAGE=es
```

---

## 📊 Próximas Mejoras

- [ ] Conectar APIs reales de supermercados
- [ ] Historial de precios (gráficos de tendencias)
- [ ] Alertas cuando baja el precio
- [ ] Notificaciones push
- [ ] Integración con carteras digitales
- [ ] Sistema de reseñas de usuarios
- [ ] Reportes de gastos inteligentes
- [ ] Recomendaciones personalizadas basadas en IA

---

## 🆘 Troubleshooting

### P: El chatbot no responde inteligentemente
**R:** Necesitas agregar tu API Key de ChatGPT. Ver sección "Cómo Habilitar ChatGPT"

### P: El idioma no cambia
**R:** Borra localStorage: DevTools → Application → Clear localStorage → Recarga

### P: Los precios son todos iguales
**R:** Es normal, son simulaciones. Conecta APIs reales editando `supermarketAPI.js`

### P: ¿Hay costo?
**R:** ChatGPT tiene un costo muy bajo ($0.001-0.01 por consulta). Los precios simulados son gratis.

---

## 📞 Soporte

Para más información o reportar bugs:
- Revisa [SETUP_CHATGPT_SUPERMERCADOS.md](./SETUP_CHATGPT_SUPERMERCADOS.md)
- Abre un issue en GitHub
- Contacta con el equipo de desarrollo

---

¡Gracias por usar OffMarket! 🎉
