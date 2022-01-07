const binance = require('./js/binance.js');

( async (  ) => {

    console.log( "Starting... " );
    const balances = await binance.get_balances();

    console.log( balances['BTC'] );
} )(  );