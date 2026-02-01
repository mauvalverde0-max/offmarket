import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';

const generateChatbotResponse = (message, products = [], stores = []) => {
  const msg = message.toLowerCase();
  
  // Búsqueda de productos
  if (msg.includes('buscar') || msg.includes('product') || msg.includes('producto')) {
    const keyword = message.split(/buscar|product|producto/i)[1]?.trim() || 'computadora';
    const matches = products.filter(p => 
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (matches.length > 0) {
      return `Encontré ${matches.length} producto(s) con "${keyword}":\n${matches.slice(0, 3).map(p => `• ${p.name} - $${p.price}`).join('\n')}`;
    }
    return `No encontré productos con "${keyword}". ¿Quieres ver algo específico?`;
  }
  
  // Búsqueda de locales
  if (msg.includes('local') || msg.includes('tienda') || msg.includes('store')) {
    if (stores.length > 0) {
      return `Encontré ${stores.length} locales cercanos:\n${stores.slice(0, 3).map(s => `• ${s.name} (${s.distance.toFixed(1)} km)`).join('\n')}`;
    }
    return 'No hay información de locales cercanos. Habilita tu ubicación para ver locales.';
  }
  
  // Pregunta sobre ofertas/deals
  if (msg.includes('oferta') || msg.includes('descuento') || msg.includes('deal')) {
    return 'Tenemos ofertas especiales en diferentes categorías. ¿Buscas algo específico?';
  }
  
  // Preguntas generales
  if (msg.includes('hola') || msg.includes('hi')) {
    return '¡Hola! Soy tu asistente de compras. Puedo ayudarte a buscar productos, encontrar locales cercanos, y más. ¿Qué necesitas?';
  }
  
  if (msg.includes('ayuda') || msg.includes('help')) {
    return 'Puedo ayudarte con:\n• Buscar productos\n• Encontrar locales cercanos\n• Ver ofertas y descuentos\n• Información sobre productos\n¿Qué deseas hacer?';
  }
  
  // Respuesta por defecto
  return 'Entendí que dijiste "' + message + '". Puedo buscar productos, encontrar locales, o ayudarte con tus compras. ¿Qué necesitas?';
};

export default function ImprovedChatbot({ products = [], stores = [] }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('ask_me'), timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simular respuesta del chatbot
    setTimeout(() => {
      const response = generateChatbotResponse(input, products, stores);
      const assistantMessage = { role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  const quickQuestions = [
    { text: t('looking_for'), icon: '🔍' },
    { text: t('nearby_stores_for'), icon: '📍' },
    { text: t('best_price'), icon: '💰' },
    { text: t('show_me_stores'), icon: '🏪' },
  ];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition"
        title="Chat"
      >
        🤖
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/30 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between rounded-t-lg">
            <h3 className="text-white font-bold flex items-center gap-2">
              🤖 OffMarket Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-slate-700 text-gray-100 border border-blue-500/20'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-blue-500/20">
              <p className="text-xs text-blue-300 mb-2">Preguntas rápidas:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q.text);
                    }}
                    className="text-left text-xs p-2 bg-slate-700 hover:bg-slate-600 rounded border border-blue-500/20 hover:border-blue-500/40 text-blue-300 transition"
                  >
                    {q.icon} {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-blue-500/20 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ask_me')}
              className="flex-1 bg-slate-700 border border-blue-500/20 focus:border-blue-500 rounded px-3 py-2 text-white text-sm outline-none transition"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded font-medium transition"
              disabled={!input.trim()}
            >
              {t('send')}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
