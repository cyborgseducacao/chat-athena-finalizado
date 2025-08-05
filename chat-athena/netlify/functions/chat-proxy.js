/* ==================================================================
   PEÇA 2: O GUARDIÃO DO SEGREDO (chat-proxy.js)
   ================================================================== */

// ESTA É A URL REAL E SECRETA DO SEU WEBHOOK.
// Ela só existe aqui, no servidor, e nunca será exposta ao público.
const REAL_WEBHOOK_URL = 'https://webhook.iarev.com.br/webhook/2726fac2-5d6e-40d5-b89f-05172210e13e/chat';

// A "função" que a Netlify irá executar no servidor.
exports.handler = async function(event) {
  // Medida de segurança: Apenas permite requisições do tipo POST, que é o que o chat faz.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Recebe os dados (mensagem, metadados) que o chat enviou do navegador.
    const body = event.body;

    // 2. Repassa esses dados para o webhook REAL do n8n, de forma segura.
    const response = await fetch(REAL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body, // Repassa o corpo da requisição original
    });

    // Pega a resposta que o n8n enviou de volta.
    const data = await response.json();

    // 3. Retorna a resposta do n8n de volta para o chat no navegador.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

  } catch (error) {
    // Em caso de erro no processo, registra o erro no log do servidor.
    console.error('Erro na função proxy:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno no servidor' }),
    };
  }
};
