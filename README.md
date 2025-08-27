# Bot de Vôlei para WhatsApp

Este é um bot para WhatsApp desenvolvido em Node.js com a biblioteca `whatsapp-web.js`. Ele foi criado para gerenciar a lista de presença e os times para um jogo de vôlei semanal, além de possuir algumas interações.

## Funcionalidades

- **Gerenciamento de Lista**: Adiciona e remove jogadores da lista principal e de espera.
- **Controle de Pagamento**: Marca jogadores que já pagaram a sua parte.
- **Sorteio de Times**: Sorteia times de forma equilibrada com base nos jogadores confirmados.
- **Interações**: Responde a saudações e possui comandos de brincadeira.

---

## 🚀 Como Configurar e Rodar o Bot

Siga os passos abaixo para colocar o bot para funcionar.

### Pré-requisitos

- Node.js (versão 18 ou superior) instalado na sua máquina.

### 1. Instalação

Primeiro, clone ou baixe os arquivos do projeto. Depois, abra o terminal na pasta do projeto e instale as dependências:

```bash
npm install
```


### 2. Executando o Bot

Com tudo configurado, inicie o bot com o comando:

```bash
npm start
```

- **QR Code**: Na primeira vez que você rodar, um QR Code aparecerá no terminal. Escaneie-o com o seu WhatsApp (em `Aparelhos conectados > Conectar um aparelho`).
- **Sessão**: Após o primeiro login, uma sessão será salva na pasta `.wwebjs_auth`, e você não precisará escanear o QR Code novamente, a menos que se desconecte.

---

## 🤖 Comandos do Bot

Para usar um comando, mencione o bot no grupo seguido do comando. Ex: `@NomeDoBot eu vou`.

### Comandos Principais

-   `eu vou` ou `vou`: Adiciona seu nome à lista de confirmados.
-   `nao vou` ou `não vou`: Remove seu nome da lista.
-   `paguei` ou `pago`: Marca seu nome como pago (💰).
-   `lista`: Exibe a lista de confirmados e a lista de espera.
-   `sortear [N]`: Sorteia `N` times com os jogadores confirmados. (Ex: `sortear 2`).
-   `ajuda` ou `comandos`: Mostra a lista de comandos disponíveis.


### Comandos Divertidos

-   `faz o l`: O bot responde com uma pérola aleatória do Lula.
-   Responde a saudações como "bom dia", "boa tarde" e "boa noite".

---

## 🔧 Estrutura do Projeto (Opcional)

-   `index.js`: Arquivo principal que inicializa o bot e a conexão com o WhatsApp.
-   `src/handlers/`: Contém a lógica para cada tipo de comando.
    -   `messageHandler.js`: Processa os comandos principais do vôlei.
    -   `funHandler.js`: Lida com as interações divertidas.
-   `src/state/`: Gerencia o estado do jogo (listas de jogadores).
-   `src/config/`: Configurações gerais, como o número máximo de jogadores.
-   `.env`: Arquivo para guardar suas chaves de API.
