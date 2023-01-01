import express from "express";
import dotenv from "dotenv";
import Log from "../lib/Log";
import mongoose  from "mongoose";
import NodeCache from "node-cache";
import { Product } from "../database/mongo/Products";
import { Style } from "../database/mongo/Styles";

dotenv.config();
const app = express();
const myCache = new NodeCache();

// ------------------- CONNECT TO DATABASE -------------------------- //

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, { dbName: "Overview-DB" })
  .then(() => {
    Log.info("Connected to Overview-DB");
    startServer();
  })
  .catch((error: Error) => {
    Log.error(error);
  });

const startServer = () => {

  // ------------------- SERVER SETTINGS -------------------------- //

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // ------------------- CHECK CACHE -------------------------- //

  const verifyCache = (req, res, next) => {
    let productID = req.query.id;
    if (req.url.includes("styles")) {
      productID = "style" + productID;
    }

    try {
      if (myCache.has(productID)) {
        return res.send(myCache.get(productID));
      }
      return next();
    } catch (error) {
      throw new Error;
    }
  }

  // ------------------- ROUTES -------------------------- //

  app.get("/products", (req, res) => {
    const count = req.query.count ? Number(req.query.count) : 5;
    const page = (Number(req.query.page) - 1) * count;

    Product.find().skip(page).limit(count)
      .select({ _id: 0, features: 0 })
      .lean()
      .exec((error, products) => {
        if (error) {
          res.send(error);
        } else {
          res.send(products)
        }
      });
  });

  app.get("/products/:product_id", verifyCache, (req, res) => {
    const productID = Number(req.query.id);

    Product.find({ id: productID }, {}, { hint: "id_1" })
      .select({ _id: 0 })
      .lean()
      .exec((error, product) => {
        if (error) {
          res.send(error);
        } else {
          myCache.set(productID, product);
          res.send(product);
        }
      })
  });

  app.get("/products/:product_id/styles", verifyCache, (req, res) => {
    const productID = req.query.id;

    Style.find({ product_id: productID }, {}, { hint: "product_id_1" })
      .select({ _id: 0 })
      .lean()
      .exec((error, styles) => {
        if (error) {
          res.send(error);
        } else {
          myCache.set(`style${productID.toString()}`, styles);
          res.send(styles);
        }
      })
  });

  // ------------------- ERROR HANDLING -------------------------- //

  app.use((_req, res) => {
    const error = new Error("Server Error");
    Log.error(error);
    return res.status(404).json({ message: error });
  });

  // ------------------- MAKE SURE OUR SERVERS ON -------------------------- //

  app.listen(process.env.PORT, () => {
    Log.info("Overview API running on port " + process.env.PORT);
  });
};
