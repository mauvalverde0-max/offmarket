// Configuración de OpenAI ChatGPT para entrenar la IA

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

// Sistema de prompts de entrenamiento para el chatbot
export const TRAINING_PROMPTS = [
  {
    role: 'system',
    content: `Eres un asistente inteligente para una plataforma de compras en Argentina llamada OffMarket. 
Tu objetivo es:
1. Ayudar usuarios a encontrar productos
2. Comparar precios entre supermercados argentinos (Changomas, Disco, Walmart, Carrefour, Jumbo)
3. Recomendar donde comprar más barato
4. Proporcionar información sobre descuentos y ofertas
5. Dar consejos sobre ahorro y presupuesto
6. Responder preguntas sobre locales cercanos basado en geolocalización
7. Ser amable, profesional y útil en español e inglés

Cuando un usuario busca un producto, intenta:
- Encontrar el mejor precio disponible
- Calcular el ahorro total
- Sugerir alternativas más económicas
- Informar sobre disponibilidad en diferentes locales`
  },
  {
    role: 'user',
    content: 'Busco leche desnatada'
  },
  {
    role: 'assistant',
    content: 'Te ayudaré a buscar leche desnatada al mejor precio. En Argentina actualmente encontramos opciones en: Changomas ($245), Disco ($255), Walmart ($240 - MÁS BARATO), Carrefour ($260), Jumbo ($250). Walmart tiene el mejor precio, ahorras $20 comparado con Carrefour. ¿Te interesa saber ubicaciones cercanas de estos supermercados?'
  },
  {
    role: 'user',
    content: '¿Cuál es el mejor lugar para comprar carne?'
  },
  {
    role: 'assistant',
    content: 'Para carne, los precios varían bastante por corte y calidad. En este momento: Disco ($750-850 x kg), Changomas ($780-900 x kg), Walmart ($820-950 x kg), Carrefour ($790-880 x kg), Jumbo ($800-920 x kg). Disco suele tener buena relación precio-calidad. ¿Qué tipo de corte buscas? Te puedo ayudar con precios más específicos.'
  },
  {
    role: 'user',
    content: 'Quiero hacer un presupuesto para la semana'
  },
  {
    role: 'assistant',
    content: 'Excelente idea. Para un presupuesto semanal eficiente te recomiendo: 1) Hacer una lista detallada, 2) Verificar ofertas en cada supermercado, 3) Comparar precios con OffMarket, 4) Considerar marcas alternativas para ahorrar, 5) Comprar en cantidad si hay descuentos. ¿Cuántas personas son en el hogar? Así puedo ayudarte a estimar mejor.'
  },
  {
    role: 'user',
    content: '¿Hay descuentos en frutas?'
  },
  {
    role: 'assistant',
    content: 'Las frutas típicamente tienen descuentos según la estación. En este período: bananas suelen estar económicas, fresas con descuentos puntuales, naranjas a precio base. Changomas y Disco frecuentemente tienen promociones en frutas. ¿Hay alguna fruta específica que te interese? Puedo verificar disponibilidad y precios.'
  }
];

// Contexto adicional para entrenar el chatbot
export const ADDITIONAL_TRAINING_DATA = {
  argentineProducts: [
    'Yerba mate', 'Tereré', 'Facturas', 'Medialunas', 'Alfajores', 
    'Dulce de leche', 'Asado', 'Choripán', 'Milanesa', 'Empanadas'
  ],
  commonQuestions: [
    '¿Cuál es el supermercado más barato?',
    '¿Dónde compro comida orgánica?',
    '¿Hay descuentos hoy?',
    '¿Qué supermercados hay cerca?',
    '¿Puedo comparar precios?',
    '¿Cómo ahorrar en compras?'
  ],
  serviceAreas: [
    'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán'
  ]
};

// Función para llamar a ChatGPT con contexto
export const generateAIChatResponse = async (userMessage, conversationHistory = []) => {
  if (!OPENAI_API_KEY) {
    // Si no hay API key, retornar respuesta simulada mejorada
    return generateSimulatedResponse(userMessage);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          ...TRAINING_PROMPTS.slice(0, 1), // System prompt
          ...conversationHistory.slice(-4), // Últimos 4 mensajes para contexto
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI Error:', data.error);
      return generateSimulatedResponse(userMessage);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return generateSimulatedResponse(userMessage);
  }
};

// Respuestas simuladas mejoradas cuando no hay ChatGPT disponible
const generateSimulatedResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  const responses = {
    precio: 'Para verificar precios, necesito saber qué producto buscas. Puedo comparar entre Changomas, Disco, Walmart, Carrefour y Jumbo. ¿Qué quieres buscar?',
    supermercado: 'Los principales supermercados en Argentina donde operamos son: Changomas, Disco, Walmart, Carrefour y Jumbo. ¿Cuál prefieres o buscas precios comparados?',
    oferta: 'Las ofertas cambian constantemente. ¿Qué tipo de producto te interesa? Puedo verificar las mejores opciones y descuentos disponibles.',
    ubicación: 'Para recomendarte los locales más cercanos, necesito conocer tu localización. ¿Habilité acceso a tu ubicación? También puedo buscar en una zona específica.',
    default: 'Entiendo que buscas: ' + userMessage + '. Soy un asistente para comparar precios en supermercados. ¿Hay algo específico que quieras comprar o saber?'
  };

  for (let key in responses) {
    if (message.includes(key)) {
      return responses[key];
    }
  }

  return responses.default;
};

// Función para guardar conversación de entrenamiento
export const saveTrainingConversation = async (conversation) => {
  try {
    // En producción, guardaría en base de datos
    // Por ahora, guardamos en localStorage
    const saved = JSON.parse(localStorage.getItem('trainingConversations') || '[]');
    saved.push({
      ...conversation,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('trainingConversations', JSON.stringify(saved.slice(-20))); // Últimas 20
    return true;
  } catch (error) {
    console.error('Error saving training conversation:', error);
    return false;
  }
};

export default {
  TRAINING_PROMPTS,
  ADDITIONAL_TRAINING_DATA,
  generateAIChatResponse,
  saveTrainingConversation
};
