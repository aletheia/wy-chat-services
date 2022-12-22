import {SSM} from 'aws-sdk';
import {config as dconfig} from 'dotenv';
import {
  envToParameterStore,
  parameterStoreToConfigObject,
} from '../../waylon-commons-lib/src/config';

const keyList = [
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_API_URL',
  'LOG_LEVEL',
  'SERVICE_NAME',
];

(async () => {
  const ssm = new SSM({region: 'eu-west-1'});
  dconfig();
  console.log('Loading variables into SSM...');
  const params = await envToParameterStore(keyList, 'waychat', 'dev', ssm);
  console.log('Loaded variables into SSM:', params);

  console.log('Loading variables from SSM...');
  const config = await parameterStoreToConfigObject(
    Object.keys(params),
    'waychat',
    'dev',
    ssm
  );
  console.log('Loaded variables from SSM:', config);
})();
