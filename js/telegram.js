const TelegramBot = require('node-telegram-bot-api');
const env = require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const swz = 809970042;

bot.on('message', (msg) => {
    //console.log( " Message : " + msg.text );
});

function send_message( message ) {
    bot.sendMessage( process.env.SWZ_ID, message );
}

module.exports = {
    send_message
};