/**
 * AI Assistant - wrapper for OpenAI API
 * Returns actionable commands that the frontend can execute
 * Falls back to mock responses if API key not available
 */

const config = require('../config');

const MOCK_RESPONSES = [
  {
    message: 'Found 3 products matching your search',
    actions: [
      { type: 'add_to_cart', productId: 1, quantity: 1 },
    ]
  },
  {
    message: 'I set a reminder to check prices next week',
    actions: [
      { type: 'create_reminder', productId: 2, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

async function chat(userMessage, userId) {
  if (!config.openaiApiKey) {
    // Mock response when API key not available
    const mockResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    return {
      message: mockResponse.message,
      actions: mockResponse.actions,
      isStub: true
    };
  }
  
  try {
    // In production, call OpenAI API here
    // For now, this is a stub that would integrate with OpenAI's chat completion API
    const axios = require('axios');
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Offmarket, a helpful shopping assistant. You help users find products, create price alerts, and track savings.
          
When responding, you must respond with valid JSON containing:
{
  "message": "Your helpful response to the user",
  "actions": [
    // Optional array of actions:
    // { "type": "add_to_cart", "productId": 123, "quantity": 1 }
    // { "type": "create_alert", "productId": 123, "targetPrice": 9.99 }
    // { "type": "create_reminder", "productId": 123, "date": "2024-01-31" }
  ]
}

Be concise and professional.`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    return {
      message: parsed.message,
      actions: parsed.actions || [],
      isStub: false
    };
  } catch (error) {
    console.error('AI Assistant error:', error.message);
    return {
      message: 'I encountered an error processing your request. Please try again.',
      actions: [],
      error: error.message
    };
  }
}

async function executeAction(action, userId) {
  // This would be called by the frontend after getting AI suggestions
  // Maps action type to actual API calls
  
  const db = require('../db');
  
  switch (action.type) {
    case 'add_to_cart':
      // Stub: frontend would handle this
      return { success: true, message: 'Item added to cart' };
      
    case 'create_alert':
      // Create alert in database
      const result = await db.query(
        'INSERT INTO alerts (user_id, product_id, target_price, active) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, action.productId, action.targetPrice, true]
      );
      return { success: true, alert: result[0] };
      
    case 'create_reminder':
      // Stub: frontend stores reminder date
      return { success: true, message: 'Reminder set' };
      
    default:
      return { success: false, message: 'Unknown action type' };
  }
}

module.exports = {
  chat,
  executeAction,
};
