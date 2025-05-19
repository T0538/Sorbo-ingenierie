# Configuration des Variables d'Environnement

Pour que l'application fonctionne correctement, vous devez créer un fichier `.env` dans le dossier `backend/` avec les variables suivantes:

## Développement

```
# Configuration de base
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sorbo-ingenierie

# JWT
JWT_SECRET=sorbo_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@sorbo-ingenierie.com
EMAIL_PASS=your_password_here
EMAIL_FROM=contact@sorbo-ingenierie.com

# Upload des fichiers
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=./uploads

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
```

## Production

Pour la production, utilisez ces paramètres (à adapter selon votre hébergement):

```
# Configuration de base
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@clusterXXX.mongodb.net/sorbo-ingenierie?retryWrites=true&w=majority

# JWT
JWT_SECRET=strong_production_secret_key_generate_random_string
JWT_EXPIRES_IN=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@sorbo-ingenierie.com
EMAIL_PASS=your_secure_app_password
EMAIL_FROM=contact@sorbo-ingenierie.com

# Upload des fichiers
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=./uploads

# URLs
FRONTEND_URL=https://www.sorbo-ingenierie.com
API_URL=https://api.sorbo-ingenierie.com/api
```

## Remarques importantes

1. **Sécurité**: Ne jamais versionner le fichier `.env` dans Git. Assurez-vous qu'il est inclus dans votre `.gitignore`.

2. **JWT_SECRET**: Utilisez une chaîne aléatoire forte en production. Vous pouvez générer une clé sécurisée avec:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Email**: Pour Gmail, vous devrez peut-être utiliser un "mot de passe d'application" plutôt que votre mot de passe principal.

4. **MongoDB**: Pour la production, utilisez un service MongoDB hébergé comme MongoDB Atlas.

5. **HTTPS**: En production, assurez-vous que votre API est servie via HTTPS. 