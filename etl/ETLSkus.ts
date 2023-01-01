import fs from "fs";
import papa from 'papaparse';
import mongoose from "mongoose";
import Log from "../lib/Log";
import { Sku } from "../database/mongo/Sku";
import { Style } from "../database/mongo/Styles";

const parseSkus = () => {

  const options = { header:true }
  const readStream = fs.createReadStream('./ETL/CSV/skus.csv');
  const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);
  let skuArr:iSku[] = [];

  readStream.pipe(parseStream);
  parseStream.on('data', (row:iSku) => {
    skuArr.push(row);

    if (skuArr.length === 100000) {
      Sku.insertMany(skuArr, (error) => {
        if (error) Log.error(error);
        else Log.info('Inserted 100000 SKUS')
      })
      skuArr = [];
    }
  })

  parseStream.on('end', () => {
    if (skuArr.length > 0) {
      Sku.insertMany(skuArr, (error) => {
        if (error) Log.error(error);
        else aggregate();
      })
    } else {
      aggregate();
    }
  })
}

const aggregate = () => {
  void Style.aggregate([{
    $lookup:
      {
        from: "skus",
        localField: "id",
        foreignField: "styleId",
        as: "skus"
      }
  },
  {
    $addFields: {
      skus: {
        $arrayToObject: {
          $map: {
            input: "$skus",
            as: "sku",
            in: {
              k: "$$sku.id",
              v: {
                size: "$$sku.size",
                quantity: "$$sku.quantity"
              }
            }
          }
      }
      }
    }
  }, {
    $out: 'styles'
  }])
}

mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://localhost/overview", { dbName: "Overview-DB" })
  .then(() => {
    Log.info("Connected to Overview-DB");
    parseSkus();
  })
  .catch((error: Error) => {
    Log.error(error);
  });