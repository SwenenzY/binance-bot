const TelegramBot = require('node-telegram-bot-api');
const binance = require('./binance.js');
const env = require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    let price = await binance.get_current_price( 'BTCUSDT' );

    if ( msg.chat.id == process.env.SWZ_ID ) {
        if ( msg.text == "buy" ) {
            let amount = await binance.calculate_buy_amount( 'USDT', price );
            binance.buy_coin( 'BTCUSDT', amount );
            send_message( `Bought BTCUSDT with ${amount} for ${price}` );
        }
        if ( msg.text == "sell" ) {
            let amount = await binance.get_coin_amount( 'BTC', price );
            binance.sell_coin( 'BTCUSDT', amount );
            send_message( `Sold ${amount}x BTCUSDT for ${price}` );
        }
    }
    if ( msg.text == "price" ) {
        bot.sendMessage( msg.chat.id, `BTCUSDT: ${price}` );
    }

    if( msg.text == "balance" ) {
        await binance.get_balances().then( balances => {
            bot.sendMessage( msg.chat.id, `USDT: ${balances.USDT.available}` );
            bot.sendMessage( msg.chat.id, `BTC: ${balances.BTC.available}` );
        } );
    }

});

function send_message( message ) {
    bot.sendMessage( process.env.SWZ_ID, message );
}

module.exports = {
    send_message
};