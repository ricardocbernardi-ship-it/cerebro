const { carregar } = require("../src/persistencia");
const fs = require("fs");
const path = require("path");

const ARQ_CARTEIRAS = path.join(__dirname, "..", "dados", "carteiras.json");

function main() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   SALDOS — CEREBRO                                       ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  if (!fs.existsSync(ARQ_CARTEIRAS)) {
    console.log("  Nenhuma carteira criada ainda. Rode 1-CRIAR-CARTEIRA.bat\n");
    return;
  }
  const carteiras = JSON.parse(fs.readFileSync(ARQ_CARTEIRAS, "utf8"));
  const blockchain = carregar();

  carteiras.forEach((c, i) => {
    const saldo = blockchain.getBalanceOfAddress(c.publicKey);
    console.log(`\n  [${i}] ${c.publicKey.substring(0, 30)}...`);
    console.log(`      Saldo: ${saldo} CEREBRO`);
  });
  console.log(`\n  Supply total emitido: ${blockchain.getTotalSupply()} / ${blockchain.maxSupply} CEREBRO`);
  console.log("");
}
main();
