const { carregar } = require("../src/persistencia");

function main() {
  const blockchain = carregar();
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   BLOCKCHAIN COMPLETA — CEREBRO                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  blockchain.chain.forEach((block, i) => {
    console.log(`\n  ── Bloco #${i} ──────────────────────────────`);
    console.log("  Timestamp     :", new Date(block.timestamp).toLocaleString("pt-BR"));
    console.log("  Hash anterior :", block.previousHash.substring(0, 40) + (block.previousHash.length > 40 ? "..." : ""));
    console.log("  Hash          :", block.hash);
    console.log("  Nonce         :", block.nonce);
    console.log("  Transações    :", block.transactions.length);
    block.transactions.forEach((tx) => {
      const de = tx.fromAddress ? tx.fromAddress.substring(0, 16) + "..." : "⛏️  RECOMPENSA DE MINERAÇÃO";
      console.log(`      ${de} → ${tx.toAddress.substring(0, 16)}... : ${tx.amount} CEREBRO`);
    });
  });
  console.log(`\n  Total de blocos: ${blockchain.chain.length}\n`);
}
main();
