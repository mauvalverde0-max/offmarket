import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiCall } from '@/utils/fetcher';

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function AssistantPage({ token, user }) {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I\'m Offmarket AI. How can I help you find great deals today? You can ask me to search for products, create price alerts, or find nearby stores.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
  }, [token, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        content: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const response = await apiCall('POST', '/api/assistant', { message: userMessage }, token);

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.message,
          actions: response.actions || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
      console.error('Assistant error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!action || !action.type) return;

    try {
      const result = await apiCall('POST', '/api/assistant/execute', { action }, token);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'system',
          content: result.message || 'Action completed successfully',
        },
      ]);
    } catch (error) {
      console.error('Action error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Offmarket AI Assistant</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ask me to search products, create alerts, or find deals
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : msg.role === 'system'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>

                {/* Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAction(action)}
                        className="block w-full text-left px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                      >
                        {action.type === 'add_to_cart' && `Add ${action.productName} to cart`}
                        {action.type === 'create_alert' && `Alert: ${action.productName} @ $${action.targetPrice}`}
                        {action.type === 'create_reminder' && `Remind me on ${new Date(action.date).toLocaleDateString()}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Try: "Search for milk near me" or "Create alert for eggs under $3"
          </p>
        </div>
      </div>
    </main>
  );
}
