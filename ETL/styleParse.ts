import fs from 'fs';
import csv from 'csv-parser';
import { Style } from '../DB/mongo/Styles';
import { Photos } from '../DB/mongo/Photos';
import { Sku } from '../DB/mongo/Sku';

require('../DB/mongo/db');

const parseStyles = async () => {
  fs.createReadStream('./ETL/CSV/styles.csv')
    .pipe(csv())
    .on('data', async (data:object) => {
      await Style.create(data);
    })
    .on('end', () => {
      console.log('done1')
    })
}

const parsePhotos = async () => {
  fs.createReadStream('./ETL/CSV/photos.csv')
    .pipe(csv())
    .on('data', async (data:object) => {
      const styleID:string = data['styleId'];
      console.log(styleID)
      await Style.findOneAndUpdate( { id: styleID }, {$push: { photos: data }}, { new: true });
    })
    .on('end', () => {
      console.log('done2')
    })
}


const parseSkus = async () => {
  fs.createReadStream('./ETL/CSV/skus.csv')
    .pipe(csv())
    .on('data', async (data:object) => {
      const styleID:string = data['styleId'];
      const skuID:string = data['id'];
      await Style.findOneAndUpdate( { id: skuID }, { $set: { skuID: data }}, { new: true })
    })
}

parseStyles()
  .then(() => {
    console.log('Finished parsing styles');
    parsePhotos()
      .then(() => {
        console.log('Finished parsing photos');
        parseSkus()
          .then(() => {
            console.log('Finished adding Skus to styles');
          })
          .catch((error) => {
            console.log('Error adding Skus', error);
          });
      })
      .catch((error) => {
        console.log('Error parsing photos', error)
      });
  })
  .catch((error) => {
    console.log('Error parsing styles', error);
  });