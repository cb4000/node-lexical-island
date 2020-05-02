// import entire SDK
import AWS from 'aws-sdk';
import { config } from './config/config'

const c = config.dev;
// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.update({region:'us-east-1'});
const  comprehend = new AWS.Comprehend();

/* getEntities get the named entities
 * @Params
 *    text: string - the text to be analyzed
 * @Returns:
 *    the the ner object
 */
const  handleAWSComprehendReturn = async(err:any, data:any) => {
    if (err){ console.log(err, err.stack); // an error occurred
        return {};
    }else   {
        console.log(data);
        // successful response
        return data

    }
}

export function getEntities( text: string ): any{
    const  params = {
        LanguageCode: 'en', /* required */
        Text: text /* required */
      };

    comprehend.detectEntities(params, handleAWSComprehendReturn);
}