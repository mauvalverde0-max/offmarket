import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';
import { fetchSupermarketPrices, findCheapest, calculateSavings } from '@/utils/supermarketAPI';
import { generateAIChatResponse, saveTrainingConversation } from '@/utils/openaiConfig';

export default function AdvancedChatbot({ products = [] }) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: language === 'es'
        ? '¡Hola! 👋 Soy tu asistente OffMarket. Puedo ayudarte a buscar productos, comparar precios en supermercados argentinos y encontrar las mejores ofertas.'
        : '👋 Hi! I\'m your OffMarket assistant. I can help you find products, compare prices at Argentine supermarkets, and find the best deals.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    language === 'es' ? 'Precios de leche' : 'Milk prices',
    language === 'es' ? 'Mejor oferta' : 'Best deal',
    language === 'es' ? 'Supermercados' : 'Supermarkets',
    language === 'es' ? 'Ahorrar dinero' : 'Save money'
  ];

  const handleSendMessage = async (message = null) => {
    const userMessage = message || inputValue.trim();
    if (!userMessage) return;

    // Agregar mensaje del usuario
    const newUserMessage = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Guardar conversación para entrenamiento
      saveTrainingConversation({
        userMessage,
        timestamp: new Date().toISOString()
      });

      // Detectar intención del usuario
      let botResponse = '';

      // Búsqueda de precios en supermercados
      if (userMessage.toLowerCase().includes('precio') || 
          userMessage.toLowerCase().includes('costo') ||
          userMessage.toLowerCase().includes('price') ||
          userMessage.toLowerCase().includes('cost')) {
        
        // Extraer nombre de producto
        const productMatch = userMessage.match(/de\s+(\w+)/i) || userMessage.match(/(\w+)\s*(precio|costo)/i);
        if (productMatch) {
          const productName = productMatch[1];
          const prices = await fetchSupermarketPrices(productName);
          const cheapest = findCheapest(prices);
          const savings = calculateSavings(prices);

          botResponse = language === 'es'
            ? `📊 Precios para "${productName}":\n\n`
            : `📊 Prices for "${productName}":\n\n`;

          Object.entries(prices).forEach(([key, price]) => {
            const priceText = language === 'es' ? 'Precio' : 'Price';
            const available = language === 'es' ? 'Disponible' : 'Available';
            const discount = language === 'es' ? 'Descuento' : 'Discount';
            
            botResponse += `${price.name}: $${price.price}`;
            if (price.discount > 0) botResponse += ` (${discount} ${price.discount}%)`;
            botResponse += '\n';
          });

          if (cheapest) {
            const cheaperThan = language === 'es' ? 'Ahorras' : 'You save';
            botResponse += `\n✅ ${language === 'es' ? 'MÁS BARATO' : 'CHEAPEST'}: ${cheapest[1].name} a $${cheapest[1].price}`;
            botResponse += `\n💰 ${cheaperThan}: $${savings.savings} (${savings.percentage}%)`;
          }
        }
      }

      // Si no hay respuesta específica, usar ChatGPT o simulación
      if (!botResponse) {
        botResponse = await generateAIChatResponse(userMessage, messages);
      }

      // Agregar mensaje del bot
      const newBotMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = language === 'es'
        ? 'Lo siento, tuve un error. ¿Puedes intentar de nuevo?'
        : 'Sorry, I encountered an error. Can you try again?';
      
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        text: errorMsg,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 max-h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">🤖 OffMarket Assistant</h3>
            <p className="text-xs text-blue-100 mt-1">
              {language === 'es' ? 'Potenciado con IA' : 'AI Powered'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
                  💭 {language === 'es' ? 'Escribiendo...' : 'Typing...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2">
                {language === 'es' ? 'Preguntas rápidas:' : 'Quick questions:'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'es' ? 'Escribe tu pregunta...' : 'Type your question...'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-3xl rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center text-white"
      >
        {isOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
}
