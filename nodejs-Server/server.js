const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const IMAGE_FOLDER = path.join(__dirname, 'image');

app.use(cors());
app.use('/images', express.static(IMAGE_FOLDER));

// Ana sayfa - içinde buton ve JS ile rastgele resim getirme
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rastgele Resim Sunucusu</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        #randomImage { max-width: 90%; height: auto; margin-top: 20px; border: 1px solid #ccc; padding: 10px; }
        button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>Rastgele Resim Gösterici</h1>
      <button onclick="getRandomImage()">Rastgele Resim Getir</button>
      <div>
        <img id="randomImage" src="" alt="Burada rastgele resim gösterilecek">
      </div>

      <script>
        async function getRandomImage() {
          try {
            const res = await fetch('/random-image');
            if (!res.ok) throw new Error('Sunucu hatası');
            const data = await res.json();
            document.getElementById('randomImage').src = data.url;
          } catch (error) {
            alert('Sunucudan resim alınamadı.');
            console.error(error);
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Rastgele resim döndüren endpoint
app.get('/random-image', (req, res) => {
  fs.readdir(IMAGE_FOLDER, (err, files) => {
    if (err) return res.status(500).send('Sunucu hata verdi.');

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    if (imageFiles.length === 0) return res.status(404).send('Resim bulunamadı.');

    const random = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${random}`;
    res.json({ url: imageUrl });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu çalışıyor: http://ip-address:${PORT}`);
});