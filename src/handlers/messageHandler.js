const GameState = require('../state/gameState');
const { MAX_PLAYERS_MAIN_LIST } = require('../config/index');
const { handleFunCommands } = require('./funHandler');
const { lulaGaffes } = require('../assets/quotes');

// Função auxiliar para formatar a lista de jogadores
const formatPlayerList = () => {
    const { mainList, waitingList } = GameState.getState();
 
    // Cabeçalho fixo com detalhes do jogo
    let header = `*🏐 Vôlei de Terça 🏐*\n\n`;
    header += `*Horário:* 20h - 22h\n`;
    header += `*Local:* T9 Beach\n`;
    header += `*Endereço:* https://maps.app.goo.gl/UHavGhCaVuWDmGNp7?g_st=aw\n\n`;
    header += `*Valor:* R$ 13,34 por pessoa (para 24 jogadores)\n`;
    header += `*Pix:* \`rmo02segundo@gmail.com\` (copie e cole)\n\n`;
    header += `-----------------------------\n\n`;
 
    if (mainList.length === 0 && waitingList.length === 0) {
        return header + 'A lista de presença está vazia! Ninguém confirmou ainda. 🤔';
    }
 
    let response = header + `*Lista para o Vôlei (${mainList.length}/${MAX_PLAYERS_MAIN_LIST}) 🏐*\n\n`;
    response += "*--- Confirmados ---*\n";
    mainList.forEach((p, i) => {
        response += `${i + 1}. ${p.name} ${p.paid ? '💰' : ''}\n`;
    });
 
    if (waitingList.length > 0) {
        response += "\n*--- Lista de Espera ---*\n";
        waitingList.forEach((p, i) => {
            response += `${i + 1}. ${p.name} ${p.paid ? '💰' : ''}\n`;
        });
    }
    return response;
};

// Função principal que processa todas as mensagens
const handleMessage = async (message, client) => {
    if (message.from === 'status@broadcast') return;

    const chat = await message.getChat();
    if (!chat.isGroup) return; // Ignora mensagens privadas por enquanto; Comenta se quiser que o bot funcione em DMs

    // A função handleFunCommands vai rodar em TODAS as mensagens do grupo.
    const isFunCommandHandled = await handleFunCommands(message);
    if (isFunCommandHandled) {
        // Se a mensagem foi uma interação divertida (ex: "bom dia"), o bot responde e para por aqui.
        return; 
    }

    // Agora, para os comandos sérios, verifica se o bot foi mencionado ou se a msg é do dono
    if (!message.mentionedIds.includes(client.info.wid._serialized) && !message.fromMe) return;

    const sender = await message.getContact();
    const senderId = sender.id.user;
    const senderName = sender.pushname || sender.name;
    
    const botNumber = client.info.wid.user;
    let content = message.body.toLowerCase().replace(`@${botNumber}`, '').trim();

    console.log(`[Comando Recebido] De: ${senderName} | Grupo: ${chat.name} | Mensagem: ${content}`);
    
    // --- Roteamento de Comandos ---
    
    if (content.startsWith('ajuda') || content.startsWith('comandos')) {
        const ajudaMsg = `*Comandos do Bot de Vôlei* 🏐\n\n*!eu vou* - Adiciona seu nome à lista.\n\n*!nao vou* - Remove seu nome da lista.\n\n*!paguei* - Confirma o pagamento da sua cota.\n\n*!lista* - Mostra quem já confirmou.\n\n*!sortear [N]* - Sorteia N times. Ex: *!sortear 2*\n\n*!faz o l* - ???\n\n*!idgrupo* - Mostra o ID deste grupo.`;
        await message.reply(ajudaMsg);
    }
    
    else if (content.startsWith('eu vou') || content.startsWith('vou')) {
        const result = GameState.addPlayer({ id: senderId, name: senderName, paid: false });
        await message.reply(result.message);
    }

    else if (content.startsWith('nao vou') || content.startsWith('não vou')) {
        const result = GameState.removePlayer(senderId);
        if (result.success) {
            let replyMsg = `${senderName}, seu nome foi removido.`;
            // Anuncia o jogador promovido
            if (result.promotedPlayer) {
                replyMsg += `\n\n🎉 *Promoção!* ${result.promotedPlayer.name} saiu da espera e entrou na lista principal!`;
            }
            await client.sendMessage(message.from, replyMsg);
        } else {
            await message.reply(`${senderName}, seu nome não estava em nenhuma lista.`);
        }
    }
    
    else if (content.startsWith('paguei') || content.startsWith('pago')) {
        const result = GameState.confirmPayment(senderId);
        await message.reply(result.message);
    }

    else if (content.startsWith('lista')) {
        await message.reply(formatPlayerList());
    }

    else if (content.startsWith('sortear')) {
        const numTimes = parseInt(content.split(' ')[1]);
        if (isNaN(numTimes) || numTimes < 2) {
            await message.reply('Comando inválido! Use: *!sortear [número]*. Ex: *!sortear 2*');
            return;
        }

        const { mainList } = GameState.getState();
        if (mainList.length < numTimes) {
            await message.reply(`Não há jogadores confirmados suficientes para formar ${numTimes} times!`);
            return;
        }

        let jogadores = [...mainList].sort(() => Math.random() - 0.5);
        const times = Array.from({ length: numTimes }, () => []);
        jogadores.forEach((jogador, i) => times[i % numTimes].push(jogador.name));

        let sorteioMsg = '🔥 *TIMES SORTEADOS!* 🔥\n\n';
        times.forEach((time, i) => {
            sorteioMsg += `*Time ${i + 1}:*\n` + time.map(nome => `- ${nome}`).join('\n') + '\n\n';
        });
        await client.sendMessage(message.from, sorteioMsg);
    }

    // <-- 2. NOVO COMANDO ADICIONADO AQUI -->
    else if (content.startsWith('faz o l')) {
        // Escolhe uma frase aleatória da lista que esta em assets/quotes.js
        const randomIndex = Math.floor(Math.random() * lulaGaffes.length);
        const randomGaffe = lulaGaffes[randomIndex];
        
        const replyMessage = `Opa, lá vem pérola:\n\n*${randomGaffe}*`;
        await message.reply(replyMessage);
    }
    
    else if (content.startsWith('idgrupo')) {
        await message.reply(`O ID deste grupo é: \n${chat.id._serialized}`);
    }
};

module.exports = { handleMessage };