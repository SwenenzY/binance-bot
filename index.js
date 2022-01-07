var express = require( 'express' ), app = express( );
const parser = require("body-parser");
const cors = require("cors");

//
app.use(cors());
app.use(parser.json());
app.use(
    parser.urlencoded({
        extended: true,
    })
);

app.listen( 80 );

const binance = require('./js/binance.js');
const router_controller = require('./js/route.js');

// Post Handler
router_controller( app );

( async (  ) => {

    console.log( "Starting... " );
    const balances = await binance.get_balances();

    console.log( balances['USDT'] );
} )(  );