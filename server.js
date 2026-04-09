const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM = `És o assistente virtual da Leonardo Sapalo LS, uma loja de reparação e venda de acessórios eletrónicos em Lubango, Angola. O teu nome é "Assistente LS".

Responde sempre em português, de forma simpática, breve e profissional. Podes ajudar com:
- Serviços: reparação de smartphones, troca de ecrãs, diagnóstico gratuito, venda de acessórios (capas, películas, cabos, carregadores, auriculares)
- Localização: Por trás do Magistério Primário, Lubango, Angola
- Contacto: WhatsApp/Telefone +244 948 836 908
- Orçamentos: diagnóstico gratuito e sem compromisso

Não inventes preços. Se não souberes algo, direciona para o WhatsApp.`;

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (data.choices?.[0]?.message?.content) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error('Resposta inesperada do Groq:', JSON.stringify(data));
      res.json({ error: 'Sem resposta do modelo.' });
    }

  } catch (err) {
    console.error('Erro:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor LS a correr na porta ${PORT}`));
