# Générateur de QR code avec Node.js et Express

## 1. Présentation

Ce projet est une petite application web qui génère le **QR code d'une URL**.

L'utilisateur ouvre une page HTML, saisit une URL dans un formulaire, clique sur « Générer », et le serveur lui renvoie une page affichant le QR code correspondant.

**Technologies utilisées :**

- **Node.js** : permet d'exécuter du JavaScript côté serveur (back-end)
- **Express** : framework Node.js qui simplifie la création d'un serveur et des routes
- **qrcode** : package npm qui transforme un texte (ici une URL) en image de QR code
- **HTML** : pour la page contenant le formulaire


## 2. Structure du projet


generateur-qr/
├── server.js        # Le serveur Express (routes, logique)
├── index.html       # La page avec le formulaire
├── package.json     # Informations du projet et dépendances
├── .gitignore       # Fichiers à ne pas envoyer sur GitHub
└── README.md        # Ce fichier



## 3. Étapes de réalisation

### Étape 1 : Créer le dossier du projet

```bash
mkdir generateur-qr
cd generateur-qr
```

On crée un dossier à part pour le projet et on se place dedans.

### Étape 2 : Initialiser le projet npm

```bash
npm init -y
```

Cette commande crée le fichier `package.json`, qui contient les informations du projet (nom, version) et la liste des packages installés. 

### Étape 3 : Installer les dépendances

```bash
npm install express qrcode
```

- `express` : le framework pour créer le serveur
- `qrcode` : la bibliothèque qui génère le QR code

Cette commande crée le dossier `node_modules` (contenant le code des packages) et ajoute les deux dépendances dans `package.json`.

### Étape 4 : Créer la page HTML (`index.html`)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Générateur de QR code</title>
</head>
<body>
    <h1>Générateur de QR code</h1>
    <form action="/genererQr" method="post">
        <input type="url" name="url" placeholder="https://exemple.com" required>
        <button type="submit">Générer</button>
    </form>
</body>
</html>
```

**Explication :**

- `<form action="/genererQr" method="post">` : quand on clique sur le bouton, le navigateur envoie les données du formulaire à la route `/genererQr` du serveur, avec la méthode **POST**.
- `method="post"` : les données sont envoyées dans le corps de la requête (et non dans l'URL, comme avec GET). C'est la méthode adaptée à l'envoi d'un formulaire.
- `<input type="url" name="url">` : le champ de saisie. Le type `url` fait vérifier au navigateur que le texte ressemble à une URL. L'attribut **`name="url"` est essentiel** : c'est lui qui permet au serveur de retrouver la valeur saisie (`req.body.url`).
- `required` : empêche d'envoyer le formulaire vide.

### Étape 5 : Créer le serveur (`server.js`)

```javascript
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
```

### Étape 6 : Lancer l'application

```bash
node server.js
```

Le terminal affiche : `Serveur démarré sur http://localhost:3000`. On ouvre ensuite cette adresse dans le navigateur.

### Étape 7 : Tester

1. Ouvrir `http://localhost:3000`
2. Saisir une URL, par exemple `https://www.google.com`
3. Cliquer sur « Générer »
4. Le QR code s'affiche. On peut le scanner avec un téléphone pour vérifier qu'il mène bien vers l'URL saisie.

---

## 5. Explication détaillée du code

### 5.1 Les imports

```javascript
const express = require('express');
const qrcode = require('qrcode');
const path = require('path');
```

`require` permet d'importer un module pour l'utiliser dans le fichier.

- `express` et `qrcode` sont des packages installés avec npm.
- `path` est un module **intégré à Node.js** (aucune installation nécessaire). Il sert à manipuler les chemins de fichiers.

### 5.2 Création de l'application

```javascript
const app = express();
const PORT = 3000;
```

`express()` crée l'application serveur, stockée dans `app`. Toutes les routes et tous les réglages passeront par cet objet. `PORT` est le numéro de la « porte » sur laquelle le serveur écoute.



### 5.3 Démarrage du serveur

```javascript
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

`app.listen` démarre le serveur et le met à l'écoute sur le port 3000. La fonction passée en second paramètre s'exécute une fois le serveur démarré, ce qui permet d'afficher un message de confirmation.

---

## 6. Schéma du fonctionnement

```
1. Le navigateur demande  GET /           → le serveur renvoie index.html
2. L'utilisateur saisit une URL et clique sur « Générer »
3. Le navigateur envoie   POST /genererQr (données du formulaire)
4. Le middleware urlencoded range les données dans req.body
5. La route récupère req.body.url
6. qrcode.toDataURL(url) génère l'image du QR code
7. Le serveur renvoie une page HTML contenant le QR code
```



## 9. Difficultés rencontrées et ce que j'ai appris

- Utiliser **POST** plutôt que GET pour envoyer les données d'un formulaire
- Comprendre le rôle d'un **middleware** et pourquoi `req.body` est vide sans lui
- Comprendre **`async` / `await`** pour gérer les opérations asynchrones
- Faire la différence entre `req` (ce que le serveur reçoit) et `res` (ce qu'il renvoie)
