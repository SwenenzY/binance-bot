const Binance = require('node-binance-api');
var env = require('dotenv').config();

const binance = new Binance().options({
    APIKEY: process.env.BINANCE_TOKEN,
    APISECRET: process.env.BINANCE_SECRET
});

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
module.exports = {
    get_balances
};