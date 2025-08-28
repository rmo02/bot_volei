require('dotenv').config();

module.exports = {
    // ID do grupo, carregado do arquivo .env
    // Descubra o ID enviando "!idgrupo" no grupo com o bot rodando.
    GROUP_ID: process.env.GROUP_ID,

    ADMIN_NUMBERS: ['559884324158'],

    // Limites de jogadores, carregados do arquivo .env
    MAX_PLAYERS_MAIN_LIST: parseInt(process.env.MAX_PLAYERS_MAIN_LIST, 10) || 24,
    MAX_PLAYERS_WAITING_LIST: parseInt(process.env.MAX_PLAYERS_WAITING_LIST, 10) || 5,

    // Horários para as tarefas automáticas (Cron Syntax), carregados do arquivo .env
    // '0 12 * * 4' = Toda quinta-feira, ao meio-dia (12:00)
    OPEN_LIST_SCHEDULE: process.env.OPEN_LIST_SCHEDULE || '0 12 * * 4',
    // '0 19 * * 2' = Toda terça-feira, às 19:00
    CLOSE_LIST_SCHEDULE: process.env.CLOSE_LIST_SCHEDULE || '0 19 * * 2',

    // Chave PIX para doações, carregada do arquivo .env
    PIX_KEY: process.env.PIX_KEY
};