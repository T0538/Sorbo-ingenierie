u# Guide de configuration de MongoDB pour la production

Ce guide explique comment configurer MongoDB pour un environnement de production pour l'application Sorbo-Ingénierie.

## Option 1 : MongoDB Atlas (Recommandé)

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) est un service de base de données MongoDB entièrement géré dans le cloud. C'est l'option recommandée pour la production.

### Étapes de configuration

1. **Créer un compte MongoDB Atlas**
   - Accédez à [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Inscrivez-vous pour un compte gratuit ou connectez-vous

2. **Créer un cluster**
   - Cliquez sur "Build a Cluster"
   - Choisissez un fournisseur cloud (AWS, Google Cloud ou Azure)
   - Sélectionnez une région proche de l'emplacement de vos utilisateurs (par exemple, Europe ou Afrique)
   - Choisissez le niveau de cluster (M0 est gratuit et suffisant pour commencer)
   - Donnez un nom à votre cluster (par exemple "sorbo-ingenierie-prod")

3. **Configurer la sécurité**
   - Créez un utilisateur de base de données (Database User)
     - Dans la section Security, cliquez sur "Database Access"
     - Cliquez sur "Add New Database User"
     - Choisissez "Password" comme méthode d'authentification
     - Entrez un nom d'utilisateur et un mot de passe fort
     - Sélectionnez le rôle "Read and Write to Any Database"
     - Cliquez sur "Add User"
   
   - Configurez l'accès réseau
     - Dans la section Security, cliquez sur "Network Access"
     - Cliquez sur "Add IP Address"
     - Pour le développement, vous pouvez ajouter "0.0.0.0/0" pour permettre l'accès depuis n'importe où
     - Pour plus de sécurité en production, limitez l'accès aux adresses IP de votre serveur

4. **Connecter l'application**
   - Cliquez sur "Connect" sur votre cluster
   - Sélectionnez "Connect your application"
   - Choisissez "Node.js" comme pilote et la version appropriée
   - Copiez l'URI de connexion, qui ressemblera à :
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```
   - Remplacez `<username>`, `<password>` et `<dbname>` par vos informations (dbname peut être "sorbo-ingenierie")

5. **Mettre à jour votre fichier .env**
   - Utilisez l'URI obtenu comme valeur pour MONGODB_URI dans votre fichier .env de production

## Option 2 : Serveur MongoDB dédié

Si vous préférez héberger MongoDB sur votre propre serveur, suivez ces étapes :

### Prérequis

- Un serveur Linux (Ubuntu/Debian recommandé)
- Au moins 2 Go de RAM
- Accès SSH root ou sudo

### Installation

```bash
# 1. Importer la clé publique MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 2. Créer un fichier de liste pour MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 3. Recharger la base de données des paquets
sudo apt-get update

# 4. Installer MongoDB
sudo apt-get install -y mongodb-org

# 5. Démarrer MongoDB
sudo systemctl start mongod

# 6. Activer le démarrage automatique
sudo systemctl enable mongod
```

### Configuration de sécurité

1. **Créer un utilisateur administrateur**

```javascript
// Se connecter à MongoDB
mongo

// Sélectionner la base de données admin
use admin

// Créer un utilisateur administrateur
db.createUser({
  user: "adminuser",
  pwd: "password_secure", // Utilisez un mot de passe fort
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

// Quitter
exit
```

2. **Activer l'authentification**

Modifier le fichier de configuration de MongoDB :

```bash
sudo nano /etc/mongod.conf
```

Ajouter/modifier la section security :

```yaml
security:
  authorization: enabled
```

Redémarrer MongoDB :

```bash
sudo systemctl restart mongod
```

3. **Créer un utilisateur pour l'application**

```javascript
// Se connecter à MongoDB avec l'utilisateur admin
mongo -u adminuser -p --authenticationDatabase admin

// Créer une base de données pour l'application
use sorbo-ingenierie

// Créer un utilisateur pour l'application
db.createUser({
  user: "sorbo_app_user",
  pwd: "password_app_secure", // Utilisez un mot de passe fort
  roles: [ { role: "readWrite", db: "sorbo-ingenierie" } ]
})

// Quitter
exit
```

4. **Mettre à jour le fichier .env**

```
MONGODB_URI=mongodb://sorbo_app_user:password_app_secure@your_server_ip:27017/sorbo-ingenierie
```

### Sécurité supplémentaire

- **Configurer un pare-feu** pour autoriser uniquement les connexions depuis votre serveur d'application
- **Activer SSL/TLS** pour les communications chiffrées
- **Configurer des sauvegardes régulières** (mongodump)
- **Monitorer les performances** avec des outils comme MongoDB Compass ou MMS

## Bonnes pratiques

1. **Indexation** : Créez des index pour les champs fréquemment recherchés
2. **Structure des données** : Optimisez votre schéma pour minimiser les requêtes imbriquées
3. **Validation** : Utilisez la validation de schéma pour garantir l'intégrité des données
4. **Développement vs Production** : Utilisez des bases de données distinctes pour le développement et la production
5. **Surveillance** : Configurez des alertes pour les métriques clés (utilisation du CPU, mémoire, latence)

## Ressources utiles

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Sécurité MongoDB](https://docs.mongodb.com/manual/security/)
- [Tutoriel MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/)
- [Optimisation des performances](https://docs.mongodb.com/manual/core/query-optimization/) 