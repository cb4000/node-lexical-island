
import AWS from 'aws-sdk';
import { constants } from 'perf_hooks';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';



import * as neraws from './ner-aws-adapter.js';
import * as nercc from './ner-cliff-clavin-adapter.js';

import redis  from 'redis';

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
        if ( response === 'null'){
            response.send(results);
        }
    }

};

export function watchForData():any{

    AWS.config.update({region: 'us-east-2'});
AWS.config.getCredentials((err) => {
    if (err) console.log(err.stack);
    // credentials not loaded
      console.log('Access key:', AWS.config.credentials.accessKeyId);
      console.log('Secret access key:', AWS.config.credentials.secretAccessKey);



      if (err) {
        alert('Error retrieving credentials.');
        console.error(err);
        return;
    }
    // create Amazon Kinesis service object
    const kinesis = new AWS.Kinesis({
        apiVersion: '2013-12-02'
    });

    /*
    // snippet-end:[kinesis.JavaScript.kinesis-example.config]
    const response = kinesis.getShardIterator("fact-bi-poc",
        self.shard_id, self.iterator_type)

    next_iterator = response['fact-bi-poc']
    kinesis.getRecords({},(err, data)=> {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });

    */
kinesis.describeStream({
  StreamName: 'fact-bi-poc'
}, (erra, streamData)=> {

  if (erra) {
    console.log(erra, erra.stack); // an error occurred
  } else {
    console.log(streamData); // successful response
    streamData.StreamDescription.Shards.forEach(shard => {
      kinesis.getShardIterator({
        ShardId: shard.ShardId,
        ShardIteratorType: 'LATEST',
        StreamName: 'fact-bi-poc'
      }, (errb, shardIteratordata) => {
        if (errb) {
          console.log(errb, errb.stack); // an error occurred
        } else {
          console.log(shardIteratordata); // successful response

// An interval
setInterval(()=> {
    console.log('I am an interval');
    kinesis.getRecords({
        ShardIterator: shardIteratordata.ShardIterator
      }, (errc, recordsData) => {
        if (errc) {
          console.log(errc, errc.stack); // an error occurred
        } else {
          console.log(recordsData); // successful response
          recordsData.Records.forEach( (rec)=> {
            const payload = rec.Data.toString('ascii');
            console.log('Decoded payload:', payload);
            const EXPECTED_RETURNS = 1;
    const results = new Array();
    const summarizer = createSummarizer(results, null, EXPECTED_RETURNS, payload);
    const ccret:any = nercc.getEntities(payload, summarizer);
    const awsret:any = neraws.getEntities(payload, summarizer);
          });
        }
        shardIteratordata.ShardIterator = recordsData.NextShardIterator;
      });
}, 5000);



        }
      });
    });
  }
});
});
}