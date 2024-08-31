const axios = require("axios");
const Block = require("./Block");
const Transaction = require("./Transaction");

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this. miningReward = 100;
        this.peers = [];
    }

    createGenesisBlock(){
        return new Block("25/07/2000", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(chain = this.chain){
        for(let i=1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

            for (const tx of currentBlock.transactions){
                if(!tx.isValid()){
                    return false;
                }
            }
        }
        return true;
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }
        
        if(this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount){
            throw new Error('Not enough balance');
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                   balance -= trans.amount; 
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    minePendingTransactions(miningRewardAddress){
        
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash );
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');

        this.chain.push(block);

        this.pendingTransactions = [];
    }

    async resolveConflicts(){
        let longestChain = null;
        let maxLength = this.chain.length;

        for (const peer of this.peers){
            try{
                const response = await axios.get(`${peer}/chain`);
                const peerChain = response.data;

                if(peerChain.length > maxLength && this.isChainValid(peerChain)){
                    maxLength = peerChain.length;
                    longestChain = peerChain;
                }
            }catch(error){
                console.error(`Error fetching chain from peer ${peer}`, error);
            }
        }

        if(longestChain){
            this.chain = longestChain;
            console.log('Chain updated with the longest chain');
            return true;
        }else{
            console.log('Current chain is the longest.');
            return false;
        }
    }

    addPeer(peerUrl){
        if(!this.peers.includes(peerUrl)){
            this.peers.push(peerUrl);
        }
    }

}


module.exports = Blockchain;