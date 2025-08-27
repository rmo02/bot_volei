const schedule = require('node-schedule');
const { GROUP_ID, OPEN_LIST_SCHEDULE, CLOSE_LIST_SCHEDULE } = require('../config/index');
const GameState = require('../state/gameState');

const initializeScheduler = (client) => {
    console.log("⏰ Agendando tarefas automáticas...");

    // Tarefa para ABRIR a lista
    schedule.scheduleJob(OPEN_LIST_SCHEDULE, () => {
        console.log("Executando tarefa agendada: Abrindo lista de vôlei");
        GameState.clearLists();
        GameState.openList();
        
        const message = `🏐 *LISTA ABERTA PARA O VÔLEI DE TERÇA!* 🏐\n\n- Limite: ${MAX_PLAYERS_MAIN_LIST} jogadores\n- Espera: ${MAX_PLAYERS_WAITING_LIST} excedentes\n\nPara confirmar, mencione o bot com:\n*@Bot eu vou*\n\nPara pagar sua cota, use o PIX da galera e mande:\n*@Bot paguei*`;
        client.sendMessage(GROUP_ID, message);
    });

    // Tarefa para FECHAR a lista
    schedule.scheduleJob(CLOSE_LIST_SCHEDULE, () => {
        console.log("Executando tarefa agendada: Fechando lista.");
        GameState.closeList();
        client.sendMessage(GROUP_ID, "A lista de presença para o vôlei de hoje está oficialmente fechada.");
    });
};

module.exports = { initializeScheduler };