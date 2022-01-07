const Binance = require('node-binance-api');
var env = require('dotenv').config();

const binance = new Binance().options({
    APIKEY: process.env.BINANCE_TOKEN,
    APISECRET: process.env.BINANCE_SECRET
});

function get_balance( coin ) {
    return new Promise( ( resolve, reject ) => {
        binance.balance( ( error, balances ) => {
            if ( error ) {
                reject( error );
            } else {
                resolve( balances[coin].available );
            }
        } );
    } );
}

function get_balances( ) {
    return new Promise( ( resolve, reject ) => {
        binance.balance( ( error, balances ) => {
            if ( error ) {
                reject( error );
            } else {
                resolve( balances );
            }
        } );
    } );
}

function get_coin_price( coin ) {
    return new Promise( ( resolve, reject ) => {
        binance.prices( ( error, prices ) => {
            if ( error ) {
                reject( error );
            } else {
                resolve( prices[coin] );
            }
        } );
    } );
}
function floorFigure(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
}

function calculate_buy_amount( coin, price ) {
    return new Promise( ( resolve, reject ) => {
        binance.balance( ( error, balances ) => {
            if ( error ) {
                reject( error );
            } else {
                var balance = balances[coin].available;
                var amount = (0.98 * balance) / price;
                var fee = amount * 0.000002;
                var balance = amount-fee;
                resolve( floorFigure(balance,5 ) );
            }
        } );
    } );
}


function get_coin_amount( coin, price ) {
    return new Promise( ( resolve, reject ) => {
        binance.balance( ( error, balances ) => {
            if ( error ) {
                reject( error );
            } else {
                var balance = balances[coin].available;
                var fee = balance * 0.050;
                var balance = balance-fee;
                resolve( floorFigure(balance,5 ) );
            }
        } );
    } );
}

async function buy_coin( coin, amount ) {
    console.info( `Bought ${amount}x ${coin}` );
    await binance.marketBuy( coin, amount, (error, response) => {
        //console.log("Market Buy error", error);
        console.info("Market Buy response", response);
        console.info("order id: " + response.orderId);
    });
}

async function sell_coin( coin, amount ) {
    console.info( `Sold ${amount}x ${coin}` );
    // 0.1% fee
    await binance.marketSell( coin, amount, (error, response) => {
        //console.log("Market Buy error", error);
        console.info("Market Buy response", response);
        console.info("order id: " + response.orderId);
    });
}

function get_current_price( coin ) {
    return new Promise( ( resolve, reject ) => {
        binance.prices( ( error, prices ) => {
            if ( error ) {
                reject( error );
            } else {
                resolve( prices[coin] );
            }
        } );
    } );
}

module.exports = {
    get_balance,
    get_coin_price,
    calculate_buy_amount,
    get_coin_amount,
    get_current_price,
    get_balances,
    buy_coin,
    sell_coin
};