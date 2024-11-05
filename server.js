const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
require('dotenv').config(); // Load environment variables

// Connect to MongoDB using the connection string in .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

// Start the server on the specified port
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
