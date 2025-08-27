const { MAX_PLAYERS_MAIN_LIST, MAX_PLAYERS_WAITING_LIST } = require('../config/index');

// Estado inicial do jogo
let state = {
    mainList: [],
    waitingList: [],
    isListOpen: false,
};

// Funções para manipular o estado (o "cérebro" do bot)
const GameState = {
    addPlayer: (player) => {
        if (!state.isListOpen) return { success: false, message: 'A lista de presença está fechada no momento.' };
        
        const isInAnyList = [...state.mainList, ...state.waitingList].some(p => p.id === player.id);
        if (isInAnyList) return { success: false, message: `${player.name}, você já está na lista! 👍` };

        if (state.mainList.length < MAX_PLAYERS_MAIN_LIST) {
            state.mainList.push(player);
            return { success: true, list: 'main', message: `Boa, ${player.name}! Você está na lista principal. (${state.mainList.length}/${MAX_PLAYERS_MAIN_LIST})` };
        }
        
        if (state.waitingList.length < MAX_PLAYERS_WAITING_LIST) {
            state.waitingList.push(player);
            return { success: true, list: 'waiting', message: `A lista principal está cheia. ${player.name}, você foi adicionado à lista de espera. (${state.waitingList.length}/${MAX_PLAYERS_WAITING_LIST})` };
        }

        return { success: false, message: 'Desculpe, todas as vagas (principal e de espera) estão preenchidas.' };
    },

    removePlayer: (playerId) => {
        let removedFrom = null;
        let promotedPlayer = null;

        // Tenta remover da lista principal
        const mainIndex = state.mainList.findIndex(p => p.id === playerId);
        if (mainIndex > -1) {
            state.mainList.splice(mainIndex, 1);
            removedFrom = 'main';

            // Promove o primeiro da lista de espera, se houver
            if (state.waitingList.length > 0) {
                promotedPlayer = state.waitingList.shift();
                state.mainList.push(promotedPlayer);
            }
        } else {
            // Tenta remover da lista de espera
            const waitingIndex = state.waitingList.findIndex(p => p.id === playerId);
            if (waitingIndex > -1) {
                state.waitingList.splice(waitingIndex, 1);
                removedFrom = 'waiting';
            }
        }
        
        return { success: !!removedFrom, promotedPlayer };
    },

    confirmPayment: (playerId) => {
        const player = state.mainList.find(p => p.id === playerId) || state.waitingList.find(p => p.id === playerId);
        if (!player) return { success: false, message: "Você precisa estar na lista para confirmar o pagamento." };
        
        player.paid = true;
        return { success: true, message: `Pagamento confirmado, ${player.name}! Obrigado.` };
    },

    getState: () => ({ ...state }),

    clearLists: () => {
        state.mainList = [];
        state.waitingList = [];
        console.log('Listas de presença e espera foram limpas.');
    },

    openList: () => { state.isListOpen = true; console.log('Lista de presença ABERTA.'); },
    closeList: () => { state.isListOpen = false; console.log('Lista de presença FECHADA.'); },
};

module.exports = GameState;