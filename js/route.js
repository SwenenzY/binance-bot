const binance = require('./binance.js');
const telegram_bot = require('./telegram.js');

let usdt_price = 0; // % change
let last_price = 0; // last ATOM price

module.exports = function (app) {
    let buy_state = false;
    app.post( '/api/binance_trade', async function ( req,res ) {
        const { parity, position, api_key, secret_key, rsi } = req.body;
        let price = await binance.get_current_price( parity ); // get price from binance cuz have diff.
        var usdt_balance = await binance.get_balance('USDT');
        if (position === 'long') {
            if (usdt_price === 0) {
                usdt_price = price;
            }
            if (price > usdt_price) {
                usdt_price = price;
            }
            if (price > last_price) {
                last_price = price;
            }
            let percent = binance.perc_increase( usdt_price, usdt_balance ); // get % change
            let available_balance = await binance.calculate_buy_amount( 'USDT', price ); // get amount to buy
            if (price > usdt_price * 1.01) {
                if (buy_state === false) {
                    buy_state = true;
                    console.log('BUY');
                    binance.buy_future( parity, available_balance );
                    telegram_bot.send_message( `Bought 'BTCUSDT' with ${amount} for ${price}` );
                    telegram_bot.send_message( `${last_price < price ? 'WIN' : 'LOSS'} (%${percent}) Sold 'BTCUSDT' with ${amount} for ${price}` );
                }
            } else {
                if (buy_state === true) {
                    buy_state = false;
                    console.log('SELL');
                    binance.sell_future( parity, available_balance );
                    telegram_bot.send_message( `${last_price < price ? 'WIN' : 'LOSS'} (%${percent}) Sold 'BTCUSDT' with ${amount} for ${price}` );
                }
            }
        } else {
            if (price < usdt_price * 0.99) {
                if (buy_state === false) {
                    buy_state = true;
                    console.log('BUY');
                    binance.buy_future( parity, available_balance );
                    telegram_bot.send_message( `Bought 'BTCUSDT' with ${amount} for ${price}` );
                }
            } else {
                if (buy_state === true) {
                    buy_state = false;
                    console.log('SELL');
                    binance.sell_future( parity, available_balance );
                    telegram_bot.send_message( `${last_price < price ? 'WIN' : 'LOSS'} (%${percent}) Sold 'BTCUSDT' with ${amount} for ${price}` );
                }
            }
        }
        
        res.sendStatus( 200 );
    } );

    app.get( '*',  function( req, res ) { res.status( 404 ).send('404'); } ); 

} 