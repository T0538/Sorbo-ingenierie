# 🚀 Guide de Déploiement - API Actualités MongoDB sur Railway

## 🚨 **Problème identifié**
L'API de production Railway retourne une erreur 500, empêchant l'affichage des 4 actualités MongoDB.

## 🔍 **Diagnostic**
- ✅ **API locale** : Fonctionne parfaitement (4 actualités MongoDB)
- ❌ **API Railway** : Erreur 500 (serveur non fonctionnel)
- ✅ **Frontend** : Script corrigé et prêt
- ✅ **Git** : Code poussé et commité

## 🛠️ **Solutions à appliquer**

### **1. Vérifier le déploiement Railway**

#### **Option A : Via l'interface web Railway**
1. Aller sur [railway.app](https://railway.app)
2. Se connecter et sélectionner le projet `sorbo-api-production`
3. Vérifier l'onglet "Deployments" pour voir le statut
4. Vérifier l'onglet "Variables" pour les variables d'environnement

#### **Option B : Via la CLI Railway**
```bash
# Installer Railway CLI si pas déjà fait
npm install -g @railway/cli

# Se connecter
railway login

# Vérifier le statut du projet
railway status

# Voir les logs
railway logs
```

### **2. Vérifier les variables d'environnement Railway**

Les variables suivantes doivent être configurées sur Railway :

```env
MONGODB_URI=mongodb+srv://kevinyameogo01:Kevin2024@sorbo-ingenierie.ol32tmy.mongodb.net/sorbo_ingenierie?retryWrites=true&w=majority
JWT_SECRET=votre-secret-jwt-tres-securise-2024-sorbo-ingenierie
NODE_ENV=production
PORT=5000
```

### **3. Vérifier le fichier railway.json**

Le fichier `railway.json` doit contenir :

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server-railway.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "variables": {
    "MONGODB_URI": "mongodb+srv://kevinyameogo01:Kevin2024@sorbo-ingenierie.ol32tmy.mongodb.net/sorbo_ingenierie?retryWrites=true&w=majority",
    "JWT_SECRET": "votre-secret-jwt-tres-securise-2024-sorbo-ingenierie",
    "NODE_ENV": "production",
    "PORT": "5000"
  }
}
```

### **4. Forcer un redéploiement**

Si le déploiement automatique ne fonctionne pas :

```bash
# Via CLI Railway
railway up

# Ou via Git (forcer un nouveau commit)
git commit --allow-empty -m "🔄 Force redéploiement Railway"
git push origin main
```

## 🧪 **Tests de validation**

### **Test 1 : Vérifier l'endpoint de santé**
```bash
curl https://sorbo-api-production.up.railway.app/api/health
```

**Résultat attendu :**
```json
{
  "message": "Serveur Railway Sorbo-Ingénierie opérationnel",
  "timestamp": "2025-08-24T...",
  "mongodb": "connecté"
}
```

### **Test 2 : Vérifier l'endpoint des actualités**
```bash
curl https://sorbo-api-production.up.railway.app/api/actualites
```

**Résultat attendu :**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "68aba759828702e6892ba768",
      "titre": "Nouveau logiciel OH-Route v1 disponible",
      "resume": "Sortie officielle du logiciel OH-Route v1...",
      "categorie": "technologie",
      "auteur": "Sorbo Ingénierie",
      "datePublication": "2024-01-15T00:00:00.000Z"
    }
    // ... 3 autres actualités
  ]
}
```

## 🔧 **Résolution des erreurs courantes**

### **Erreur 500 - Serveur interne**
- **Cause** : Problème de démarrage du serveur
- **Solution** : Vérifier les logs Railway et les variables d'environnement

### **Erreur de connexion MongoDB**
- **Cause** : URI MongoDB incorrect ou réseau bloqué
- **Solution** : Vérifier l'URI et les permissions réseau

### **Erreur de port**
- **Cause** : Port déjà utilisé ou mal configuré
- **Solution** : Vérifier la variable PORT et la configuration Railway

## 📱 **Vérification finale**

Une fois l'API Railway fonctionnelle :

1. **Ouvrir la page `actualites.html`**
2. **Vérifier la console du navigateur** :
   ```
   📰 Démarrage du chargeur d'actualités...
   📰 Page chargée, démarrage du chargement des actualités...
   📡 Connexion à l'API actualités...
   ✅ Données actualités reçues: [données]
   ✅ 4 actualités chargées (4 visibles)
   ```

3. **Vérifier l'affichage** :
   - ✅ 4 actualités MongoDB visibles
   - ✅ Images, titres, résumés corrects
   - ✅ Catégories et dates formatées
   - ✅ Bouton "Charger plus" fonctionnel

## 🎯 **Prochaines étapes**

1. **Résoudre l'erreur 500 Railway** (variables d'environnement, logs)
2. **Vérifier que l'API retourne les 4 actualités**
3. **Tester la page `actualites.html` en production**
4. **Confirmer l'affichage dynamique des actualités MongoDB**

## 🆘 **En cas de blocage**

Si l'erreur 500 persiste :

1. **Vérifier les logs Railway** pour identifier l'erreur exacte
2. **Vérifier la connexion MongoDB** depuis Railway
3. **Tester l'API localement** pour confirmer qu'elle fonctionne
4. **Contacter le support Railway** si nécessaire

---

**🎯 Objectif : Afficher dynamiquement les 4 actualités MongoDB sur votre site en production !**
