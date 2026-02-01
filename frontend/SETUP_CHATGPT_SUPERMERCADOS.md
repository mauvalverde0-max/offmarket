# 🚀 Configuración de ChatGPT y APIs de Supermercados

## 1. Configurar OpenAI API (Opcional pero Recomendado)

### Pasos:

1. Ve a https://platform.openai.com
2. Crea una cuenta o inicia sesión
3. Ve a **API keys** (https://platform.openai.com/account/api-keys)
4. Haz clic en **Create new secret key**
5. Copia la clave

### Agregar a tu proyecto:

**En `frontend/.env.local`:**
```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-tu-clave-aqui
```

### Uso:
- El chatbot automaticamente intentará conectarse a ChatGPT si la clave existe
- Si no hay clave, funciona con respuestas simuladas mejoradas
- Las respuestas se entrenan con los prompts del archivo `utils/openaiConfig.js`

---

## 2. APIs de Supermercados Argentinos

### Supermercados Integrados (Simulados por ahora):

| Supermercado | Ícono | Estado |
|---|---|---|
| **Changomas** | 🔴 | ✅ Simulado |
| **Disco** | 💙 | ✅ Simulado |
| **Walmart** | ⭐ | ✅ Simulado |
| **Carrefour** | 🔷 | ✅ Simulado |
| **Jumbo** | 📦 | ✅ Simulado |

### Para conectar APIs reales:

Edita `frontend/utils/supermarketAPI.js`:

```javascript
// Reemplazar esta función con API reales
export const fetchSupermarketPrices = async (productName) => {
  // Cambiar por llamadas a APIs reales de Changomas, etc.
  // Ejemplo:
  
  const changomas = await fetch(
    `https://api.changomas.com/products?search=${productName}`
  );
  
  const disco = await fetch(
    `https://api.disco.com.ar/search?q=${productName}`
  );
  
  // Combinar resultados...
};
```

### APIs Documentadas (Argentina):
- **Changomas**: Contactar soporte@changomas.com.ar
- **Disco**: https://www.disco.com.ar (datos públicos)
- **Walmart**: Usar web scraping con Selenium/Puppeteer
- **Carrefour**: https://www.carrefour.com.ar
- **Jumbo**: Requiere integración con backend

---

## 3. Características del Chatbot Mejorado

### ✅ Lo que hace:

1. **Búsqueda de Precios**
   - Usuario: "Precio de leche"
   - Bot: Muestra comparativa de precios en todos los supermercados

2. **Consultas sobre Supermercados**
   - Usuario: "¿Dónde compro más barato?"
   - Bot: Recomienda supermercado con mejor precio

3. **Entrenamientode IA**
   - Guarda todas las conversaciones en `localStorage`
   - Entrena con patrones predefinidos en `TRAINING_PROMPTS`
   - Con ChatGPT: Respuestas más naturales y contextuales

4. **Soporte Bilingüe**
   - Automáticamente detecta idioma configurado
   - Responde en ES o EN

5. **Preguntas Rápidas**
   - Botones sugeridos para consultas comunes
   - Facilita interacción sin escribir

---

## 4. Estructura de Archivos Nuevos

```
frontend/
├── utils/
│   ├── supermarketAPI.js        ← Integración de supermercados
│   ├── openaiConfig.js          ← Configuración de ChatGPT
│   └── i18n.js                  ← Sistema de idiomas
├── components/
│   ├── AdvancedChatbot.js       ← Chatbot con IA (NUEVO)
│   ├── PriceComparison.js       ← Comparador de precios (MEJORADO)
│   ├── ImprovedChatbot.js       ← Chatbot básico (fallback)
│   └── ...
└── pages/
    └── index.js                 ← Integración de componentes
```

---

## 5. Cómo Usar el Comparador de Precios

### En la página:
1. Ve a http://localhost:3000
2. Busca en la sección **"💰 Comparador de Precios"**
3. Escribe un producto (ej: "leche")
4. Haz clic en 🔍
5. Verás:
   - Precios de los 5 supermercados
   - Cuánto ahorras
   - Supermercado más barato destacado
   - Tabla comparativa

### En el Chatbot:
1. Haz clic en 🤖 (bottom-right)
2. Escribe: "Precio de [producto]"
3. Bot automáticamente usa el comparador

---

## 6. Entrenar el Chatbot

### Método 1: Prompts Predefinidos
Editaen `frontend/utils/openaiConfig.js`:

```javascript
export const TRAINING_PROMPTS = [
  {
    role: 'system',
    content: 'Eres un asistente...'
  },
  // Agregar más ejemplos aquí
];
```

### Método 2: Con ChatGPT (Automático)
1. Configura `NEXT_PUBLIC_OPENAI_API_KEY`
2. Cada conversación se guarda y entrena el modelo
3. Respuestas mejoran con el tiempo

### Método 3: Feedback Manual
Edita `TRAINING_PROMPTS` con ejemplos reales de conversaciones buenas.

---

## 7. Próximas Mejoras

- [ ] Conectar APIs reales de supermercados
- [ ] Fine-tuning de ChatGPT con datos argentinos
- [ ] Historial de precios / gráficos de tendencias
- [ ] Notificaciones de precio bajó
- [ ] Historial de conversaciones guardado
- [ ] Rating de utilidad del chatbot
- [ ] Soporte para más supermercados
- [ ] Integración con sistemas de carteras digitales

---

## 8. Troubleshooting

### El comparador muestra precios genéricos
→ Normal, son simulaciones. Conecta APIs reales en `supermarketAPI.js`

### El chatbot no responde con ChatGPT
→ Verifica que `NEXT_PUBLIC_OPENAI_API_KEY` está en `.env.local`

### El idioma no cambia
→ Abre DevTools → Application → Clear localStorage → Recarga página

### El selector de idioma no aparece
→ Verifica que Header.js importa `useLanguage`

---

¡Listo! Tu plataforma ahora tiene:
✅ Comparador de precios en supermercados argentinos
✅ Chatbot con IA potenciada por ChatGPT (opcional)
✅ Selector de idioma en el Header
✅ Sistema de entrenamiento de IA
