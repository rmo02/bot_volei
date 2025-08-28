const client = require('./services/client');
const { handleMessage } = require('./handlers/messageHandler');
const { initializeScheduler } = require('./scheduler/tasks');

console.log("🏐 Iniciando o serviço do WhatsApp...");

// 🔹 Conecta o handler de mensagens ao evento do cliente
client.on('message', (message) => handleMessage(message, client));

// 🔹 Quando o cliente estiver pronto
client.on('ready', () => {
    console.log("✅ Bot conectado ao WhatsApp!");
    
    // Inicializa as tarefas agendadas (e já abre a lista na inicialização)
    initializeScheduler(client);
});

// 🔹 Inicia o bot
client.initialize();
