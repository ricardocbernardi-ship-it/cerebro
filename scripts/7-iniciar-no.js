// Inicia um nó da rede CEREBRO — conecta a outros nós, sincroniza e participa do consenso.
// Uso: node scripts/7-iniciar-no.js <porta> <peer1,peer2,...>
// Ex.: node scripts/7-iniciar-no.js 3001
//      node scripts/7-iniciar-no.js 3002 ws://localhost:3001
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { carregar, salvar } = require("../src/persistenciaRede");
const { ec } = require("../src/crypto");
const Transaction = require("../src/Transaction");
const p2p = require("../src/P2P");

const PORTA = Number(process.argv[2]) || 3001;
const PEERS = (process.argv[3] || "").split(",").filter(Boolean);

const DATA_DIR = path.join(__dirname, "..", "rede", `no-${PORTA}`);
const ARQ_CARTEIRAS = path.join(__dirname, "..", "dados", "carteiras.json");

const blockchain = carregar(DATA_DIR);
const salvarLocal = (bc) => salvar(bc, DATA_DIR);

console.log("\n╔══════════════════════════════════════════════════════════╗");
console.log(`║   NÓ DA REDE CEREBRO — porta ${PORTA}`);
console.log("╚══════════════════════════════════════════════════════════╝");
console.log("  Pasta de dados   :", DATA_DIR);
console.log("  Blocos carregados:", blockchain.chain.length);

p2p.initP2PServer(PORTA, blockchain, salvarLocal);

PEERS.forEach((peerUrl) => {
  console.log("  🔌 Conectando a peer:", peerUrl);
  p2p.connectToPeer(peerUrl, blockchain, salvarLocal);
});

function carteiras() {
  if (!fs.existsSync(ARQ_CARTEIRAS)) return [];
  return JSON.parse(fs.readFileSync(ARQ_CARTEIRAS, "utf8"));
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on("close", () => {});

mostrarMenu();

function mostrarMenu() {
  console.log("\n  Comandos: minerar <idxCarteira> | saldo | enviar <idxDe> <idxPara> <qtd> | peers | sair");
  rl.question("  > ", (linha) => processarComando((linha || "").trim()));
}

function processarComando(linha) {
  const [cmd, ...args] = linha.split(" ");

  try {
    if (cmd === "minerar") {
      const idx = Number(args[0] || 0);
      const c = carteiras()[idx];
      if (!c) { console.log("  ❌ Carteira não encontrada. Rode 1-CRIAR-CARTEIRA.bat"); return mostrarMenu(); }
      console.log("  ⛏️  Minerando...");
      blockchain.minerarTransacoesPendentes(c.publicKey);
      salvarLocal(blockchain);
      p2p.broadcastNovoBloco(blockchain);
      console.log("  ✅ Bloco minerado e transmitido pra rede! Total de blocos:", blockchain.chain.length);

    } else if (cmd === "saldo") {
      carteiras().forEach((c, i) => {
        console.log(`  [${i}] ${c.publicKey.substring(0, 24)}... : ${blockchain.getBalanceOfAddress(c.publicKey)} CEREBRO`);
      });

    } else if (cmd === "enviar") {
      const idxDe = Number(args[0]), idxPara = Number(args[1]), qtd = Number(args[2]);
      const cs = carteiras();
      const de = cs[idxDe], para = cs[idxPara];
      if (!de || !para) { console.log("  ❌ Carteira inválida"); return mostrarMenu(); }
      const chave = ec.keyFromPrivate(de.privateKey);
      const tx = new Transaction(de.publicKey, para.publicKey, qtd);
      tx.signTransaction(chave);
      blockchain.adicionarTransacao(tx);
      salvarLocal(blockchain);
      p2p.broadcastNovaTransacao(tx);
      console.log("  ✅ Transação assinada, adicionada e transmitida pra rede!");

    } else if (cmd === "peers") {
      console.log("  Peers conectados:", p2p.getSockets().length);

    } else if (cmd === "sair") {
      console.log("  Até logo!");
      process.exit(0);

    } else if (cmd) {
      console.log("  Comando não reconhecido.");
    }
  } catch (e) {
    console.log("  ❌ Erro:", e.message);
  }

  mostrarMenu();
}
