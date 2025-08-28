const GameState = require("../state/gameState");
const { MAX_PLAYERS_MAIN_LIST, ADMIN_NUMBERS } = require("../config/index");
const { handleFunCommands } = require("./funHandler");

// 🔄 ALTERADO: Mostra o status de pagamento
const formatPlayerList = () => {
    const { mainList, waitingList } = GameState.getState();
    let header = `*🏐 Vôlei de Terça 🏐*\n\n`;
    header += `*Horário:* 20h - 22h\n`;
    header += `*Local:* T9 Beach\n`;
    header += `*Endereço:* https://maps.app.goo.gl/UHavGhCaVuWDmGNp7?g_st=aw\n\n`;
    header += `*Valor:* R$ 13,34 por pessoa (para 24 jogadores)\n`;
    header += `*Pix:* \`rmo02segundo@gmail.com\` (copie e cole)\n\n`;
    header += `-----------------------------\n\n`;

    if (mainList.length === 0 && waitingList.length === 0) {
        return header + "A lista de presença está vazia! 🤔";
    }

    let response = header + `*Lista (${mainList.length}/${MAX_PLAYERS_MAIN_LIST}) 🏐*\n\n`;
    response += "*--- Confirmados ---*\n";
    mainList.forEach((p, i) => {
        let status = p.paid ? "💰" : p.paymentPending ? "⏳" : "";
        response += `${i + 1}. ${p.name} ${status}\n`;
    });

    if (waitingList.length > 0) {
        response += "\n*--- Lista de Espera ---*\n";
        waitingList.forEach((p, i) => {
            let status = p.paid ? "💰" : p.paymentPending ? "⏳" : "";
            response += `${i + 1}. ${p.name} ${status}\n`;
        });
    }

    return response;
};

const handleMessage = async (message, client) => {
    try {
        if (message.from === "status@broadcast") return;
        const chat = await message.getChat();
        if (!chat.isGroup) return;

        const isFunCommandHandled = await handleFunCommands(message);
        if (isFunCommandHandled) return;

        if (!message.mentionedIds.includes(client.info.wid._serialized) && !message.fromMe) return;

        const sender = await message.getContact();
        const senderId = sender.id.user;
        const senderName = sender.pushname || sender.name;
        const botNumber = client.info.wid.user;
        let content = message.body.toLowerCase().replace(`@${botNumber}`, "").trim();

        // --- Roteamento ---
        if (content.startsWith("ajuda")) {
            await message.reply(`*Comandos do Bot de Vôlei* 🏐

*eu vou* - Entra na lista.
*nao vou* - Sai da lista.
*paguei* - Marca pagamento como pendente.
*lista* - Mostra a lista.

👤 *Convidados:*
*convidado [nome]*
*remover convidado [nome]*
*pagou convidado [nome]*

👑 *Admin:*
*confirmar pagamento [nome ou @pessoa]*

🎲 *Outros:*
*sortear [N]*
*idgrupo*`);
        } else if (content.startsWith("eu vou")) {
            const result = GameState.addPlayer({
                id: senderId,
                name: senderName,
                paid: false,
                paymentPending: false,
                isGuest: false,
            });
            await message.reply(result.message);

        } else if (content.startsWith("nao vou")) {
            const result = GameState.removePlayer(senderId);
            let replyMsg = result.success ? `${senderName}, você saiu da lista.` : `${senderName}, você não estava na lista.`;
            if (result.promotedPlayer) replyMsg += `\n🎉 ${result.promotedPlayer.name} entrou na lista principal!`;
            await message.reply(replyMsg);

        } else if (content.startsWith("paguei")) {
            const result = GameState.confirmPayment(senderId);
            await message.reply(result.message);

        } else if (content.startsWith("convidado")) {
            const guestName = content.substring("convidado".length).trim();
            if (!guestName) return message.reply("📝 Use: *@Bot convidado [Nome]*");
            const guest = {
                id: `guest_${guestName.toLowerCase()}`,
                name: `${guestName} (Convidado de ${senderName})`,
                paid: false,
                paymentPending: false,
                isGuest: true,
            };
            const result = GameState.addPlayer(guest);
            await message.reply(result.message);

        } else if (content.startsWith("remover convidado")) {
            const guestName = content.substring("remover convidado".length).trim();
            const result = GameState.removePlayer(guestName);
            let replyMsg = result.success ? `Convidado "${guestName}" removido.` : `Convidado "${guestName}" não encontrado.`;
            if (result.promotedPlayer) replyMsg += `\n🎉 ${result.promotedPlayer.name} entrou na lista principal!`;
            await message.reply(replyMsg);

        } else if (content.startsWith("pagou convidado")) {
            const guestName = content.substring("pagou convidado".length).trim();
            const result = GameState.confirmPayment(`guest_${guestName.toLowerCase()}`);
            await message.reply(result.message);

        // ⭐️ NOVO: Admin confirmar pagamento por @ ou nome
        } else if (content.startsWith("confirmar pagamento")) {
            if (!ADMIN_NUMBERS.includes(senderId)) {
                return message.reply("Sem permissão.");
            }

            let playerIdOrName = content.substring("confirmar pagamento".length).trim();

            // 🔄 Se admin mencionou alguém, pega o ID real do jogador
            if (message.mentionedIds.length > 0) {
                const mentioned = message.mentionedIds.find(id => id !== client.info.wid._serialized);
                if (mentioned) {
                    playerIdOrName = mentioned.split("@")[0]; // pega só o número
                }
            }

            if (!playerIdOrName) {
                return message.reply("Use: *@Bot confirmar pagamento [Nome ou @pessoa]*");
            }

            const result = GameState.adminConfirmPayment(playerIdOrName);
            await message.reply(result.message);

        } else if (content.startsWith("lista")) {
            await message.reply(formatPlayerList());

        } else if (content.startsWith("sortear")) {
            const numTimes = parseInt(content.split(" ")[1]);
            if (isNaN(numTimes) || numTimes < 2) {
                return message.reply("Use: *sortear [número]*. Ex: *sortear 2*");
            }
            const { mainList } = GameState.getState();
            if (mainList.length < numTimes) {
                return message.reply(`Não há jogadores suficientes para ${numTimes} times.`);
            }
            let jogadores = [...mainList].sort(() => Math.random() - 0.5);
            const times = Array.from({ length: numTimes }, () => []);
            jogadores.forEach((j, i) => times[i % numTimes].push(j.name));
            let msg = "🔥*TIMES SORTEADOS!* 🔥\n\n";
            times.forEach((t, i) => msg += `*Time ${i + 1}:*\n${t.map(n => `- ${n}`).join("\n")}\n\n`);
            await message.reply(msg);

        } else if (content.startsWith("idgrupo")) {
            await message.reply(`ID do grupo: ${chat.id._serialized}`);
        }
    } catch (err) {
        console.error("❌ Erro no handleMessage:", err);
        await message.reply("⚠️ Ocorreu um erro, tente novamente.");
    }
};

module.exports = { handleMessage };
