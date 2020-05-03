import express from 'express';

import * as ner from './ner-adapter.js';
// import * as c from './config/config';
const app = express();
const port = 8082; // default port to listen

    const testPhrase:string = 'In Brentwood, Tennessee, the co-owners of Zen Nails have taken their efforts one step further.';
// define a route handler for the default home page
app.get( '/', ( req, res ) => {
    const awsret:any = ner.getEntities(testPhrase);
    res.send( JSON.stringify(awsret));
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port } ` + testPhrase);
} );