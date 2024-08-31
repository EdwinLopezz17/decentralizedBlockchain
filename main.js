const Block = require("./src/Block");
const Blockchain = require("./src/Blockchain");
const Transaction = require("./src/Transaction");


function main(){
    let coin = new Blockchain();

    coin.addBlock(new Block(Date.now(), [new Transaction('address1', 'address2',50)]) );
    coin.addBlock(new Block(Date.now(), [new Transaction('address1', 'address2',50)]) );

    console.log('Blockchain valid?', coin.isChainValid())
    console.log(JSON.stringify(coin, null, 4));

}

main();
