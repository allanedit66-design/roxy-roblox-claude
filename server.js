const express = require('express');
const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
    const { message, player } = req.body;
    if (!message) return res.status(400).json({ response: 'Message vide.' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 300,
            system: `Tu es un assistant IA dans un jeu Roblox. Réponds en 2 phrases max, sois sympa et utilise des emojis. Le joueur s'appelle ${player}.`,
            messages: [{ role: 'user', content: message }]
        })
    });

    const data = await response.json();
    res.json({ response: data.content[0].text });
});

app.get('/', (req, res) => res.send('Proxy actif !'));
app.listen(process.env.PORT || 3000);
