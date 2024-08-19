const express = require('express');
const cors = require('cors');
const { put } = require('@vercel/blob');
require('dotenv').config(); // Load environment variables from .env file
const multer = require('multer'); // Import multer

const app = express();
const port = 3000;

const corsOptions = {
  origin: '*', // Replace with your frontend URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json()); // Add this line to parse JSON request bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/test', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const fileBuffer = req.file.buffer;
    const originalFilename = req.file.originalname;
    const username = req.body.username; // Get the username from the request body

    // Construct the filename to include the username in its path
    const filename = `${username}/${originalFilename}`;
    // Upload the file to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      token: "vercel_blob_rw_Ur19PN0EEg4gh0Uj_jcYcLuPbSNV0SZNj98LwB26YWPGAQA",
    });

    console.log(blob); // Log the blob information

    // Respond with the blob URL
    res.send({ message: 'File uploaded successfully', blobUrl: blob.url, username });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    res.status(500).send('Error uploading file');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
