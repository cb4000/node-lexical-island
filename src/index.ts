import express from 'express';

import * as neraws from './ner-aws-adapter.js';
import * as nercc from './ner-cliff-clavin-adapter.js';
// import * as c from './config/config';
const app = express();
const port = 8082; // default port to listen
const createSummarizer = (results:any[],response:any, EXPECTED_RETURNS:number) =>
  (source:string, result: any) => {
    results.push({'source':source, 'result':result});
    if (results.length >= EXPECTED_RETURNS){
        response.send(results);
    }

};
    const testPhrase:string = 'In Brentwood, Tennessee, the co-owners of Zen Nails have taken their efforts one step further.';
// define a route handler for the default home page
app.get( '/', ( req, res ) => {
    const EXPECTED_RETURNS = 2;
    const count  = 0;
    const results = new Array();
    const summarizer = createSummarizer(results, res, EXPECTED_RETURNS);
    const ccret:any = nercc.getEntities(testPhrase, summarizer);
    const awsret:any = neraws.getEntities(testPhrase, summarizer);
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port } :` + testPhrase);
} );