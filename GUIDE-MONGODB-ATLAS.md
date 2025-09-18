# 🗄️ Guide MongoDB Atlas - Sorbo Ingénierie

## 🚀 Configuration MongoDB Atlas

### 1. **Créer un compte MongoDB Atlas**
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Cliquez sur "Try Free"
3. Créez votre compte
4. Choisissez le plan "Free" (M0)

### 2. **Configurer le cluster**
1. Choisissez AWS, Google Cloud ou Azure
2. Sélectionnez une région proche (Europe)
3. Choisissez M0 Sandbox (gratuit)
4. Nommez votre cluster : `sorbo-ingenierie-cluster`

### 3. **Créer un utilisateur**
1. Username: `sorbo-admin`
2. Password: `VotreMotDePasseSecurise123!`
3. Role: `Atlas admin`

### 4. **Configurer l'accès réseau**
1. Allez dans "Network Access"
2. Cliquez "Add IP Address"
3. Choisissez "Allow Access from Anywhere" (0.0.0.0/0)

### 5. **Obtenir l'URI de connexion**
1. Cliquez sur "Connect" dans votre cluster
2. Choisissez "Connect your application"
3. Sélectionnez "Node.js" et version "4.1 or later"
4. Copiez l'URI

## 🔧 Configuration du projet

### 1. **Installer les dépendances**
```bash
cd backend
npm install
```

### 2. **Créer le fichier .env**
Copiez le contenu de `env-example.txt` vers `.env` et remplacez l'URI :

```env
MONGODB_URI=mongodb+srv://sorbo-admin:VotreMotDePasseSecurise123!@cluster0.xxxxx.mongodb.net/sorbo-ingenierie?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
ADMIN_TOKEN=admin123
```

### 3. **Démarrer le serveur**
```bash
npm run dev
```

### 4. **Tester l'API**
```bash
node test-mongodb.js
```

## 📊 Interface d'administration

### Routes disponibles :

**Actualités :**
- `GET /api/admin/actualites` - Liste
- `POST /api/admin/actualites` - Créer
- `PUT /api/admin/actualites/:id` - Modifier
- `DELETE /api/admin/actualites/:id` - Supprimer

**Logiciels :**
- `GET /api/admin/logiciels` - Liste
- `POST /api/admin/logiciels` - Créer
- `PUT /api/admin/logiciels/:id` - Modifier
- `DELETE /api/admin/logiciels/:id` - Supprimer

**Emplois :**
- `GET /api/admin/emplois` - Liste
- `POST /api/admin/emplois` - Créer
- `PUT /api/admin/emplois/:id` - Modifier
- `DELETE /api/admin/emplois/:id` - Supprimer

**Formations :**
- `GET /api/admin/formations` - Liste
- `POST /api/admin/formations` - Créer
- `PUT /api/admin/formations/:id` - Modifier
- `DELETE /api/admin/formations/:id` - Supprimer

**Statistiques :**
- `GET /api/admin/stats` - Statistiques générales

### Authentification :
Ajoutez le header : `Authorization: Bearer admin123`

## 🎯 Exemples d'utilisation

### Créer une actualité :
```bash
curl -X POST http://localhost:5000/api/admin/actualites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "titre": "Nouvelle formation AutoCAD",
    "contenu": "Contenu de l'actualité...",
    "resume": "Résumé de l'actualité",
    "categorie": "formation",
    "statut": "publie"
  }'
```

### Créer un logiciel :
```bash
curl -X POST http://localhost:5000/api/admin/logiciels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "nom": "AutoCAD 2024",
    "description": "Logiciel de CAO professionnel",
    "categorie": "autocad",
    "prix": 150000,
    "disponible": true
  }'
```

## ✅ Votre backend est maintenant prêt !

- ✅ MongoDB Atlas configuré
- ✅ API REST complète
- ✅ Routes d'administration
- ✅ Tests automatisés
- ✅ Modèles de données structurés

**Vous pouvez maintenant gérer tout le contenu de votre site web depuis l'API !** 🚀 