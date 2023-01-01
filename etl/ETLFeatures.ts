import Log from "../lib/Log";
import fs from "fs";
import papa from 'papaparse';
import mongoose from "mongoose";
import { Product } from "../database/mongo/Products";

const parseFeatures = () => {
  const options = { header: true };
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, options);
  const readStream = fs.createReadStream("./ETL/CSV/features.csv");
  const featureBatch:batchItems[] = [];

  readStream.pipe(parsedStream);
  parsedStream.on("data", (row: iFeature) => {
    const feature = {
      feature: row.feature,
      value: row.value,
    };
    featureBatch.push({
      updateOne: {
        filter: { id: row.product_id },
        update: { $push: { features: feature } },
        hint: 'id_1',
      }
    })
  });
  parsedStream.on("end", () => {
     void Product.bulkWrite(featureBatch);
  });
};

mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://localhost/overview", { dbName: "Overview-DB" })
  .then(() => {
    Log.info("Connected to Overview-DB");
    parseFeatures();
  })
  .catch((error: Error) => {
    Log.error(error);
  });