import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM = "Você é um assistente virtual cujo objectivo é levar o cliente ao estabelecimento físico da nossa loja. Sempre que alguém envia uma mensagem responda com simpatia, sem tentar levar a pessoa diretamente ao Whatsapp ou ao estabelecimento físico, mas faça isso de forma gradual, ajudando e esclarecendo todas as dúvidas do cliente.";

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages,
        system: SYSTEM
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    res.json({ reply: data.reply });

  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
