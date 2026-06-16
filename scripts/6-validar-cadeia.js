const { carregar } = require("../src/persistencia");

function main() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   VALIDANDO A CADEIA                                     ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  const blockchain = carregar();
  const valida = blockchain.isChainValid();

  console.log("\n  Blocos verificados:", blockchain.chain.length);
  console.log("  Resultado:", valida ? "✅ CADEIA VÁLIDA — nenhuma alteração detectada" : "❌ CADEIA INVÁLIDA — algo foi alterado!");
  console.log("");
}
main();
