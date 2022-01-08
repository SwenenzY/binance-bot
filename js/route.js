const binance = require('./binance.js');
const telegram_bot = require('./telegram.js');

module.exports = function (app) {
    let buy_state = false;
    app.post( '/api/binance_trade', async function ( req,res ) {
        const { action } = req.body;
        let price = await binance.get_current_price( 'BTCUSDT' ); // get price from binance cuz have diff.
        //var usdt_balance = await binance.get_balance('USDT');
        if ( action == 'VERIFY' ) {
            if( buy_state ) {
                buy_state = false;
            } else {
                buy_state = true;
            }
        }
        if( buy_state ) {
            //if ( price > 0.00020  ) {
                let amount = await binance.calculate_buy_amount( 'USDT', price );
                binance.buy_coin( 'BTCUSDT', amount );
                telegram_bot.send_message( `Bought 'BTCUSDT' with ${amount} for ${price}` );
                binance.set_state( false );
            //}
        } else{
            if ( price > 0.00020 ) {
                let amount = await binance.get_coin_amount( 'BTC' );
                binance.sell_coin( 'BTCUSDT', amount );
                telegram_bot.send_message( `Sold 'BTCUSDT' with ${amount} for ${price}` );
                binance.set_state( false );
            }
        }

        res.sendStatus( 200 );
    } );

    app.get( '*',  function( req, res ) { res.status( 404 ).send('404'); } ); 

} 