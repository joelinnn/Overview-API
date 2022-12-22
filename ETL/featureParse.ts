import fs from 'fs';
import csv from 'csv-parser';
import { Features } from '../DB/mongo/Features';
import { Product } from '../DB/mongo/Products';
require('../DB/mongo/db');

const parseFeatures = async () => {
  fs.createReadStream('./ETL/CSV/features.csv')
    .pipe(csv())
    .on('data', async (data: object) => {
      const productId: string = data['product_id'];
      await Product.findOneAndUpdate( { id: productId }, {$push: { features : data }}, { new: true })
    })
}

parseFeatures()
  .then(() => {
    console.log('Finished parsing features')
  })
  .catch((error) => {
    console.log('Error parsing features', error)
  });