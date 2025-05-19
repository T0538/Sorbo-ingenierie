# Guide de déploiement - Sorbo Ingénierie

Ce guide explique comment déployer l'application Sorbo Ingénierie en production.

## Prérequis

1. Un serveur avec Node.js v14+ installé
2. MongoDB Atlas configuré
3. Un nom de domaine configuré

## Structure des dossiers

Les dossiers suivants ont été créés pour les uploads :
- `uploads/` - Dossier parent pour tous les uploads
  - `uploads/cv` - Pour les CV des candidats
  - `uploads/projets` - Pour les images des projets
  - `uploads/logiciels` - Pour les fichiers relatifs aux logiciels

## Configuration

1. Utilisez le fichier `.env.production` pour l'environnement de production :
   ```bash
   copy backend\.env.production backend\.env
   ```

2. Assurez-vous que les URLs dans le fichier `.env` pointent vers votre domaine réel :
   ```
   FRONTEND_URL=https://www.sorbo-ingenierie.com
   API_URL=https://api.sorbo-ingenierie.com/api
   ```

3. Vérifiez que la chaîne de connexion MongoDB est correcte et sur une seule ligne.

## Démarrage

Le fichier `package.json` inclut maintenant un script `start` pour la production :

```bash
cd backend
npm start
```

## Options de déploiement

### Option 1 : Serveur dédié/VPS

Utilisez PM2 pour gérer votre application Node.js en production :

```bash
# Installation de PM2
npm install -g pm2

# Démarrage de l'application
pm2 start server.js --name "sorbo-api"

# Configuration du démarrage automatique
pm2 startup
pm2 save
```

### Option 2 : Heroku

1. Installez l'interface en ligne de commande Heroku
2. Créez un fichier `Procfile` à la racine avec le contenu :
   ```
   web: node backend/server.js
   ```
3. Déployez avec les commandes :
   ```bash
   heroku login
   heroku create sorbo-api
   git push heroku main
   ```

### Option 3 : Vercel ou Netlify

Ces plateformes sont plus adaptées pour le frontend, mais vous pouvez aussi y déployer des API Node.js :

1. Créez un fichier `vercel.json` à la racine :
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "backend/server.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "backend/server.js" }
     ]
   }
   ```

2. Déployez avec la commande :
   ```bash
   vercel
   ```

## Résolution des problèmes

1. Assurez-vous que Node.js est à la bonne version sur le serveur
2. Vérifiez les logs avec `pm2 logs` ou les logs du service déployé
3. Testez la connexion MongoDB séparément avant le déploiement

## Sécurité

1. Utilisez HTTPS (SSL/TLS) pour votre API
2. Configurez des règles de pare-feu appropriées
3. Supprimez les informations de débogage en production

## Maintenance

1. Configurez des sauvegardes régulières de la base de données
2. Mettez en place un système de monitoring (comme UptimeRobot)

NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://votreuser:votremotdepasse@cluster0.mongodb.net/sorbo-ingenierie?retryWrites=true&w=majority
JWT_SECRET=votre_jwt_secret_securise_pour_production
JWT_EXPIRE=30d
FRONTEND_URL=https://www.sorbo-ingenierie.com
API_URL=https://api.sorbo-ingenierie.com/api
SMTP_HOST=smtp.votreservice.com
SMTP_PORT=587
SMTP_USER=votre_email@domaine.com
SMTP_PASS=votre_mot_de_passe_email
FROM_EMAIL=contact@sorbo-ingenierie.com
FROM_NAME=Sorbo-Ingenierie 