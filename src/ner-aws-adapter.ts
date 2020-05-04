// import entire SDK
import AWS from 'aws-sdk';
import { config } from './config/config'

const c = config.dev;
// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
type AggregatorReturn = (source: string, result:any)=>void;

AWS.config.credentials = credentials;
AWS.config.update({region:'us-east-1'});
const  comprehend = new AWS.Comprehend();
let callback:AggregatorReturn;

/* getEntities get the named entities
 * @Params
 *    text: string - the text to be analyzed
 * @Returns:
 *    the the ner object
 */
const  handleAWSComprehendReturn = async(err:any, data:any) => {
    const locations = new Array();
    if (err){ console.log(err, err.stack); // an error occurred

      console.log('aws error');
        return {};
    }else   {
        console.log(data);
        // successful response
        if (data !== 'undefined' && data.Entities !== 'undefined'){
            for (const entry of data.Entities) {
                if(entry.Type==='LOCATION'){
                    locations.push({'name':entry.Text, 'confScore': entry.Score})
                }
            }
        }
        callback('aws-comprehend',locations);

    }
}

export function getEntities( text: string  , _callback: AggregatorReturn): any{
    const  params = {
        LanguageCode: 'en', /* required */
        Text: text /* required */
      };
      callback = _callback;
 comprehend.detectEntities(params, handleAWSComprehendReturn);
}