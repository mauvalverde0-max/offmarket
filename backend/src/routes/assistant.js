/**
 * AI Assistant route - handles chat and AI-suggested actions
 */

const express = require('express');
const authMiddleware = require('../middleware/auth');
const aiAssistant = require('../lib/ai-assistant');

const router = express.Router();

/**
 * POST /api/assistant
 * Send message to AI assistant and get suggested actions
 * Requires authentication
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await aiAssistant.chat(message, req.user.id);
    res.json(response);
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({ error: 'Assistant request failed' });
  }
});

/**
 * POST /api/assistant/execute
 * Execute an AI-suggested action
 * Requires authentication
 */
router.post('/execute', authMiddleware, async (req, res) => {
  try {
    const { action } = req.body;
    
    if (!action || !action.type) {
      return res.status(400).json({ error: 'Valid action object required' });
    }
    
    const result = await aiAssistant.executeAction(action, req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Execute action error:', error);
    res.status(500).json({ error: 'Action execution failed' });
  }
});

module.exports = router;
