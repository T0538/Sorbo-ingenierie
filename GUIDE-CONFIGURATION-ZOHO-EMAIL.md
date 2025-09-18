# Guide Configuration Zoho Email - Sorbo-Ingénierie

## 🎯 Configuration Rapide

### 1. Variables d'environnement Railway

Ajoutez ces variables dans votre dashboard Railway :

```
ZOHO_EMAIL=contact@sorbo-ingenierie.ci
ZOHO_PASSWORD=votre-mot-de-passe-zoho-mail
```

### 2. Test de la configuration

Une fois déployé, testez l'endpoint :
```
POST https://sorbo-api-production.up.railway.app/api/email/test
```

### 3. Fonctionnalités activées

✅ **Formulaires gérés automatiquement :**
- Contact principal
- Inscriptions formations
- Newsletter
- Demandes de devis
- Demandes de rendez-vous

✅ **Emails automatiques :**
- Notification à contact@sorbo-ingenierie.ci
- Confirmation automatique au client
- Format HTML professionnel

## 🔧 Configuration Zoho Mail

### Paramètres SMTP Zoho :
- **Host :** smtp.zoho.com
- **Port :** 587
- **Sécurité :** STARTTLS
- **Authentication :** Votre email et mot de passe

### Mot de passe d'application :
1. Connectez-vous à Zoho Mail
2. Allez dans **Paramètres** → **Sécurité**
3. Générez un **Mot de passe d'application**
4. Utilisez ce mot de passe au lieu de votre mot de passe principal

## 📧 Endpoints API disponibles

### Envoyer un email
```
POST /api/email/contact
Content-Type: application/json

{
  "to": "contact@sorbo-ingenierie.ci",
  "subject": "Nouveau message",
  "html": "<p>Contenu HTML</p>",
  "text": "Contenu texte",
  "formData": {
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "message": "Message du client"
  },
  "type": "contact"
}
```

### Tester la configuration
```
POST /api/email/test
```

### Vérifier la configuration
```
GET /api/email/config
```

## 🚀 Déploiement

1. **Commitez les modifications :**
```bash
git add .
git commit -m "Intégration Zoho Email - contact@sorbo-ingenierie.ci"
git push origin main
```

2. **Configurez les variables Railway :**
   - Allez sur railway.app
   - Sélectionnez votre projet
   - Ajoutez les variables d'environnement

3. **Testez :**
   - Remplissez un formulaire sur votre site
   - Vérifiez votre boîte Zoho Mail

## 📋 Vérification Post-Déploiement

### ✅ Checklist :
- [ ] Variables d'environnement configurées
- [ ] Test endpoint réussi
- [ ] Formulaire de contact fonctionne
- [ ] Email de confirmation reçu
- [ ] Notification sur Zoho Mail reçue

### 🔍 Debug en cas de problème :
1. Vérifiez les logs Railway
2. Testez l'endpoint `/api/email/test`
3. Vérifiez la configuration Zoho
4. Contrôlez les variables d'environnement

## 📱 Fonctionnalités Avancées

### Auto-détection des formulaires
Le script détecte automatiquement :
- Type de formulaire (contact, inscription, etc.)
- Champs présents
- Action appropriée

### Emails de confirmation
Envoi automatique de confirmations aux clients avec :
- Accusé de réception
- Informations de contact
- Liens vers vos services

### Gestion d'erreurs
En cas d'échec :
- Ouverture du client email par défaut
- Message d'erreur informatif
- Fallback vers mailto:

## 🎉 Résultat Final

Votre site enverra automatiquement :
1. **À vous :** Notification détaillée avec toutes les infos du formulaire
2. **Au client :** Email de confirmation professionnel
3. **Sauvegarde :** Log des emails en base de données

**Contact configuré :** contact@sorbo-ingenierie.ci
**Domaine :** sorbo-ingenierie.ci
**Statut :** ✅ Prêt pour la production
