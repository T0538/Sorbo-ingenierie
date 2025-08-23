# 🔐 Guide d'Installation du Système d'Administration Sorbo-Ingénierie

## 📋 **Vue d'ensemble**

Ce guide vous accompagne dans l'installation et la configuration du système d'administration complet pour Sorbo-Ingénierie. Le système permet de gérer tout le contenu du site via une interface web sécurisée.

## 🚀 **Installation Rapide**

### **Étape 1 : Vérification des prérequis**

```bash
# Vérifier que Node.js est installé
node --version  # Doit être >= 14.0.0

# Vérifier que npm est installé
npm --version

# Vérifier que MongoDB est accessible
# (URI dans votre fichier .env)
```

### **Étape 2 : Installation des dépendances**

```bash
# Dans le répertoire racine du projet
npm install

# Vérifier que bcryptjs est installé
npm list bcryptjs
```

### **Étape 3 : Configuration de l'environnement**

Créer ou modifier le fichier `.env` à la racine :

```env
# MongoDB Atlas URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (changez cette valeur en production !)
JWT_SECRET=votre-secret-jwt-tres-securise-2024

# Environnement
NODE_ENV=development
```

### **Étape 4 : Initialisation de l'administrateur**

```bash
# Créer l'administrateur par défaut
node backend/init-admin.js

# Vérifier l'état de la base de données
node backend/init-admin.js --check
```

### **Étape 5 : Démarrer le serveur**

```bash
# Démarrer en mode développement
npm run dev

# Ou démarrer en mode production
npm start
```

## 🔑 **Première Connexion**

### **Identifiants par défaut :**
- **URL** : `http://localhost:3000/admin-login.html`
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `AdminSorbo2024!`
- **Rôle** : `super-admin`

### **⚠️ IMPORTANT :**
Changez le mot de passe par défaut après la première connexion !

## 🏗️ **Architecture du Système**

### **Structure des fichiers :**
```
backend/
├── admin-config.js          # Configuration générale
├── models/
│   └── AdminUser.js        # Modèle utilisateur admin
├── middleware/
│   └── adminAuth.js        # Authentification et autorisation
├── routes/
│   └── adminAuth.js        # Routes d'authentification
└── init-admin.js           # Script d'initialisation

admin-login.html            # Page de connexion
admin-dashboard.html        # Tableau de bord (à créer)
```

### **Sécurité implémentée :**
- ✅ **JWT (JSON Web Tokens)** pour l'authentification
- ✅ **bcrypt** pour le hachage des mots de passe (12 rounds)
- ✅ **Verrouillage automatique** après 5 tentatives échouées
- ✅ **Sessions sécurisées** avec expiration automatique
- ✅ **Gestion des permissions** par rôle
- ✅ **Logs d'activité** complets
- ✅ **Validation des données** côté serveur

## 🎯 **Fonctionnalités Disponibles**

### **Authentification :**
- Connexion sécurisée
- Déconnexion
- Vérification de token
- Changement de mot de passe
- Gestion des sessions

### **Gestion des Utilisateurs :**
- Création de nouveaux administrateurs
- Gestion des rôles et permissions
- Activation/désactivation de comptes
- Suivi des connexions

### **Sécurité :**
- Verrouillage automatique des comptes
- Limitation des tentatives de connexion
- Logs de sécurité
- Gestion des permissions

## 🔧 **Configuration Avancée**

### **Modifier la configuration :**

Éditer `backend/admin-config.js` :

```javascript
const adminConfig = {
    security: {
        jwtExpiresIn: '24h',           // Durée de validité du token
        bcryptRounds: 12,              // Niveau de hachage
        maxLoginAttempts: 5,           // Tentatives max avant verrouillage
        lockoutDuration: 15 * 60 * 1000 // Durée du verrouillage (15 min)
    },
    // ... autres configurations
};
```

### **Ajouter de nouveaux rôles :**

```javascript
permissions: {
    'super-admin': ['read', 'write', 'delete', 'manage-users'],
    'admin': ['read', 'write', 'delete'],
    'editor': ['read', 'write'],
    'viewer': ['read'],
    'moderator': ['read', 'write', 'moderate'] // Nouveau rôle
}
```

## 📱 **Interface d'Administration**

### **Page de connexion :**
- Design moderne et responsive
- Validation en temps réel
- Gestion des erreurs
- Animations fluides
- Support mobile complet

### **Fonctionnalités de l'interface :**
- Affichage/masquage du mot de passe
- Messages d'erreur contextuels
- Indicateurs de chargement
- Redirection automatique
- Vérification de session

## 🚨 **Dépannage**

### **Problèmes courants :**

#### **1. Erreur de connexion MongoDB :**
```bash
# Vérifier l'URI dans .env
echo $MONGODB_URI

# Tester la connexion
node backend/init-admin.js --check
```

#### **2. Erreur JWT :**
```bash
# Vérifier le secret JWT
echo $JWT_SECRET

# Redémarrer le serveur après modification
npm run dev
```

#### **3. Utilisateur non trouvé :**
```bash
# Réinitialiser l'administrateur
node backend/init-admin.js
```

#### **4. Problèmes de permissions :**
```bash
# Vérifier les rôles dans la base
node backend/init-admin.js --check
```

### **Logs et débogage :**

```bash
# Activer les logs détaillés
export DEBUG=admin:*

# Vérifier les logs du serveur
tail -f logs/admin.log
```

## 🔒 **Sécurité en Production**

### **Recommandations :**
1. **Changer le secret JWT** par défaut
2. **Utiliser HTTPS** en production
3. **Configurer un firewall** approprié
4. **Sauvegarder régulièrement** la base de données
5. **Monitorer les tentatives de connexion**
6. **Implémenter la 2FA** pour les comptes sensibles

### **Variables d'environnement de production :**
```env
NODE_ENV=production
JWT_SECRET=secret-tres-long-et-complexe-2024
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
ADMIN_SESSION_SECRET=autre-secret-session
```

## 📚 **API Reference**

### **Endpoints d'authentification :**

#### **POST /api/admin/auth/login**
```json
{
    "username": "admin",
    "password": "motdepasse"
}
```

#### **POST /api/admin/auth/logout**
```bash
Authorization: Bearer <token>
```

#### **GET /api/admin/auth/verify**
```bash
Authorization: Bearer <token>
```

#### **POST /api/admin/auth/change-password**
```bash
Authorization: Bearer <token>
{
    "currentPassword": "ancien",
    "newPassword": "nouveau"
}
```

## 🚀 **Prochaines Étapes**

### **Phase 2 : Tableau de bord complet**
- Interface d'administration complète
- Gestion des logiciels
- Gestion des formations
- Gestion des emplois
- Gestion des actualités

### **Phase 3 : Fonctionnalités avancées**
- Upload de fichiers
- Gestion des médias
- Statistiques et analytics
- Notifications en temps réel
- Sauvegarde automatique

## 📞 **Support**

### **En cas de problème :**
1. Vérifiez ce guide
2. Consultez les logs d'erreur
3. Vérifiez la configuration
4. Testez avec `--check`
5. Redémarrez le serveur

### **Commandes utiles :**
```bash
# Vérifier l'état
node backend/init-admin.js --check

# Réinitialiser l'admin
node backend/init-admin.js

# Démarrer le serveur
npm run dev

# Vérifier les dépendances
npm list
```

---

## 🎉 **Félicitations !**

Votre système d'administration est maintenant opérationnel ! Vous pouvez :
- ✅ Vous connecter avec les identifiants par défaut
- ✅ Gérer les utilisateurs administrateurs
- ✅ Surveiller l'activité via les logs
- ✅ Personnaliser la configuration selon vos besoins

**Prochaine étape :** Créer le tableau de bord complet pour gérer le contenu du site ! 🚀


