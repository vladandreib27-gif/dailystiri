module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { prompt, width = 540, height = 960, seed } = req.query;

    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed || Math.floor(Math.random()*99999)}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Image fetch failed' });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(Buffer.from(buffer));

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
