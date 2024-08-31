const axios = require('axios');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');
const Transaction = require('./src/Transaction');

const privateKey = '366621a20efbcff76f15fdfd8403d4997c62c04a1a28cfc7f66bbd6c28ee2b49';
const key = ec.keyFromPrivate(privateKey);

const recipientAddress = '046fe5de4f556dfd088ef8a7991859fc1a562610dba769416dd65423e79f9007eef43a9f0421923ca2f12e9129dca464ff3f1f687a47eec73f4340f998425769be';

const tx = new Transaction(key.getPublic('hex'), recipientAddress, 13);
tx.signTransaction(key);

console.log("Transacción Firmada:", tx);

axios.post('http://localhost:3000/transactions', {
    fromAddress: tx.fromAddress,
    toAddress: tx.toAddress,
    amount: tx.amount,
    signature: tx.signature
})
.then(response => {
    console.log('Transaction added successfully:', response.data);
})
.catch(error => {
    console.error('Error adding transaction:', error.response ? error.response.data : error.message);
});
