// Esta função procura por gatilhos divertidos em todas as mensagens
const handleFunCommands = async (message) => {
  const content = message.body.toLowerCase();

  // Saudação: Bom dia
  if (content.includes("bom dia")) {
    await message.reply(
      "Bom dia, galera! Bora pra cima que hoje é dia de vôlei! 🏐☀️"
    );
    return true; // Retorna true para indicar que a mensagem foi tratada
  }

  // Saudação: Boa tarde
  if (content.includes("boa tarde")) {
    await message.reply("Boa tarde, pessoal! 🌤️");
    return true;
  }

  // Saudação: Boa noite
  if (content.includes("boa noite")) {
    await message.reply(
      "Boa noite! Durmam bem pra estarem inteiros pro jogo! 😴"
    );
    return true;
  }

    if (content.toLowerCase().includes("clodoaldo")) {
    // Lista de respostas possíveis
    const replies = [
        "Onde é hoje?! 🍺",
        "Minha garganta até secou aqui. 🍺",
        "Alguém falou em Clodoaldo? Meu fígado já se prontificou.",
        "Cuidado ao pronunciar esse nome, você pode invocar uma rodada de cerveja.",
        "Ouvi meu nome e o som de uma garrafa abrindo. Coincidência? 🤔",
    ];

    // Escolhe uma resposta aleatória da lista
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    // Envia a resposta escolhida
    await message.reply(randomReply);
    
    return true;
}

  //  Comando de piada
  if (
    content.includes("me conta uma piada") ||
    content.includes("faz uma piada") ||
    content.includes("piada")
  ) {
    const piadas = [
      "O que o pato falou para a pata? \nR: Vem Quá!",
      "Por que a velhinha não usa relógio? \nR: Porque ela é sem hora.",
      "Qual é o rei dos queijos? \nR: O reiqueijão.",
      "O que o tomate foi fazer no banco? \nR: Foi tirar extrato.",
    ];
    // Sorteia uma piada da lista
    const piadaSorteada = piadas[Math.floor(Math.random() * piadas.length)];
    await message.reply(piadaSorteada);
    return true;
  }

  return false;
};

module.exports = { handleFunCommands };
