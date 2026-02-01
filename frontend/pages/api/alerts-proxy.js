/**
 * API proxy - forwards requests to backend
 * Useful for handling CORS and managing authorization
 */

export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = req.headers.authorization || '';

  // Get the route from query params
  const { route = '/api/alerts' } = req.query;

  try {
    const response = await fetch(`${backendUrl}${route}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Backend request failed' });
  }
}
