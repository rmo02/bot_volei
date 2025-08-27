const client = require('./services/client');
const { handleMessage } = require('./handlers/messageHandler');
const { initializeScheduler } = require('./scheduler/tasks');

// Conecta o handler de mensagens ao evento do cliente
client.on('message', (message) => handleMessage(message, client));

// Quando o cliente estiver pronto, inicializa as tarefas agendadas
client.on('ready', () => {
    initializeScheduler(client);
});

// Inicia o bot
client.initialize();