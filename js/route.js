
module.exports = function (app) {

    app.post( '/api/binance_api', async function ( req,res ) {
        const { coin, action, price } = req.body;

        res.sendStatus( 200 );
    } );

    app.get( '*',  function( req, res ) { res.status( 404 ).send('404'); } ); 

} 