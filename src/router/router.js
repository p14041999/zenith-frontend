const router = require("express").Router();
const Helper = require('./Helper');
let helper = new Helper(process.env.RPC_URL);
const Block=require('../models/block');
const Transaction = require('../models/transaction');
const TokenTransfer = require('../models/tokenTransaction');
const Address = require('../models/address');
const Contract = require('../models/contract');
router.get('/',(req,res)=>{
    // res.send("Home Page!")
    res.render('index');
})
router.get('/address/:address',async (req,res)=>{
    try{
        let valid = helper.isValidAddress(req.params.address);
        if(valid){
            let isContract = await helper.isContract(req.params.address);
            if(isContract){
                let address = await Address.findOne({address:req.params.address}).populate('transactions');
                let contract = await Contract.findOne({address:req.params.address});
                let balance = await helper.getBalance(address.address);
                // Render Contract Page
                res.render('contract',{address,type:"Contract",contract,balance,rate:0.2});
            }else{
                let address = await Address.findOne({address:req.params.address}).populate('transactions');
                // console.log(address);
                if(address){

                    let balance = await helper.getBalance(req.params.address);
                    // Render Contract Page
                    res.render('address',{address,type:"Address",balance,rate:0.2});
                }else{
                    let balance = await helper.getBalance(req.params.address);
                    res.render('address',{address:{
                        address:req.params.address,
                        transactions:[]
                    },type:"Address",balance,rate:0.2});
                }
                // Render Address Page
                // res.send("It's a address");
            }
        }else{
            // Render Invalid Address Page
            res.send("Invalid Address!");
        }
    }catch(e){
        console.log(e);
        res.send("502 - Internal server error!");
    }
})
router.get('/block/:number',async (req,res)=>{
    try{
        // Search for block
        let block = await Block.findOne({number:req.params.number});
        if(block){
            // Render Block Page
            // res.send("It\'s a block")
            res.render('block',{block});
        }else{
            // Render Block Not Found Page
            res.send("Block not Found!");
        }
    }catch(e){
        console.log(e);
        res.send("502 - Internal server error!");
    }
})
// Token Contract -> 0xEf730aC4483941273C7f532BAB2F27f6B8D8A313
// 
router.get('/tx/:hash',async (req,res)=>{
    try{
        // Search for block
        let rate = 0.2
        let txns = await Transaction.findOne({hash:req.params.hash});
        let currentBlock = await helper.currentBlock();
        let tknTransfers = await TokenTransfer.find({transactionHash:req.params.hash})
        if(txns.contractAddress != null){
            res.render('transaction',{tx:txns,transfers:tknTransfers,interaction:false,creation:true,block:currentBlock,rate});
        }else{
            if(await helper.isContract(txns.to)){
                res.render('transaction',{tx:txns,transfers:tknTransfers,interaction:true,creation:false,block:currentBlock,rate});
            }else{
                res.render('transaction',{tx:txns,transfers:tknTransfers,interaction:false,creation:false,block:currentBlock,rate});
            }
        }
        // txns.transfers = tknTransfers;
        // res.send(txns);
    }catch(e){
        console.log(e);
        res.send("502 - Internal server error!");
    }
})

module.exports = router;