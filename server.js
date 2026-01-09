require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/utils/db');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});