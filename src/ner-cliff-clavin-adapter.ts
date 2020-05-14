// import entire SDK
import axios = require('axios');
import { stringify } from 'querystring';
import { config } from './config/config'
const c = config;
type AggregatorReturn = (source: string, result:any)=>void;

    const envType:string = c.envType;

    const configuration:any = c;
    console.log(JSON.stringify(configuration));
    // const serviceMap:any = envType==='standAlone'?c.standAlone.cliffLocation:
    // envType==='dockerCompose':c.dockerCompose.cliffLocation:
    // c.kubernetes.cliffLocation;
    let cliffLocation:string;
    if (envType==='standAlone'){
      cliffLocation = configuration.standAlone.cliffLocation;
    }else if(envType==='dockerCompose'){
      cliffLocation = c.dockerCompose.cliffLocation;
    }else{
      cliffLocation = c.kubernetes.cliffLocation;
    };
const url:string = `http://`+cliffLocation+`/cliff-2.6.1/parse/text?q=`;

export function getEntities( text: string  , _callback: AggregatorReturn): any{
  const callback:AggregatorReturn = _callback;
  const locations = new Array();
// Make a request for a user with a given ID
console.log(url+encodeURIComponent(text));
const a =   axios.default.get(url+text)
  .then( (response: any) =>{
    // handle success
    console.log(response.data);

    if(typeof response !== 'undefined' && typeof response.data !== 'undefined'&&
     typeof response.data.results !== 'undefined'&& typeof response.data.results.places !== 'undefined'&&
     typeof response.data.results.places.mentions !== 'undefined'){
        for (const entry of response.data.results.places.mentions) {
          console.log('push');
                locations.push(
                  {'name':entry.name,
                  'lat':entry.lat,
                  'long': entry.lon,
                  'confScore': entry.confidence
                });
        }

    }else{
      console.log('no locations');
    }
  })
  .catch( (error: any) => {
    // handle error
    console.log(error);
  })
  .finally( ()=> {
    callback('local-cliff',locations);
    // always executed;
  });

}