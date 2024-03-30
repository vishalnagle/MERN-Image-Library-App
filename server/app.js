const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const imageRoutes = require('./routes/imageRoutes');
const path = require('path');
const app = express();
const Image = require('./models/Image');


mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(bodyParser.json());
app.use(cors());

app.use('/api/images', imageRoutes);


app.use('/upload', express.static(path.join(__dirname, 'uploads')));

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/my-app/src/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), async (req, res) => {
  const { userTitle } = req.body;
  const newImage = new Image({ imageUrl: req.file.path, title: req.file.originalname.trim(), userTitle: userTitle });
  await newImage.save();
  res.status(201).json({ image: newImage });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 