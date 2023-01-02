import fs from "fs";
import papa from "papaparse";
import Log from "../lib/Log";
import { Product } from "../database/mongo/Products";
import mongoose from "mongoose";


const parseProducts = () => {
  const productData = [];
  const readStream = fs.createReadStream("./etl/CSV/product.csv");
  const options = { header: true };
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, options);
  readStream.pipe(parsedStream);

  parsedStream.on("data", (row) => {
    Log.info(row);
    productData.push(row);
  });

  parsedStream.on("end", () => {
    void Product.insertMany(productData);
    Log.info("Done");
  });
};

mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://localhost/overview", { dbName: "Overview-DB" })
  .then(() => {
    Log.info("Connected to Overview-DB");
    parseProducts();
  })
  .catch((error: Error) => {
    Log.error(error);
  });
