const Block = require("./Block");
const Transaction = require("./Transaction");

class Blockchain {
  constructor() {
    this.chain = [this.criarBlocoGenesis()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.baseReward = 50;        // recompensa inicial, igual Bitcoin
    this.halvingInterval = 10;   // blocos entre cada halving (Bitcoin real: 210.000)
    this.maxSupply = 21000000;   // limite máximo — igual Bitcoin
  }

  criarBlocoGenesis() {
    return new Block(Date.parse("2026-06-15"), [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Recompensa cai pela metade a cada halvingInterval blocos — igual Bitcoin
  getMiningReward() {
    const altura = this.chain.length;
    const halvings = Math.floor(altura / this.halvingInterval);
    const recompensa = this.baseReward / Math.pow(2, halvings);
    return recompensa < 1e-8 ? 0 : recompensa;
  }

  getTotalSupply() {
    let total = 0;
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === null) total += tx.amount;
      }
    }
    return total;
  }

  minerarTransacoesPendentes(enderecoRecompensa) {
    const recompensa = this.getMiningReward();
    if (recompensa > 0 && this.getTotalSupply() < this.maxSupply) {
      const txRecompensa = new Transaction(null, enderecoRecompensa, recompensa);
      this.pendingTransactions.push(txRecompensa);
    }

    const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    this.chain.push(block);
    this.pendingTransactions = [];
  }

  adicionarTransacao(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transação precisa de remetente e destinatário");
    }
    if (!transaction.isValid()) {
      throw new Error("Não é possível adicionar transação inválida à cadeia");
    }
    if (transaction.amount <= 0) {
      throw new Error("A quantia da transação deve ser maior que zero");
    }
    const saldoCarteira = this.getBalanceOfAddress(transaction.fromAddress);
    if (saldoCarteira < transaction.amount) {
      throw new Error(`Saldo insuficiente! Tem ${saldoCarteira}, tentou enviar ${transaction.amount}`);
    }
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) balance -= trans.amount;
        if (trans.toAddress === address) balance += trans.amount;
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) return false;
      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (!currentBlock.hasValidTransactions()) return false;
    }
    return true;
  }
}

module.exports = Blockchain;
