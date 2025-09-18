# 📧 Guide de Configuration Email - Sorbo-Ingénierie

## 🎯 **Objectif**
Ce guide vous explique comment configurer la réception des candidatures, demandes de contact, devis et newsletters directement sur votre email personnel.

## 🚀 **Solution Recommandée : Formspree (Gratuit)**

### **Étape 1 : Créer vos formulaires Formspree**

1. **Allez sur [formspree.io](https://formspree.io)**
2. **Créez un compte gratuit**
3. **Créez 4 formulaires séparés :**

#### **📋 Formulaire 1 : Contact Général**
- **Nom** : `Contact Sorbo-Ingénierie`
- **Email de réception** : `votre-email@gmail.com`
- **Endpoint** : Notez l'URL fournie (ex: `https://formspree.io/f/xaybzwkd`)

#### **📋 Formulaire 2 : Candidatures**
- **Nom** : `Candidatures Sorbo-Ingénierie`
- **Email de réception** : `votre-email@gmail.com`
- **Endpoint** : Notez l'URL fournie

#### **📋 Formulaire 3 : Demandes de Devis**
- **Nom** : `Devis Sorbo-Ingénierie`
- **Email de réception** : `votre-email@gmail.com`
- **Endpoint** : Notez l'URL fournie

#### **📋 Formulaire 4 : Newsletter**
- **Nom** : `Newsletter Sorbo-Ingénierie`
- **Email de réception** : `votre-email@gmail.com`
- **Endpoint** : Notez l'URL fournie

### **Étape 2 : Configurer le fichier `js/email-config.js`**

Remplacez les URLs par défaut par vos vraies URLs Formspree :

```javascript
const EMAIL_CONFIG = {
    // Remplacez par vos vraies URLs Formspree
    contact: 'https://formspree.io/f/VOTRE_VRAI_FORM_ID_CONTACT',
    candidature: 'https://formspree.io/f/VOTRE_VRAI_FORM_ID_CANDIDATURE', 
    devis: 'https://formspree.io/f/VOTRE_VRAI_FORM_ID_DEVIS',
    newsletter: 'https://formspree.io/f/VOTRE_VRAI_FORM_ID_NEWSLETTER',
    
    // ... autres configurations
};
```

### **Étape 3 : Ajouter les scripts aux pages**

#### **Page de contact (`contact.html`)**
Ajoutez avant `</body>` :
```html
<script src="js/email-config.js"></script>
<script src="js/form-handler.js"></script>
```

#### **Page nous-rejoindre (`nous-rejoindre.html`)**
Ajoutez avant `</body>` :
```html
<script src="js/email-config.js"></script>
<script src="js/form-handler.js"></script>
```

#### **Page d'accueil (`index.html`)**
Ajoutez avant `</body>` :
```html
<script src="js/email-config.js"></script>
<script src="js/form-handler.js"></script>
```

## 🔧 **Configuration Alternative : EmailJS**

Si vous préférez EmailJS (aussi gratuit) :

### **Étape 1 : Créer un compte EmailJS**
1. Allez sur [emailjs.com](https://emailjs.com)
2. Créez un compte gratuit
3. Configurez votre service email (Gmail, Outlook, etc.)

### **Étape 2 : Créer des templates**
1. **Template Contact** : Pour les demandes générales
2. **Template Candidature** : Pour les CV et candidatures
3. **Template Devis** : Pour les demandes de devis
4. **Template Newsletter** : Pour les inscriptions

### **Étape 3 : Configurer `js/email-config.js`**
```javascript
const EMAIL_CONFIG = {
    emailjs: {
        serviceId: 'VOTRE_SERVICE_ID',
        templateId: 'VOTRE_TEMPLATE_ID',
        userId: 'VOTRE_USER_ID'
    }
};
```

## 📧 **Configuration SMTP Personnel (Avancé)**

### **Option 1 : Gmail avec authentification 2FA**
```javascript
const EMAIL_CONFIG = {
    smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'votre-email@gmail.com',
            pass: 'votre-mot-de-passe-app' // Pas votre mot de passe normal !
        }
    }
};
```

**⚠️ Important pour Gmail :**
1. Activez l'authentification à 2 facteurs
2. Générez un "mot de passe d'application"
3. Utilisez ce mot de passe dans la config

### **Option 2 : Outlook/Hotmail**
```javascript
const EMAIL_CONFIG = {
    smtp: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: 'votre-email@outlook.com',
            pass: 'votre-mot-de-passe'
        }
    }
};
```

## 📱 **Test et Validation**

### **Test 1 : Formulaire de contact**
1. Remplissez le formulaire sur `contact.html`
2. Cliquez sur "Envoyer le message"
3. Vérifiez votre email
4. Vérifiez la console pour les logs

### **Test 2 : Candidature**
1. Allez sur `nous-rejoindre.html`
2. Cliquez sur "Envoyer votre CV"
3. Remplissez le formulaire
4. Vérifiez votre email

### **Test 3 : Newsletter**
1. Remplissez le formulaire newsletter en bas de page
2. Vérifiez votre email

## 🎨 **Personnalisation des Messages**

### **Modifier les messages de succès**
Dans `js/email-config.js` :
```javascript
const SUCCESS_MESSAGES = {
    contact: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les 24h.',
    candidature: 'Votre candidature a été reçue ! Nous l\'étudierons et vous recontacterons rapidement.',
    devis: 'Votre demande de devis a été envoyée ! Nous vous enverrons une proposition détaillée.',
    newsletter: 'Vous êtes maintenant inscrit à notre newsletter !'
};
```

### **Modifier les messages d'erreur**
```javascript
const ERROR_MESSAGES = {
    contact: 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.',
    candidature: 'Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.',
    devis: 'Erreur lors de l\'envoi de votre demande. Veuillez réessayer.',
    newsletter: 'Erreur lors de l\'inscription. Veuillez réessayer.'
};
```

## 🔒 **Sécurité et Spam**

### **Protection anti-spam Formspree**
- ✅ **Captcha automatique** si trop de soumissions
- ✅ **Filtrage des bots** intégré
- ✅ **Limitation de débit** configurable

### **Protection EmailJS**
- ✅ **Validation côté client** et serveur
- ✅ **Limitation de débit** configurable
- ✅ **Filtrage des adresses suspectes**

## 📊 **Suivi et Analytics**

### **Formspree Dashboard**
- 📈 **Statistiques** des soumissions
- 📧 **Historique** des emails reçus
- 🚫 **Gestion** du spam
- ⚙️ **Configuration** des notifications

### **EmailJS Dashboard**
- 📈 **Statistiques** d'envoi
- 📧 **Historique** des templates
- ⚙️ **Configuration** des services

## 🚨 **Dépannage**

### **Problème : Les formulaires ne fonctionnent pas**
**Solution :**
1. Vérifiez que `js/email-config.js` est chargé
2. Vérifiez que `js/form-handler.js` est chargé
3. Vérifiez la console pour les erreurs
4. Vérifiez que les URLs Formspree sont correctes

### **Problème : Pas d'emails reçus**
**Solution :**
1. Vérifiez votre dossier spam
2. Vérifiez que l'email est correct dans Formspree
3. Testez avec un autre email
4. Vérifiez les logs Formspree

### **Problème : Erreur CORS**
**Solution :**
1. Utilisez Formspree (pas de problème CORS)
2. Ou configurez un proxy CORS
3. Ou utilisez EmailJS

## 🎯 **Résumé des Actions à Faire**

1. ✅ **Créer 4 formulaires Formspree**
2. ✅ **Configurer `js/email-config.js`**
3. ✅ **Ajouter les scripts aux pages HTML**
4. ✅ **Tester tous les formulaires**
5. ✅ **Vérifier la réception des emails**

## 📞 **Support**

- **Formspree** : [support.formspree.io](https://support.formspree.io)
- **EmailJS** : [support.emailjs.com](https://support.emailjs.com)
- **Documentation** : Voir les commentaires dans le code

---

**🎉 Félicitations !** Votre site est maintenant configuré pour recevoir toutes les demandes directement sur votre email personnel !
