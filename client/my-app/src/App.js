import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
 import './App.css';
import UploadImage from './components/UploadImage';
    

function App() {
  
  return (
    < Container maxWidth="md">
     <UploadImage/>
    </Container>
  );
}

export default App;
