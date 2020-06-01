import express from 'express';

import * as neraws from './ner-aws-adapter.js';
import * as nercc from './ner-cliff-clavin-adapter.js';

import redis  from 'redis';
// import * as c from './config/config';
const app = express();
const port = 8082; // default port to listen
const createSummarizer = (results:any[],response:any, EXPECTED_RETURNS:number, textPhrase:string) =>
  (source:string, result: any) => {
    results.push({'source':source, 'result':result});
    if (results.length >= EXPECTED_RETURNS){
// write to redis then send result to client
// TODO, just send client 'ok'
        const publisher = redis.createClient({'host':process.env.REDIS_HOST,'port':6379});
        publisher.publish('notification', JSON.stringify(
                {'message':{'text':textPhrase, 'results':results}}
            ), ()=>{
        console.log('published');
    });
        response.send(results);
    }

};
    const testPhrase:string = 'In Brentwood, Tennessee, the co-owners of Zen Nails have taken their efforts one step further.';
// define a route handler for the default home page

app.get( '/test/', ( req, res ) => {
    const EXPECTED_RETURNS = 2;
    const count  = 0;
    const results = new Array();
    const summarizer = createSummarizer(results, res, EXPECTED_RETURNS, testPhrase);
    const ccret:any = nercc.getEntities(testPhrase, summarizer);
    const awsret:any = neraws.getEntities(testPhrase, summarizer);
} );


app.post('/api/', (req, res) =>{

    console.log(req.body);
    const searchTerm = req.body.textData;
    const EXPECTED_RETURNS = 2;
    const count  = 0;
    const results = new Array();
    const summarizer = createSummarizer(results, res, EXPECTED_RETURNS, searchTerm);
    const ccret:any = nercc.getEntities(searchTerm, summarizer);
    const awsret:any = neraws.getEntities(searchTerm, summarizer);
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port } :` + testPhrase);
} );