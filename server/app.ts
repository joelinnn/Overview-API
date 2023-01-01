import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Log from "../lib/Log";
import { Product } from "../database/mongo/Products";
import { Style } from "../database/mongo/Styles";

dotenv.config();
const app = express();

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
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // ------------------- ROUTES -------------------------- //

  app.get("/products", (req, res) => {
    const count = req.query.count ? Number(req.query.count) : 5;
    const page = (Number(req.query.page) - 1) * count;

    Product.find({}, { _id: 0, features: 0 })
      .skip(page)
      .limit(count)
      .lean()
      .exec((error, products) => {
        if (error) {
          res.send(error);
        } else {
          res.send(products)
        }
      });
  });

  app.get("/products/:product_id", (req, res) => {
    const productID = Number(req.query.id);

    Product.find({ id: productID }, { _id: 0 }, { hint: "id_1" })
      .lean()
      .exec((error, product) => {
        if (error) {
          res.send(error);
        } else {
          res.send(product);
        }
      })
  });

  app.get("/products/:product_id/styles", (req, res) => {
    const productID = req.query.id;

    Style.find({ product_id: productID }, { _id: 0 }, { hint: "product_id_1" })
      .lean()
      .exec((error, styles) => {
        if (error) {
          res.send(error);
        } else {
          res.send(styles);
        }
      })
  });

  // app.put("/products/:product_id", async (req, res) => {
  //   try {
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });

  // ------------------- ERROR HANDLING -------------------------- //
  app.use((req, res) => {
    const error = new Error("Server Error");
    Log.error(error);
    return res.status(404).json({ message: error });
  });

  // ------------------- MAKE SURE OUR SERVERS ON -------------------------- //
  app.listen(process.env.PORT, () => {
    Log.info("Overview API running on port " + process.env.PORT);
  });
};
