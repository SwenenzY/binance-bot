const Binance = require( 'node-binance-api' );
var env       = require( 'dotenv' ).config(  );

const binance = new Binance().options( {
    APIKEY: process.env.BINANCE_TOKEN,
    APISECRET: process.env.BINANCE_SECRET
} );

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

function floor_figure(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
}

// WE DON'T NEED A FEE OR COMMISSION CUZ WE ARE USING BNB FOR THE FEE

function calculate_buy_amount( coin, price ) {
    return new Promise( ( resolve, reject ) => {
        binance.balance( ( error, balances ) => {
            if ( error ) {
                reject( error );
            } else {
                var balance = balances[coin].available;
                var amount = balance / price;
                resolve( floor_figure(amount, 5 ) );
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
                resolve( floor_figure( balance, 5 ) );
            }
        } );
    } );
}


async function buy_future( coin, amount ) {
    console.info( `Bought ${amount}x ${coin}` );
    await binance.futuresMarketBuy( coin, amount, (error, response) => {
        console.info("Market Buy response", response);
        console.info("order id: " + response.orderId);
    } );
}

async function sell_future( coin, amount ) {
    console.info( `Bought ${amount}x ${coin}` );
    await binance.futuresMarketSell( coin, amount, (error, response) => {
        console.info("Market Buy response", response);
        console.info("order id: " + response.orderId);
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

function perc_increase(a, b) {
    let percent;
    if (b !== 0) {
        if (a !== 0) {
            percent = (b - a) / a * 100;
        } else {
            percent = b * 100;
        }
    } else {
        percent = - a * 100;
    }
    return percent.toFixed(2);
}

module.exports = {
    get_balance,
    get_coin_price,
    calculate_buy_amount,
    get_coin_amount,
    get_current_price,
    get_balances,
    buy_coin,
    sell_coin,
    perc_increase,
    buy_future,
    sell_future
};