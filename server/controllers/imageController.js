const Image = require('../models/Image');

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: 'desc' });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const deletedImage = await Image.findByIdAndDelete(imageId);
    if (deletedImage) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }
    const newImage = new Image({ imageUrl: req.file.path, title: req.file.originalname });
    await newImage.save();
    res.status(201).json({ image: newImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFavroutie = async (req, res) => {
  try {
    const imageId = req.params.id;
    const { favroutie } = req.body;  

     const updatedImage = await Image.findByIdAndUpdate(
      imageId,
      { favroutie },
      { new: true }  
    );

    if (updatedImage) {
      res.json({ image: updatedImage });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 

