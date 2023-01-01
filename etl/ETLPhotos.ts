import fs from "fs";
import papa from 'papaparse';
import Log from "../lib/Log";
import mongoose from "mongoose";
import { Photos } from "../database/mongo/Photos";
import { Style } from "../database/mongo/Styles";

const parsePhotos = () => {
  const options = { header:true }
  const readStream = fs.createReadStream('./ETL/CSV/photos.csv');
  const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);
  let photoBatch:iPhoto[] = [];

  readStream.pipe(parseStream);
  parseStream.on('data', (row:iPhoto) => {

    photoBatch.push(row);

    if (photoBatch.length === 100000) {
      void Photos.insertMany(photoBatch);
      Log.info(photoBatch.length);
      photoBatch = [];
    }
  })
  parseStream.on('end', () => {
    if (photoBatch.length > 0) {
      void Photos.insertMany(photoBatch);
    } else {
      void Style.aggregate([
        {
          $lookup: {
            from: "photos",
            localField: "id",
            foreignField: "styleId",
            as: "photos"
          },
          $out: "styles"
        }
      ])
    }
  })
}

mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://localhost/overview", { dbName: "Overview-DB" })
  .then(() => {
    Log.info("Connected to Overview-DB");
    parsePhotos();
  })
  .catch((error: Error) => {
    Log.error(error);
  });