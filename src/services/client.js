const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log("🏐 Iniciando o serviço do WhatsApp...");

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: 'session' }), // Salva a sessão em uma pasta
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Configurações para ambientes vide Documentação da lib whatsapp-web.js
    }
});

client.on('qr', (qr) => {
    console.log('QR Code recebido, escaneie com seu celular!');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Cliente conectado e pronto para trabalhar!');
    console.log(`➡️  O bot está operando com o número: ${client.info.wid.user}`);
});

client.on('auth_failure', msg => {
    console.error('ERRO DE AUTENTICAÇÃO:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Cliente foi desconectado:', reason);
});

module.exports = client;