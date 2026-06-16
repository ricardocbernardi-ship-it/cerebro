const { carregar, salvar } = require("../src/persistencia");
const fs = require("fs");
const path = require("path");

const ARQ_CARTEIRAS = path.join(__dirname, "..", "dados", "carteiras.json");

// ══════════════════════════════════════
const INDICE_CARTEIRA = 0; // qual carteira recebe a recompensa de mineração
// ══════════════════════════════════════

function main() {
  if (!fs.existsSync(ARQ_CARTEIRAS)) {
    console.error("❌ Nenhuma carteira encontrada! Rode 1-CRIAR-CARTEIRA.bat primeiro.");
    process.exit(1);
  }
  const carteiras = JSON.parse(fs.readFileSync(ARQ_CARTEIRAS, "utf8"));
  const carteira = carteiras[INDICE_CARTEIRA];
  if (!carteira) { console.error("❌ Carteira não encontrada nesse índice."); process.exit(1); }

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   MINERANDO BLOCO — Proof of Work                        ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  const blockchain = carregar();
  console.log("\n  Blocos na cadeia       :", blockchain.chain.length);
  console.log("  Dificuldade            :", blockchain.difficulty, `(hash precisa começar com ${blockchain.difficulty} zeros)`);
  console.log("  Transações pendentes   :", blockchain.pendingTransactions.length);
  console.log("  Recompensa atual       :", blockchain.getMiningReward(), "CEREBRO", `(halving a cada ${blockchain.halvingInterval} blocos)`);
  console.log("  Supply total emitido   :", blockchain.getTotalSupply(), "/ " + blockchain.maxSupply, "CEREBRO");
  console.log("\n  Minerando... (testando combinações até achar um hash válido)\n");

  blockchain.minerarTransacoesPendentes(carteira.publicKey);
  salvar(blockchain);

  const saldo = blockchain.getBalanceOfAddress(carteira.publicKey);
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  ✅ BLOCO ADICIONADO À CADEIA!                            ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("  Total de blocos agora:", blockchain.chain.length);
  console.log("  Saldo da carteira    :", saldo, "CEREBRO\n");
}
main();
