const binance = require('./binance.js');
const telegram_bot = require('./telegram.js');

let usdt_price = 0; // % change
let last_price = 0; // last ATOM price

module.exports = function (app) {
    let buy_state = false;
    app.post( '/api/binance_trade', async function ( req,res ) {
<<<<<<< Updated upstream
        const { action } = req.body;
        let price = await binance.get_current_price( 'ATOMUSDT' ); // get price from binance cuz have diff.
        var usdt_balance = await binance.get_balance('USDT');
        if ( action == 'VERIFY' ) {
            binance.set_state( !binance.get_state( ) );
        }
        if( binance.get_state( ) ) {
            // save prices on buy
            last_price = price;
            usdt_price = usdt_balance;

            let amount = await binance.calculate_buy_amount( 'USDT', price );
            binance.buy_coin( 'ATOMUSDT', amount );
            telegram_bot.send_message( `Bought 'ATOMUSDT' with ${amount} for ${price}` );

        } else {
            if ( price > 0.00020 ) { // ATOM price bigger than 0.00020
                // sell ATOM
                let amount = await binance.get_coin_amount( 'ATOM' ); // get amount of ATOM
                binance.sell_coin( 'ATOMUSDT', amount ); // sell ATOM
                // get usdt balance
                var usdt_balance = await binance.get_balance('USDT');
                let percent = binance.perc_increase( usdt_price, usdt_balance ); // get % change
                telegram_bot.send_message( `${last_price < price ? 'WIN' : 'LOSS'} (%${percent}) Sold 'ATOMUSDT' with ${amount} for ${price}` );

                // reset prices
                last_price = 0;
                usdt_price = 0;
=======
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
>>>>>>> Stashed changes
            }
        }

        // if ( action == 'VERIFY' ) {
        //     binance.set_state( !binance.get_state( ) );
        // }
        // if( binance.get_state( ) ) {
        //     // save prices on buy
        //     last_price = price;
        //     usdt_price = usdt_balance;

        //     let amount = await binance.calculate_buy_amount( 'USDT', price );
        //     binance.buy_coin( 'BTCUSDT', amount );
        //     telegram_bot.send_message( `Bought 'BTCUSDT' with ${amount} for ${price}` );

        // } else {
        //     if ( price > 0.00020 ) { // btc price bigger than 0.00020
        //         // sell btc
        //         let amount = await binance.get_coin_amount( 'BTC' ); // get amount of btc
        //         binance.sell_coin( 'BTCUSDT', amount ); // sell btc
        //         // get usdt balance
        //         var usdt_balance = await binance.get_balance('USDT');
        //         let percent = binance.perc_increase( usdt_price, usdt_balance ); // get % change
        //         telegram_bot.send_message( `${last_price < price ? 'WIN' : 'LOSS'} (%${percent}) Sold 'BTCUSDT' with ${amount} for ${price}` );

        //         // reset prices
        //         last_price = 0;
        //         usdt_price = 0;
        //     }
        // }

        res.sendStatus( 200 );
    } );

    app.get( '*',  function( req, res ) { res.status( 404 ).send('404'); } ); 

} 