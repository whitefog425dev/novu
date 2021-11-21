import * as dotenv from 'dotenv';
import * as envalid from 'envalid';
import { str, url, port, ValidatorSpec } from 'envalid';

dotenv.config();

let path;
switch (process.env.NODE_ENV) {
  case 'prod':
    path = `${__dirname}/../.env.production`;
    break;
  case 'test':
    path = `${__dirname}/../.env.test`;
    break;
  case 'ci':
    path = `${__dirname}/../.env.ci`;
    break;
  case 'local':
    path = `${__dirname}/../.env.local`;
    break;
  case 'dev':
    path = `${__dirname}/../.env.development`;
    break;
  default:
    path = `${__dirname}/../.env.local`;
}
//
const { error } = dotenv.config({ path });
if (error && !process.env.LAMBDA_TASK_ROOT) throw error;
