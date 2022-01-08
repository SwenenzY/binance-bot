const binance = require('./binance.js');
const telegram_bot = require('./telegram.js');

let usdt_price = 0; // % change
let last_price = 0; // last btc price

module.exports = function (app) {
    let buy_state = false;
    app.post( '/api/binance_trade', async function ( req,res ) {
        const { action } = req.body;
        let price = await binance.get_current_price( 'BTCUSDT' ); // get price from binance cuz have diff.
        var usdt_balance = await binance.get_balance('USDT');
        if ( action == 'VERIFY' ) {
            binance.set_state( !binance.get_state( ) );
        }
        if( binance.get_state( ) ) {
            // save prices on buy
            last_price = price;
            usdt_price = usdt_balance;

            let amount = await binance.calculate_buy_amount( 'USDT', price );
            binance.buy_coin( 'BTCUSDT', amount );
            telegram_bot.send_message( `Bought 'BTCUSDT' with ${amount} for ${price}` );

        } else {
            if ( price > 0.00020 ) { // btc price bigger than 0.00020
                // sell btc
                let amount = await binance.get_coin_amount( 'BTC' ); // get amount of btc
                binance.sell_coin( 'BTCUSDT', amount ); // sell btc
                // get usdt balance
                var usdt_balance = await binance.get_balance('USDT');
                let percent = binance.perc_increase( usdt_price, usdt_balance ); // get % change
                telegram_bot.send_message( `${last_price < price ? 'WIN' : 'LOSS'} (%${percent}) Sold 'BTCUSDT' with ${amount} for ${price}` );

                // reset prices
                last_price = 0;
                usdt_price = 0;
            }
        }

        res.sendStatus( 200 );
    } );

    app.get( '*',  function( req, res ) { res.status( 404 ).send('404'); } ); 

} 