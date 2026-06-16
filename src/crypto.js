// Mesma curva criptográfica usada pelo Bitcoin de verdade: secp256k1
const EC = require("elliptic").ec;
module.exports.ec = new EC("secp256k1");
