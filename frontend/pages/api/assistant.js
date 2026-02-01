/**
 * AI Assistant proxy - forwards chat requests to backend
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = req.headers.authorization || '';

  if (!token) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  try {
    const response = await fetch(`${backendUrl}/api/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Assistant request failed' });
  }
}
