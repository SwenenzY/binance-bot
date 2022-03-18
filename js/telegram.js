const TelegramBot = require('node-telegram-bot-api');
const binance = require('./binance.js');
const env = require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    let price = await binance.get_current_price( 'ATOMUSDT' );
    console.log( msg.chat.id );
    if ( msg.chat.id == process.env.SWZ_ID ) {
        if ( msg.text == "buy" ) {
            let amount = await binance.calculate_buy_amount( 'USDT', price );
            binance.buy_future( 'BTCUSDT', amount );
            send_message( `Bought BTCUSDT with ${amount} for ${price}`, msg.chat.id );
        }
        if ( msg.text == "sell" ) {
            let amount = await binance.get_coin_amount( 'BTC', price );
            binance.sell_future( 'BTCUSDT', amount );
            send_message( `Sold ${amount}x BTCUSDT for ${price}`, msg.chat.id );
        }
    }
    if ( msg.text == "price" ) {
        bot.sendMessage( msg.chat.id, `ATOMUSDT: ${price}` );
    }

    if( msg.text == "balance" ) {
        await binance.get_balances().then( balances => {
            for ( let key in balances ) {
                if(balances[key].available > 0){
                    bot.sendMessage( msg.chat.id , `${key}: ${balances[key].available}` );
                }
            }
        } );
    }

});

function send_message( message, id ) {
    bot.sendMessage( id ? id : process.env.SWZ_ID, message );
}

module.exports = {
    send_message
};