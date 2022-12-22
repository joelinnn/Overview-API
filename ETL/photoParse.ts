import fs from 'fs';
import csv from 'csv-parser';
import { Photos } from '../DB/mongo/Photos';
require('../DB/mongo/db');

const parsePhotos = async () => {
  fs.createReadStream('./ETL/CSV/photos.csv')
    .pipe(csv())
    .on('data', async (data:object) => {
      await Photos.create(data);
    })
    .on('end', () => {
      console.log('Finished parsing photos');
    })
}

parsePhotos()
  .then(() => {
    console.log('Finished parsing photos')
  })
  .catch((error) => {
    console.log('Error parsing photos', error)
  })
// id === styleId