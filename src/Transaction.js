const crypto = require("crypto");
const { ec } = require("./crypto");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return crypto.createHash("sha256")
      .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
      .digest("hex");
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("Você só pode assinar transações da sua própria carteira!");
    }
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true; // recompensa de mineração
    if (!this.signature || this.signature.length === 0) {
      throw new Error("Transação sem assinatura!");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports = Transaction;
