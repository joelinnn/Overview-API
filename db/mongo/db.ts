import dotenv from 'dotenv';
import { connect, set, connection } from 'mongoose';

dotenv.config();

run().catch(err => console.log(err));

async function run() {
  set('strictQuery', false);
  await connect('mongodb://localhost/overview', {dbName: 'Overview-DB'});
  console.log('Successfully connected to Mongo');
}

export const db = connection;