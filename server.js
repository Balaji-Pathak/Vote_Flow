const express = require('express');
const app = express();
const db = require("./db");
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })