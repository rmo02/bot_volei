const fs = require('fs');
const path = require('path');
const { MAX_PLAYERS_MAIN_LIST, MAX_PLAYERS_WAITING_LIST } = require('../config/index');

const STATE_FILE = path.join(__dirname, '../data/gameState.json');

const saveState = (newState) => {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(newState, null, 2));
    } catch (err) {
        console.error('Erro ao salvar o estado:', err);
    }
};

const loadState = () => {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const data = fs.readFileSync(STATE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Erro ao carregar o estado, iniciando com estado padrão:', err);
    }
    return {
        mainList: [],
        waitingList: [],
        isListOpen: false,
    };
};

let state = loadState();

const GameState = {
    addPlayer: (player) => {
        if (!state.isListOpen) return { success: false, message: 'A lista de presença está fechada no momento.' };

        const isInAnyList = [...state.mainList, ...state.waitingList].some(p => p.id === player.id && !player.isGuest);
        if (!player.isGuest && isInAnyList) {
            return { success: false, message: `${player.name}, você já está na lista! 👍` };
        }

        const listName = state.mainList.length < MAX_PLAYERS_MAIN_LIST ? "mainList" : "waitingList";

        if (listName === "mainList") {
            state.mainList.push(player);
        } else if (state.waitingList.length < MAX_PLAYERS_WAITING_LIST) {
            state.waitingList.push(player);
        } else {
            return { success: false, message: 'Desculpe, todas as vagas (principal e de espera) estão preenchidas.' };
        }

        saveState(state);

        if (listName === "mainList") {
            return { success: true, list: 'main', message: `Boa, ${player.name}! Você está na lista principal. (${state.mainList.length}/${MAX_PLAYERS_MAIN_LIST})` };
        }
        return { success: true, list: 'waiting', message: `A lista principal está cheia. ${player.name}, você foi adicionado à lista de espera. (${state.waitingList.length}/${MAX_PLAYERS_WAITING_LIST})` };
    },

    removePlayer: (playerIdOrName) => {
        let removedFrom = null;
        let promotedPlayer = null;
        let playerRemoved = false;

        const mainIndex = state.mainList.findIndex(
            p => p.id === playerIdOrName || p.name.toLowerCase().includes(playerIdOrName.toLowerCase())
        );

        if (mainIndex > -1) {
            state.mainList.splice(mainIndex, 1);
            removedFrom = 'main';
            playerRemoved = true;

            if (state.waitingList.length > 0) {
                promotedPlayer = state.waitingList.shift();
                state.mainList.push(promotedPlayer);
            }
        } else {
            const waitingIndex = state.waitingList.findIndex(
                p => p.id === playerIdOrName || p.name.toLowerCase().includes(playerIdOrName.toLowerCase())
            );

            if (waitingIndex > -1) {
                state.waitingList.splice(waitingIndex, 1);
                removedFrom = 'waiting';
                playerRemoved = true;
            }
        }

        if (playerRemoved) saveState(state);
        return { success: !!removedFrom, promotedPlayer };
    },

    // Jogador marca que pagou
    confirmPayment: (playerIdOrName) => {
        const player = state.mainList.find(
            p => p.id === playerIdOrName || p.name.toLowerCase().includes(playerIdOrName.toLowerCase())
        ) || state.waitingList.find(
            p => p.id === playerIdOrName || p.name.toLowerCase().includes(playerIdOrName.toLowerCase())
        );

        if (!player) {
            return { success: false, message: "Jogador ou convidado não encontrado na lista." };
        }

        player.paymentPending = true;
        player.paid = false;
        saveState(state);

        return { success: true, player, message: `⏳ Pagamento de ${player.name} foi marcado como pendente. Aguardando confirmação do admin.` };
    },

    // Admin confirma de fato
    adminConfirmPayment: (playerIdOrName) => {
        const normalized = playerIdOrName.toLowerCase();

        const player = state.mainList.find(
            p => p.id === normalized || p.name.toLowerCase().includes(normalized)
        ) || state.waitingList.find(
            p => p.id === normalized || p.name.toLowerCase().includes(normalized)
        );

        if (!player) {
            return { success: false, message: `Jogador "${playerIdOrName}" não encontrado na lista.` };
        }

        player.paymentPending = false;
        player.paid = true;
        saveState(state);

        return { success: true, message: `✅ Pagamento de ${player.name} confirmado pelo administrador!` };
    },

    getState: () => ({ ...state }),

    clearLists: () => {
        state.mainList = [];
        state.waitingList = [];
        saveState(state);
        console.log('Listas de presença e espera foram limpas.');
    },

    openList: () => {
        state.isListOpen = true;
        saveState(state);
        console.log('Lista de presença ABERTA.');
    },

    closeList: () => {
        state.isListOpen = false;
        saveState(state);
        console.log('Lista de presença FECHADA.');
    },
};

module.exports = GameState;
