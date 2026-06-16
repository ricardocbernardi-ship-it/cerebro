const { ec } = require("../src/crypto");
const Transaction = require("../src/Transaction");
const { carregar, salvar } = require("../src/persistencia");
const fs = require("fs");
const path = require("path");

const ARQ_CARTEIRAS = path.join(__dirname, "..", "dados", "carteiras.json");

// ══════════════════════════════════════
const INDICE_REMETENTE    = 0; // quem envia
const INDICE_DESTINATARIO = 1; // quem recebe
const QUANTIA = 20;            // quantidade de CEREBRO
// ══════════════════════════════════════

function main() {
  if (!fs.existsSync(ARQ_CARTEIRAS)) {
    console.error("❌ Nenhuma carteira encontrada! Rode 1-CRIAR-CARTEIRA.bat primeiro.");
    process.exit(1);
  }
  const carteiras = JSON.parse(fs.readFileSync(ARQ_CARTEIRAS, "utf8"));
  const remetente = carteiras[INDICE_REMETENTE];
  const destinatario = carteiras[INDICE_DESTINATARIO];

  if (!remetente || !destinatario) {
    console.error("❌ Precisa de pelo menos 2 carteiras. Rode 1-CRIAR-CARTEIRA.bat de novo.");
    process.exit(1);
  }

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   ENVIANDO MOEDAS — Transação Assinada                   ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  const blockchain = carregar();
  const saldoAntes = blockchain.getBalanceOfAddress(remetente.publicKey);

  console.log("\n  De      :", remetente.publicKey.substring(0, 20) + "...");
  console.log("  Para    :", destinatario.publicKey.substring(0, 20) + "...");
  console.log("  Quantia :", QUANTIA, "CEREBRO");
  console.log("  Saldo atual do remetente:", saldoAntes, "CEREBRO");

  const chaveAssinatura = ec.keyFromPrivate(remetente.privateKey);
  const tx = new Transaction(remetente.publicKey, destinatario.publicKey, QUANTIA);
  tx.signTransaction(chaveAssinatura);

  console.log("\n  ✅ Transação assinada com a chave privada do remetente");
  console.log("  Assinatura:", tx.signature.substring(0, 30) + "...");

  blockchain.adicionarTransacao(tx);
  salvar(blockchain);

  console.log("\n  📋 Transação adicionada à fila de pendentes.");
  console.log("  ⛏️  Rode 2-MINERAR.bat para confirmar e incluir num bloco!\n");
}
main();
