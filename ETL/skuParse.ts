import fs from 'fs';
import csv from 'csv-parser';
import { Sku } from '../DB/mongo/Sku';
require('../DB/mongo/db');

const parseSkus = async () => {
  fs.createReadStream('./ETL/CSV/skus.csv')
    .pipe(csv())
    .on('data', async (data:object) => {
      await Sku.create(data)
    })
}

parseSkus()
  .then(() => {
    console.log('Finished parsing styles');
  })
  .catch((error) => {
    console.log('Error parsing styles', error);
  });