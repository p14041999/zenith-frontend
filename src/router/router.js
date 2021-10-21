const router = require("express").Router();
const Helper = require('./Helper');
let helper = new Helper(process.env.RPC_URL);
const Block=require('../models/block');
const Transaction = require('../models/transaction');
const TokenTransfer = require('../models/tokenTransaction');
const Address = require('../models/address');
const Contract = require('../models/contract');
router.get('/',async (req,res)=>{
    let txnCount = await Transaction.count()
    let address = await Address.count()
    let txns = await Transaction.find().sort({timestamp:-1}).limit(10);
    let blocks = await Block.find().sort({ timestamp: -1 }).limit(10);
    let currentBlock = await helper.currentBlock();
    // console.log(blocks); 
    let stat={
        totalTx:txnCount,
        latestBlock:currentBlock,
        last10Bk:blocks,
        last10Txn:txns,
        holders:address,
        price:0.2
    }
    res.render('index',stat);
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
        if(txns){
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
        }else{
            res.send("Transaction is still pending!");
        }
    }catch(e){
        console.log(e);
        res.send("502 - Internal server error!");
    }
})

router.post('/search',async (req,res)=>{
    // console.log(req.body);
    // res.send("DOne!")
    try {
        let tLength =req.body.q.toString().length;
        if(tLength == 42){
            // 0x0714c62e819041b72bbc3aaa230a6969b6baaf82
            res.redirect('/address/'+req.body.q);
        }else{
            if(tLength != 66){
                try {
                    let blockNumber = Number.parseInt(req.body.q);
                    res.redirect('/block/'+blockNumber);
                }catch (error) {
                   res.send("Token Can't be found!");
                }
            }else{
                res.redirect('/tx/'+req.body.q);
            }
        }
    } catch (error) {
        res.send("502- Internal Server Error");
    }
})


module.exports = router;