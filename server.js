const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./src/Blockchain');
const Transaction = require('./src/Transaction');
const Block = require('./src/Block');
const Node = require('./src/Node');


const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const blockchain = new Blockchain();
const node = new Node();

app.get('/chain', (req, res)=>{
    res.send(blockchain.chain);
});

app.post('/transactions', (req, res) => {
    const { fromAddress, toAddress, amount, signature } = req.body;
    const transaction = new Transaction(fromAddress, toAddress, amount);
    transaction.signature = signature;

    try {
        if (!transaction.isValid()) {
            throw new Error('Invalid transaction');
        }

        blockchain.addTransaction(transaction);
        res.status(201).send('Transaction added successfully.');
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/mine', (req, res) => {
    const miningRewardAddress = req.query.address; // Obtener la dirección de la query
    if (!miningRewardAddress) {
        return res.status(400).send({ error: 'Address is required to mine the block' });
    }

    blockchain.minePendingTransactions(miningRewardAddress);
    res.send(`Mining completed successfully. Reward sent to ${miningRewardAddress}`);
});


app.post('/addBlock',(req,res)=>{
    const block = req.body;
    const newBlock = new Block(block.timestamp, block.transactions, block.previousHash);
    newBlock.hash = block.hash;
    newBlock.nonce = block.nonce;

    blockchain.addBlock(newBlock);
    res.send('Block added successfully.');
});

app.get('/balance/:publicKey', (req, res) => {
    const { publicKey } = req.params;

    try {
        const balance = blockchain.getBalanceOfAddress(publicKey);
        res.status(200).send({ balance });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


app.post('/addPeer', (req, res)=>{
    const {peerUrl} = req.body;
    node.addPeer(peerUrl);
    res.send(`Peer ${peerUrl} added successfully`);
});

app.get('/resolveConflicts', async(req, res)=>{
    const replaced = await blockchain.resolveConflicts();
    if(replaced){
        res.send('Chain was replaced');
    }else{
        res.send('Chain is authoritative.');
    }
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

