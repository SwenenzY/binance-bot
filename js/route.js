const telegram_bot = require('./telegram.js');

module.exports = function (app) {

    app.post( '/api/binance_trade', async function ( req,res ) {
        const { coin, action, price } = req.body;
        telegram_bot.send_message(`🤖 [${action}] An order to ${coin}, ${price} was sent to Binance Bot.`);

        res.sendStatus( 200 );
    } );

    app.get( '*',  function( req, res ) { res.status( 404 ).send('404'); } ); 

} 