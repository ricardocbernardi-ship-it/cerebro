# CEREBRO

Blockchain educacional própria, com a mesma estrutura técnica de fundo do Bitcoin: proof-of-work, halving, carteiras com assinatura digital (secp256k1) e rede P2P entre nós.

> ⚠️ **Sem valor real.** Não é um token, não está em nenhuma exchange, não existe fora de onde você rodar. É um projeto para aprender como o Bitcoin funciona por dentro.

## O que tem aqui

- **Proof of Work real** — mineração por hash SHA-256 com dificuldade ajustável
- **Halving** — recompensa cai pela metade a cada N blocos (igual Bitcoin, escalado para demonstração: aqui a cada 10 blocos, no Bitcoin real a cada 210.000)
- **Supply máximo de 21.000.000 CEREBRO** — escassez programada, igual Bitcoin
- **Carteiras com chave pública/privada** — mesma curva criptográfica do Bitcoin (secp256k1)
- **Transações assinadas digitalmente** — validadas antes de entrar num bloco
- **Rede P2P** — múltiplos nós conectam via WebSocket, sincronizam blocos e transações, com consenso por "cadeia mais longa válida vence" (Nakamoto consensus)

## Como rodar

```
npm install
```

Depois use os arquivos `.bat` (Windows) ou rode os scripts diretamente com `node`:

| Arquivo | O que faz |
|---|---|
| `1-CRIAR-CARTEIRA.bat` | Gera uma carteira nova (chave pública/privada) |
| `2-MINERAR.bat` | Minera um bloco (proof-of-work) |
| `3-ENVIAR.bat` | Envia moedas com transação assinada |
| `4-SALDO.bat` | Mostra saldo das carteiras |
| `5-VER-BLOCKCHAIN.bat` | Mostra todos os blocos da cadeia |
| `6-VALIDAR.bat` | Valida a integridade de toda a cadeia |
| `7-NO-A.bat` / `8-NO-B.bat` | Sobe dois nós conectados em rede P2P |

Detalhes completos em [COMO-FUNCIONA.txt](COMO-FUNCIONA.txt).

## Estrutura

```
src/          → Block, Transaction, Blockchain, P2P, persistência
scripts/      → scripts numerados, um por ação
dados/        → carteiras e blockchain local (não versionado)
rede/         → estado de cada nó da rede P2P (não versionado)
site/         → página informativa do projeto
```

## O que é diferente do Bitcoin real

- Sem ajuste automático de dificuldade (fixa)
- Sem UTXO (modelo de saldo por conta, mais simples)
- Sem mempool real, sem taxas de transação
- Sem milhares de nós independentes ao redor do mundo garantindo segurança — por isso não tem valor real fora de onde rodar
