# Configuration Email Railway + Zoho Mail
## 📧 contact@sorbo-ingenierie.ci

### 🚀 ÉTAPES DE CONFIGURATION RAILWAY

#### 1. **Accéder à Railway**
- Allez sur https://railway.app
- Connectez-vous à votre compte
- Sélectionnez votre projet `sorbo-api-production`

#### 2. **Ajouter les Variables d'Environnement**
Dans l'onglet **Variables** de votre projet Railway, ajoutez :

```
ZOHO_EMAIL=contact@sorbo-ingenierie.ci
ZOHO_PASSWORD=votre-mot-de-passe-application-zoho
```

#### 3. **Configuration Zoho Mail (IMPORTANT)**

##### A. Créer un mot de passe d'application Zoho :
1. Connectez-vous à https://mail.zoho.com avec `contact@sorbo-ingenierie.ci`
2. Cliquez sur **Paramètres** (roue dentée en haut à droite)
3. Allez dans **Sécurité** → **Mots de passe d'application**
4. Cliquez sur **Générer un nouveau mot de passe**
5. Nom : `Railway Sorbo API`
6. **COPIEZ le mot de passe généré** (il ne sera affiché qu'une fois !)

##### B. Utiliser ce mot de passe :
- Utilisez ce mot de passe généré (pas votre mot de passe principal)
- Ajoutez-le dans Railway comme variable `ZOHO_PASSWORD`

### 🔧 CONFIGURATION DÉTAILLÉE RAILWAY

#### Variables d'environnement complètes :
```
NODE_ENV=production
PORT=443
MONGODB_URI=votre-url-mongodb-atlas
ZOHO_EMAIL=contact@sorbo-ingenierie.ci
ZOHO_PASSWORD=mot-de-passe-application-zoho
```

#### Test de configuration :
Une fois les variables ajoutées, testez avec :
```
GET https://sorbo-api-production.up.railway.app/api/email/config
```

### 📱 VÉRIFICATION ÉTAPE PAR ÉTAPE

#### ✅ Checklist de configuration :

1. **Variables Railway configurées** 
   - [ ] ZOHO_EMAIL ajoutée
   - [ ] ZOHO_PASSWORD ajoutée (mot de passe d'application)

2. **Zoho Mail configuré**
   - [ ] Mot de passe d'application généré
   - [ ] Authentification à 2 facteurs activée (si demandée)
   - [ ] SMTP autorisé pour les applications tierces

3. **Test des endpoints**
   - [ ] `/api/email/config` retourne success: true
   - [ ] `/api/email/test` envoie un email de test

### 🧪 TESTS APRÈS CONFIGURATION

#### Test 1: Vérifier la configuration
```bash
curl https://sorbo-api-production.up.railway.app/api/email/config
```

Réponse attendue :
```json
{
  "success": true,
  "config": {
    "host": "smtp.zoho.com",
    "port": 587,
    "email": "contact@sorbo-ingenierie.ci",
    "configured": true
  }
}
```

#### Test 2: Envoyer un email de test
```bash
curl -X POST https://sorbo-api-production.up.railway.app/api/email/test
```

Réponse attendue :
```json
{
  "success": true,
  "message": "Test Zoho Mail réussi",
  "messageId": "xxx"
}
```

### 🛠️ RÉSOLUTION DE PROBLÈMES

#### Erreur "Authentication failed" :
- Vérifiez que vous utilisez le **mot de passe d'application** et non votre mot de passe principal
- Assurez-vous que l'authentification à 2 facteurs est activée sur Zoho

#### Erreur "Connection timeout" :
- Vérifiez que Railway a accès à internet (normal)
- Vérifiez l'URL SMTP : `smtp.zoho.com:587`

#### Erreur "Access denied" :
- Activez IMAP/POP dans Zoho Mail
- Vérifiez que les applications tierces sont autorisées

### 📋 PARAMÈTRES ZOHO COMPLETS

#### Configuration SMTP Zoho Mail :
```
Serveur sortant (SMTP) : smtp.zoho.com
Port : 587
Méthode de chiffrement : STARTTLS
Authentification : Oui
Nom d'utilisateur : contact@sorbo-ingenierie.ci
Mot de passe : [mot de passe d'application]
```

#### Paramètres de sécurité requis :
- ✅ Authentification à 2 facteurs activée
- ✅ Mot de passe d'application généré
- ✅ IMAP/POP activé
- ✅ Applications tierces autorisées

### 🚀 DÉPLOIEMENT ET TEST FINAL

#### 1. Sauvegarder les modifications :
```bash
git add .
git commit -m "Configuration email Zoho Railway complete"
git push origin main
```

#### 2. Tester sur votre site :
- Allez sur https://sorbo-ingenierie.ci/contact.html
- Remplissez le formulaire de contact
- Vérifiez que vous recevez l'email sur contact@sorbo-ingenierie.ci

#### 3. Vérifier les inscriptions formations :
- Allez sur https://sorbo-ingenierie.ci/nos-formations.html
- Cliquez sur "S'inscrire" sur une formation
- Remplissez le formulaire
- Vérifiez la réception email

### 🎯 RÉSULTAT FINAL

Une fois configuré, votre site enverra automatiquement :

1. **Pour VOUS (contact@sorbo-ingenierie.ci) :**
   - Notification de tous les formulaires remplis
   - Détails complets des inscriptions
   - Informations de contact des prospects

2. **Pour VOS CLIENTS :**
   - Email de confirmation automatique
   - Accusé de réception professionnel
   - Informations de suivi

### 📞 SUPPORT

En cas de problème :
1. Vérifiez les logs Railway
2. Testez l'endpoint `/api/email/test`
3. Consultez les paramètres Zoho Mail
4. Vérifiez que les variables d'environnement sont correctes

**Email configuré : contact@sorbo-ingenierie.ci**
**Statut : ✅ Prêt pour la production**
