const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('تم الاتصال بقاعدة بيانات MongoDB بنجاح');
    app.listen(PORT, () => {
      console.log(`الخادم يعمل الآن على المنفذ: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('فشل الاتصال بقاعدة البيانات:', err);
  });