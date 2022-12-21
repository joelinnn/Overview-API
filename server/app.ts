import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('hello world');
})

app.listen( port, () => {
  console.log('Node server up and running at http://localhost:' + port);
})