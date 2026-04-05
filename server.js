const express = require('express');
const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
    const { message, player } = req.body;
    if (!message) return res.status(400).json({ response: 'Message vide.' });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`
        },
        body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
                { role: 'system', content: `Tu es un assistant IA dans un jeu Roblox. Réponds en 2 phrases max, sois sympa et utilise des emojis. Le joueur s'appelle ${player}.` },
                { role: 'user', content: message }
            ]
        })
    });

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
});

app.get('/', (req, res) => res.send('Proxy actif !'));
app.listen(process.env.PORT || 3000);
