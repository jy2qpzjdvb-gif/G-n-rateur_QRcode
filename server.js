const express = require('express');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware : rend les données du formulaire lisibles dans req.body
app.use(express.urlencoded({ extended: true }));

// Route GET : affiche la page avec le formulaire
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route POST : reçoit l'URL et renvoie le QR code
app.post('/genererQr', async (req, res) => {
    const url = req.body.url;
    const qrimage = await qrcode.toDataURL(url);
    res.send(`
        <h1>QR code pour : ${url}</h1>
        <img src="${qrimage}">
        <br><a href="/">Retour</a>
    `);
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});