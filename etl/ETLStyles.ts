import fs from "fs";
import papa from 'papaparse';
import Log from "../lib/Log";
import mongoose from "mongoose";
import { Style } from "../database/mongo/Styles";

const parseStyles = () => {
  let styleData:iStyle[] = [];

  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, { header: true });
  const readStream = fs.createReadStream("./ETL/CSV/styles.csv");
  readStream.pipe(parsedStream);

  parsedStream.on("data", (row:iStyle) => {
    row.id = Number(row.id);
    const style = new Style(row);
    styleData.push(style);

    if (styleData.length === 10000) {
      Style.insertMany(styleData, (error) => {
        if (error) Log.error(error);
        else Log.info`Inserted 10000 documents into the 'styles' collection`;
      });
      styleData = [];
    }
  });

  parsedStream.on("end", () => {
    if (styleData.length > 0) {
      Style.insertMany(styleData, (error) => {
        if (error) Log.error(error);
        else Log.info`Inserted rest of documents into the 'styles' collection`;
      });
    }
  });
};

mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://localhost/overview", { dbName: "Overview-DB" })
  .then(() => {
    parseStyles();
  })
  .catch((error) => {
    Log.error(error);
  });
