const Web3 = require('web3');
class Helper{
    constructor(RPC_URL){
        this.web3 = new Web3(RPC_URL);
    }
    static getInstance(link){
        return (this(link));
    }
    async isContract(addr){
        let code = await this.web3.eth.getCode(addr);
        if(code == "0x"){
            return false;
        }else{
            return true;
        }
    }
    async getBalance(addr){
        return this.web3.utils.fromWei(await this.web3.eth.getBalance(addr));
    }
    isValidAddress(addr){
        try {
            this.web3.utils.toChecksumAddress(addr);
            return true;
        } catch (error) {
            return false;
        }
    }
    async currentBlock(){
        return await this.web3.eth.getBlockNumber();
    }
}
module.exports = Helper;