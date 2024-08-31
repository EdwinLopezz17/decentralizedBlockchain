
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key1 = ec.genKeyPair();
const key2 = ec.genKeyPair();

console.log("User 1 Private Key:", key1.getPrivate('hex'));
console.log("User 1 Public Key:", key1.getPublic('hex'));

console.log("User 2 Private Key:", key2.getPrivate('hex'));
console.log("User 2 Public Key:", key2.getPublic('hex'));

