const express = require('express');
const app = express();
const Helper = require('./router/Helper')
// const Web3 = require('web3');
const router = require('./router/router');
const path = require('path');
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.join(__dirname,'../public')));
app.use('/',router);

module.exports = app;