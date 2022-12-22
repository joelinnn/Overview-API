import fs from 'fs';
import csv from 'csv-parser';
import { Product } from '../DB/mongo/Products';
require('../DB/mongo/db');

const parseProducts = async () => {
  fs.createReadStream('./ETL/CSV/product.csv')
    .pipe(csv())
    .on('data', async (data:object) => {
      await Product.create(data);
    })
    .on('end', () => {
      return;
    })
};

const parseFeatures = async () => {
  fs.createReadStream('./ETL/CSV/features.csv')
    .pipe(csv())
    .on('data', async (data: object) => {
      const productId:string = data['product_id'];
      await Product.findOneAndUpdate( { id: productId }, {$push: { features : data }}, { new: true });
    })
    .on('end', () => {
      return;
    })
}

parseProducts()
  .then(() => {
    parseFeatures()
      .catch((error) => {
        console.log('Error parsing features', error)
      });
  })
  .catch((err) => {
    console.log('Error parsing products', err);
  });