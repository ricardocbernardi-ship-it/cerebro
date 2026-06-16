const { ec } = require("../src/crypto");
const fs = require("fs");
const path = require("path");

const ARQ_CARTEIRAS = path.join(__dirname, "..", "dados", "carteiras.json");

function main() {
  const key = ec.genKeyPair();
  const publicKey = key.getPublic("hex");
  const privateKey = key.getPrivate("hex");

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   NOVA CARTEIRA — CEREBRO (educacional)                  ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("\n  Endereço (público) :", publicKey);
  console.log("  Chave privada      :", privateKey);
  console.log("\n  ⚠️  Guarde a chave privada — só com ela é possível gastar as moedas.");
  console.log("  Esta blockchain é local e educacional — não tem valor real.");

  const dir = path.dirname(ARQ_CARTEIRAS);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let carteiras = [];
  if (fs.existsSync(ARQ_CARTEIRAS)) carteiras = JSON.parse(fs.readFileSync(ARQ_CARTEIRAS, "utf8"));
  carteiras.push({ publicKey, privateKey, criadoEm: new Date().toISOString() });
  fs.writeFileSync(ARQ_CARTEIRAS, JSON.stringify(carteiras, null, 2));

  console.log(`\n  Total de carteiras salvas: ${carteiras.length} (índice ${carteiras.length - 1})`);
  console.log(`  Arquivo: ${ARQ_CARTEIRAS}\n`);
}
main();
