import fs from 'fs';
import csv from 'csv-parser';
import { Product } from '../DB/mongo/Products';
import { Features } from '../DB/mongo/Features';
import { Photos } from '../DB/mongo/Photos';
import { Sku } from '../DB/mongo/Sku';
import { Style } from '../DB/mongo/Styles';
require('../DB/mongo/db');


const parseProducts = () => {
  fs.createReadStream('./ETL/CSV/product.csv')
    .pipe(csv())
    .on('data', (data:object) => {
      void Product.create(data);
    })
    .on('end', () => {
      console.log('Finished parsing products')
    })
};

const parseFeatures = () => {
  fs.createReadStream('./ETL/CSV/features.csv')
    .pipe(csv())
    .on('data',  (data: object) => {
      void Features.create(data);
    })
    .on('end', () => {
      console.log('Finished parsing features')
    })
}

const parseStyles = () => {
  fs.createReadStream('./ETL/CSV/styles.csv')
    .pipe(csv())
    .on('data', (data:object) => {
      void Style.create(data);
    })
    .on('end', () => {
      console.log('Finished parsing styles')
    })
}

const parsePhotos = () => {
  fs.createReadStream('./ETL/CSV/photos.csv')
    .pipe(csv())
    .on('data', (data:object) => {
      void Photos.create(data);
    })
    .on('end', () => {
      console.log('Finished parsing photos')
    })
}


const parseSkus = () => {
  fs.createReadStream('./ETL/CSV/skus.csv')
    .pipe(csv())
    .on('data', (data:object) => {
      void Sku.create(data);
    })
    .on('end', () => {
      console.log('Finished parsing Skus')
    })
}


parseProducts();
parseFeatures();
parseStyles();
parsePhotos();
parseSkus();
