const Binance = require('node-binance-api');
var env = require('dotenv').config();

const api_key = process.env.BINANCE_TOKEN;

console.log(api_key);