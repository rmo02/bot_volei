const schedule = require('node-schedule');
const { GROUP_ID, 
    OPEN_LIST_SCHEDULE, 
    CLOSE_LIST_SCHEDULE,
    MAX_PLAYERS_MAIN_LIST,
    MAX_PLAYERS_WAITING_LIST } = require('../config/index');
const GameState = require('../state/gameState');

const initializeScheduler = (client) => {
    console.log("Agendando tarefas automáticas...");

    // 🔻 --- Iniciando Lista --- 🔻
    GameState.openList();
    const initMessage = `Bot de Vôlei online e operando! A lista de presença está ABERTA.\n\nUse *@Bot ajuda* para ver os comandos.`;
    client.sendMessage(GROUP_ID, initMessage);


    // 🔹 Tarefa para ABRIR e LIMPAR a lista no horário programado (ex: toda terca)
    schedule.scheduleJob(OPEN_LIST_SCHEDULE, () => {
        console.log("Executando tarefa agendada: Limpando e abrindo a lista para a nova semana.");
        
        GameState.clearLists(); 
        GameState.openList();

        const message = `🏐 *LISTA ABERTA PARA O VÔLEI DE TERÇA!* 🏐\n\n- Limite: ${MAX_PLAYERS_MAIN_LIST} jogadores\n- Espera: ${MAX_PLAYERS_WAITING_LIST} excedentes\n\nPara confirmar, mencione o bot com:\n*@Bot eu vou*`;
        client.sendMessage(GROUP_ID, message);
    });

    // 🔹 Tarefa para FECHAR a lista no horário programado (ex: na terça antes do jogo)
    schedule.scheduleJob(CLOSE_LIST_SCHEDULE, () => {
        console.log("Executando tarefa agendada: Fechando lista.");
        GameState.closeList();
        client.sendMessage(GROUP_ID, "A lista de presença para o vôlei de hoje está oficialmente fechada.");
    });
};

module.exports = { initializeScheduler };