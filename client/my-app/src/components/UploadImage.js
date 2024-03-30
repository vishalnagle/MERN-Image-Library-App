import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Button, TextField, Select, MenuItem } from '@mui/material';
const API_URL = 'http://localhost:5000/api/images';

const UploadImage = () => {
  const [images, setImages] = useState([]);
  const [uploadOption, setUploadOption] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImage, setShowImage] = useState([])

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/getImages`);
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  const deleteImage = async (imageId) => {
     try {
      const response = await fetch(`${API_URL}/deleteImage/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      const data = await response.json();
      fetchImages(); // Refresh images after successful deletion
    } catch (error) {
      console.error('Error deleting image:', error.message);
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() !== '' && ((uploadOption === 'file' && imageFile) || (uploadOption === 'url' && imageUrl.trim() !== ''))) {
      if (uploadOption === 'file') {
        const formData = new FormData();
         formData.append('file', imageFile);
        formData.append('title', title);
        formData.append('userTitle', title);
        try {
          const response = await fetch("http://localhost:5000/upload", {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          setShowImage(data)
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
      setImageUrl('');
      setTitle('');
      setImageFile(null);
      setImagePreview(null);
    }
  };
  const toggleFavorite = async (imageId, favorites) => {
    const newFavValue = !favorites;
    try {
      const response = await fetch(`${API_URL}/favimages/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favroutie: newFavValue }),
      });
      const data = await response.json();
      fetchImages();
    } catch (error) {
      console.error('Error updating favroutie:', error);
    }

  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" style={{fontWeight:'700px',margin:"20px"}}>
        Image Library App
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Select
              value={uploadOption}
              onChange={(e) => setUploadOption(e.target.value)}
              fullWidth
            >
              <MenuItem value="file">Upload File</MenuItem>
            </Select>
          </Grid>
          {uploadOption === 'url' ? (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                fullWidth
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={4}  >
              <input type="file" accept="image/*" style={{ height: '30px', fontSize: 'large', marginLeft: '20px' }} onChange={handleFileChange} />
            </Grid>
          )}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {imagePreview && (
              <div>
                <Typography variant="body2">Image Preview:</Typography>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '5px' }} />
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Add Image
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {images.map((image, index) => (

          <Grid item key={image.id} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                src={require(`../images/${image.title}`)}
                alt={image.title}
              />
              <CardContent>
                <Typography variant="h6">{image.userTitle}</Typography>
                <Button
                  style={{ padding: '10px', width: "165px", margin: "5px 0px 5px 0px" }}
                  variant={image.favroutie ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => toggleFavorite(image._id, image.favroutie)}
                >
                  Favorite
                </Button>
                <Button variant="outlined" color="error" style={{ padding: '10px', width: "165px", marginTop: "5px" }} onClick={() => deleteImage(image._id)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UploadImage;
