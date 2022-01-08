var express   = require( 'express' ), 
        app   = express( );
const parser  = require( 'body-parser' );
const cors    = require( "cors" );

//
app.use( cors(  ) );
app.use( parser.json(  ) );
app.use( parser.urlencoded( { extended: true, } ));

app.listen( 80 );

const binance           = require('./js/binance.js');
const router_controller = require('./js/route.js');
const telegram_bot      = require('./js/telegram.js');

// Post Handler
router_controller( app );

( async (  ) => {

    const usdt_balance = await binance.get_balance('USDT');

    telegram_bot.send_message( "Bot activated. USDT balance : " + usdt_balance, process.env.SWZ_ID );

    console.log( usdt_balance );

} )(  );