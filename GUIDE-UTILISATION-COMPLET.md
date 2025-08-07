# 🎯 Guide d'Utilisation - Système d'Administration Sorbo Ingénierie

## 🚀 **Vue d'ensemble**

Votre système d'administration permet de gérer tout le contenu de votre site web depuis un dashboard web, avec synchronisation automatique vers MongoDB Atlas et affichage dynamique sur le site.

## 📋 **Prérequis**

✅ MongoDB Atlas configuré  
✅ Backend démarré (`server-admin.js`)  
✅ Dashboard d'administration accessible  

## 🔐 **Accès au Dashboard**

### **1. Ouvrir le dashboard**
```
http://localhost:5000/admin-dashboard.html
```

### **2. Authentification**
- Token par défaut : `admin123`
- À changer en production dans le fichier `.env`

## 📊 **Fonctionnalités du Dashboard**

### **📊 Statistiques**
- Vue d'ensemble de tous les contenus
- Compteurs en temps réel
- État des publications

### **📰 Gestion des Actualités**
- ✅ **Créer** : Ajouter une nouvelle actualité
- ✅ **Modifier** : Éditer le contenu existant
- ✅ **Supprimer** : Supprimer une actualité
- ✅ **Statuts** : Brouillon, Publié, Archivé
- ✅ **Catégories** : Ingénierie, Formation, Technologie, etc.

### **💻 Gestion des Logiciels**
- ✅ **Créer** : Ajouter un nouveau logiciel
- ✅ **Modifier** : Éditer les informations
- ✅ **Supprimer** : Supprimer un logiciel
- ✅ **Disponibilité** : Activer/Désactiver
- ✅ **Prix** : Gestion des tarifs

### **💼 Gestion des Emplois**
- ✅ **Créer** : Ajouter un nouvel emploi
- ✅ **Modifier** : Éditer les détails
- ✅ **Supprimer** : Supprimer un emploi
- ✅ **Urgence** : Marquer comme urgent
- ✅ **Statuts** : Actif, Expiré, Archivé

### **🎓 Gestion des Formations**
- ✅ **Créer** : Ajouter une nouvelle formation
- ✅ **Modifier** : Éditer les détails
- ✅ **Supprimer** : Supprimer une formation
- ✅ **Disponibilité** : Activer/Désactiver
- ✅ **Niveaux** : Débutant, Intermédiaire, Avancé

### **📞 Gestion des Contacts**
- ✅ **Voir** : Consulter les messages reçus
- ✅ **Supprimer** : Supprimer un contact
- ✅ **Statuts** : Nouveau, En cours, Traité

## 🎯 **Comment utiliser le Dashboard**

### **1. Ajouter du contenu**

**Pour ajouter une actualité :**
1. Cliquez sur "📰 Actualités" dans la navigation
2. Cliquez sur "➕ Ajouter une actualité"
3. Remplissez le formulaire :
   - **Titre** : Titre de l'actualité
   - **Résumé** : Résumé court (max 300 caractères)
   - **Contenu** : Contenu complet de l'actualité
   - **Catégorie** : Choisir la catégorie
   - **Statut** : Brouillon ou Publié
4. Cliquez sur "💾 Sauvegarder"

**Pour ajouter un logiciel :**
1. Cliquez sur "💻 Logiciels" dans la navigation
2. Cliquez sur "➕ Ajouter un logiciel"
3. Remplissez le formulaire :
   - **Nom** : Nom du logiciel
   - **Description** : Description détaillée
   - **Catégorie** : AutoCAD, Covadis, etc.
   - **Prix** : Prix en FCFA
   - **Disponible** : Cocher si disponible
4. Cliquez sur "💾 Sauvegarder"

### **2. Modifier du contenu**

1. Trouvez l'élément dans la liste
2. Cliquez sur le bouton "✏️" (Modifier)
3. Modifiez les champs souhaités
4. Cliquez sur "💾 Sauvegarder"

### **3. Supprimer du contenu**

1. Trouvez l'élément dans la liste
2. Cliquez sur le bouton "🗑️" (Supprimer)
3. Confirmez la suppression

## 🌐 **Affichage sur le Site Web**

### **Contenu Dynamique**

Le contenu que vous ajoutez dans le dashboard s'affiche automatiquement sur votre site web :

**📰 Actualités :**
- Page d'accueil : Dernières actualités
- Page actualités : Liste complète
- URLs dynamiques : `/actualite/[slug]`

**💻 Logiciels :**
- Page logiciels : Liste des logiciels disponibles
- Liens de téléchargement dynamiques
- Prix et descriptions mises à jour

**💼 Emplois :**
- Page emplois : Liste des emplois actifs
- Badges "URGENT" pour les emplois prioritaires
- Dates limites automatiques

**🎓 Formations :**
- Page formations : Liste des formations disponibles
- Prix et durées dynamiques
- Boutons d'inscription fonctionnels

### **Synchronisation Automatique**

✅ **Temps réel** : Les modifications apparaissent immédiatement  
✅ **Pas de redéploiement** : Aucun redémarrage nécessaire  
✅ **Sauvegarde automatique** : MongoDB Atlas sauvegarde vos données  
✅ **Versioning** : Historique des modifications  

## 🔧 **Configuration Avancée**

### **1. Changer le token d'authentification**

Dans le fichier `.env` :
```env
ADMIN_TOKEN=votre_nouveau_token_securise
```

### **2. Personnaliser les catégories**

Modifiez les modèles dans `backend/models/` :
- `Actualite.js` : Catégories d'actualités
- `Logiciel.js` : Catégories de logiciels
- `Emploi.js` : Types de contrats
- `Formation.js` : Catégories de formations

### **3. Ajouter des champs personnalisés**

Exemple pour ajouter un champ "Auteur" aux actualités :

1. Modifiez `backend/models/Actualite.js`
2. Ajoutez le champ dans le formulaire du dashboard
3. Mettez à jour l'affichage sur le site

## 📱 **Interface Responsive**

Le dashboard s'adapte à tous les écrans :
- ✅ **Desktop** : Interface complète
- ✅ **Tablet** : Navigation adaptée
- ✅ **Mobile** : Interface optimisée

## 🚨 **Sécurité**

### **Bonnes pratiques :**

1. **Changez le token par défaut** en production
2. **Limitez l'accès** à l'IP de votre bureau
3. **Sauvegardez régulièrement** vos données
4. **Surveillez les logs** du serveur

### **En production :**

```env
ADMIN_TOKEN=token_tres_securise_avec_chiffrement
NODE_ENV=production
```

## 🔄 **Workflow Typique**

### **Exemple : Ajouter une nouvelle formation**

1. **Dashboard** → "🎓 Formations" → "➕ Ajouter une formation"
2. **Remplir le formulaire** :
   - Titre : "Formation AutoCAD 2024"
   - Description : "Apprenez AutoCAD de A à Z..."
   - Catégorie : "autocad"
   - Niveau : "débutant"
   - Prix : 150000
   - Durée : "5 jours"
   - Disponible : ✅
3. **Sauvegarder** → "💾 Sauvegarder"
4. **Vérifier** → Aller sur votre site web
5. **Résultat** : La formation apparaît automatiquement sur la page formations !

### **Exemple : Publier une actualité**

1. **Dashboard** → "📰 Actualités" → "➕ Ajouter une actualité"
2. **Remplir le formulaire** :
   - Titre : "Nouvelle formation disponible"
   - Résumé : "Nous lançons une nouvelle formation..."
   - Contenu : "Contenu complet de l'actualité..."
   - Catégorie : "formation"
   - Statut : "publie"
3. **Sauvegarder** → "💾 Sauvegarder"
4. **Vérifier** → Aller sur votre site web
5. **Résultat** : L'actualité apparaît sur la page d'accueil !

## 🎉 **Avantages du Système**

✅ **Gestion simplifiée** : Interface web intuitive  
✅ **Contenu dynamique** : Mises à jour en temps réel  
✅ **Pas de code** : Gestion sans programmation  
✅ **Sauvegarde automatique** : MongoDB Atlas sécurisé  
✅ **Multi-utilisateurs** : Plusieurs administrateurs possibles  
✅ **Historique** : Suivi des modifications  
✅ **Responsive** : Fonctionne sur tous les appareils  

## 📞 **Support et Dépannage**

### **Problèmes courants :**

**1. Dashboard inaccessible**
- Vérifiez que le serveur est démarré
- Vérifiez l'URL : `http://localhost:5000/admin-dashboard.html`

**2. Erreur d'authentification**
- Vérifiez le token dans `.env`
- Vérifiez les headers Authorization

**3. Contenu ne s'affiche pas**
- Vérifiez la connexion MongoDB Atlas
- Vérifiez les logs du serveur
- Vérifiez les erreurs dans la console

**4. Formulaire ne fonctionne pas**
- Vérifiez que tous les champs requis sont remplis
- Vérifiez la connexion internet
- Vérifiez les erreurs dans la console

### **Logs utiles :**

```bash
# Vérifier les logs du serveur
cd backend
npm run dev

# Tester l'API
node test-mongodb.js
```

## 🚀 **Prochaines étapes**

1. **Personnaliser** les catégories selon vos besoins
2. **Ajouter** des images pour vos contenus
3. **Configurer** l'envoi d'emails automatiques
4. **Mettre en production** avec un domaine
5. **Ajouter** des utilisateurs administrateurs
6. **Implémenter** des notifications en temps réel

## 🎯 **Conclusion**

Votre système d'administration est maintenant opérationnel ! Vous pouvez :

- ✅ **Gérer tout le contenu** depuis le dashboard
- ✅ **Voir les modifications** en temps réel sur le site
- ✅ **Sauvegarder automatiquement** dans MongoDB Atlas
- ✅ **Travailler en équipe** avec plusieurs administrateurs

**Votre site web est maintenant entièrement dynamique et facilement gérable !** 🚀


