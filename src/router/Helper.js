const Web3 = require('web3');
const axios = require('axios');
class Helper{
    constructor(RPC_URL){
        this.web3 = new Web3(RPC_URL);
        this.web3.extend({
            property: 'clique',
            methods: [{
                name: 'status',
                call: 'clique_status',
                params: 0,
            },
            {
                name: 'getSnapshot',
                call: 'clique_getSnapshot',
                params: 0,
            },
            {
                name: 'getSigners',
                call: 'clique_getSigners',
                params: 1,
            }
        ]
        });
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
    getBlock(number){
        return this.web3.eth.getBlock(number);
    }
    getChecksumAddress(addr){
        return this.web3.utils.toChecksumAddress(addr);
    }
    getValidatorStatus(){
        // console.log("hi");
        return this.web3.clique.status();
    }
    async getRate(){
      let result = await axios.get('https://api.coingecko.com/api/v3/coins/zenith-chain?localization=false&tickers=true');
      return {price:result.data.market_data.current_price.usd,change:result.data.market_data.price_change_24h,percent:result.data.market_data.price_change_percentage_24h};
    }
}
module.exports = Helper;