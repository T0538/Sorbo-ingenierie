# Configuration Zoho Mail via SendGrid Proxy

## 🎯 Objectif
Utiliser SendGrid comme proxy pour envoyer des emails via votre compte Zoho Mail `contact@sorbo-ingenierie.ci`, contournant les restrictions Railway.

## 📋 Étapes de configuration

### 1. Créer un compte SendGrid
1. Allez sur [sendgrid.com](https://sendgrid.com)
2. Créez un compte gratuit (100 emails/jour)
3. Vérifiez votre email

### 2. Générer une clé API
1. Dans SendGrid, allez dans **Settings** → **API Keys**
2. Cliquez sur **Create API Key**
3. Nom : `Sorbo-Ingénierie-Website`
4. Permissions : **Full Access** (ou **Restricted Access** avec Mail Send)
5. Copiez la clé API générée

### 3. Configurer Railway
1. Allez sur [railway.app](https://railway.app)
2. Ouvrez votre projet `sorbo-api-production`
3. Allez dans **Variables**
4. Ajoutez :
   ```
   SENDGRID_API_KEY=votre_clé_api_sendgrid_ici
   ZOHO_EMAIL=contact@sorbo-ingenierie.ci
   ```

### 4. Vérifier la configuration
Testez avec cette commande :
```bash
curl -X POST https://sorbo-api-production.up.railway.app/api/zoho-proxy/test \
  -H "Content-Type: application/json" \
  -d '{"to":"contact@sorbo-ingenierie.ci","subject":"Test","text":"Test"}'
```

## ✅ Avantages de cette solution
- ✅ Garde votre email Zoho `contact@sorbo-ingenierie.ci`
- ✅ Contourne les restrictions Railway
- ✅ Gratuit jusqu'à 100 emails/jour
- ✅ Fiable et rapide
- ✅ Les emails arrivent dans votre boîte Zoho

## 🔧 Comment ça fonctionne
1. Votre site web envoie l'email à notre API
2. Notre API utilise SendGrid pour envoyer l'email
3. SendGrid envoie l'email depuis `contact@sorbo-ingenierie.ci`
4. L'email arrive dans votre boîte Zoho

## 📧 Configuration finale
Une fois configuré, tous vos formulaires utiliseront automatiquement ce système :
- Formulaire de contact
- Inscriptions formations
- Demandes de rendez-vous
- Newsletter
- Demandes de devis

L'email sera envoyé depuis `contact@sorbo-ingenierie.ci` et arrivera dans votre boîte Zoho !
