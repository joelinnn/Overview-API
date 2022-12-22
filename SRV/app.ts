import express from 'express';
import dotenv from 'dotenv';
require('../DB/mongo/db');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('hello world');
})

app.listen( port, () => {
  console.log('Overview API running on port ' + port);
})