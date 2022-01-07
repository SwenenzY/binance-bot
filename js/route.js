const binance = require('./binance.js');
const telegram_bot = require('./telegram.js');

module.exports = function (app) {

    app.post( '/api/binance_trade', async function ( req,res ) {
        const { coin, action, price } = req.body;
        price = binance.get_current_price( coin ); // get price from binance cuz have diff.
        
        if( action === 'BUY' ) {
            let amount = await binance.calculate_buy_amount( 'USDT', price );
            binance.buy_coin( coin, amount );
            telegram_bot.send_message( `Bought ${coin} with ${amount} for ${price}` );
            
        } else if( action === 'SELL' ) {
            let amount = await binance.get_coin_amount( 'BTC', price );
            binance.sell_coin( coin, amount );
            telegram_bot.send_message( `Sold ${amount}x ${coin} for ${price}` );
        }

        res.sendStatus( 200 );
    } );

    app.get( '*',  function( req, res ) { res.status( 404 ).send('404'); } ); 

} 