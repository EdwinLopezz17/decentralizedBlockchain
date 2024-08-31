const axios = require("axios");

class Node{
    constructor(){
        this.peers = [];
    }

    addPeer(peerUrl){
        this.peers.push(peerUrl);
    }

    broadcastNewBlock(block){
        this.peers.forEach(peer =>{
            axios.post(`${peer}/addBlock`,block)
                .then(respose => console.log(`Block propagated to ${peer}`))
                .catch(error => console.error(`Failed to propagate to ${peer}`, error));
        });
    }
    
}

module.exports = Node;
