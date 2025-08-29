# 📸 Guide d'ajout d'images pour les actualités

## 🎯 Objectif
Ce guide vous explique comment ajouter facilement vos propres images pour les actualités du site.

## 📁 Structure des images attendues

Le système cherche automatiquement des images dans le dossier `images/actualites/` avec les noms suivants :

### 📋 Liste des images à ajouter :

1. **Formation AutoCAD 2025**
   - Fichier : `images/actualites/formation-autocad-2025.jpg`
   - ID : `formation-autocad-2025`
   - Titre : "Nouvelle formation AutoCAD 2025 disponible"

2. **Prix d'excellence 2024**
   - Fichier : `images/actualites/prix-excellence-2024.jpg`
   - ID : `prix-excellence-2024`
   - Titre : "Sorbo-Ingénierie remporte le prix d'excellence 2024"

3. **Logiciel OH-Route v1.1**
   - Fichier : `images/actualites/oh-route-v1-1.jpg`
   - ID : `oh-route-v1-1`
   - Titre : "Nouveau logiciel de calcul de structures OH-Route v1.1"

4. **Projet Grand-Bassam**
   - Fichier : `images/actualites/projet-grand-bassam.jpg`
   - ID : `projet-grand-bassam`
   - Titre : "Nouveau projet de lotissement à Grand-Bassam"

5. **Recrutement 2024**
   - Fichier : `images/actualites/recrutement-2024.jpg`
   - ID : `recrutement-2024`
   - Titre : "Recrutement : Ingénieurs et Topographes"

## 🔧 Comment ajouter une image :

### Méthode 1 : Ajout automatique
1. Placez votre image dans `images/actualites/`
2. Nommez-la exactement comme indiqué ci-dessus
3. Rechargez la page → L'image s'affichera automatiquement

### Méthode 2 : Ajout manuel via console
Si vous voulez utiliser un nom différent :
```javascript
// Dans la console du navigateur
activateActualiteImage('formation-autocad-2025', 'images/mon-image-autocad.jpg');
```

### Méthode 3 : Voir la liste des images attendues
```javascript
// Dans la console du navigateur
listActualiteImages();
```

## 📊 Formats d'images recommandés :
- **Format** : JPG, PNG, WebP
- **Taille** : 800x600 pixels (ratio 4:3)
- **Poids** : < 500KB pour optimiser le chargement
- **Qualité** : 85% pour un bon compromis qualité/poids

## 🛠️ Fonctionnalités incluses :

### 🔍 Détection automatique
- Le système teste automatiquement la présence des images
- Affichage automatique quand une image est trouvée
- Logs dans la console pour le debug

### 📱 Helper de développement
En mode local (localhost), un helper s'affiche en haut à droite avec :
- Liste des images attendues
- Chemins exacts des fichiers
- Statut de chaque image

### 🔄 Fallback intelligents
- Si une image personnalisée n'existe pas, affichage d'une image par défaut
- Pas de liens cassés
- Interface utilisateur toujours fonctionnelle

## 🧪 Test et validation :

1. **Vérifier les logs** : Ouvrez la console (F12) et cherchez les messages :
   - ✅ `Image trouvée: images/actualites/xxx.jpg`
   - ❌ `Image manquante: images/actualites/xxx.jpg`

2. **Helper visuel** : En local, regardez le helper en haut à droite

3. **Test manuel** : Utilisez `listActualiteImages()` dans la console

## 🚀 Déploiement :

Une fois vos images ajoutées localement :
1. Commitez les images : `git add images/actualites/`
2. Poussez : `git push origin main`
3. Les images apparaîtront sur le site en live

## ❓ Dépannage :

**Problème** : L'image ne s'affiche pas
- Vérifiez le nom exact du fichier
- Vérifiez l'extension (.jpg, .png, etc.)
- Regardez les logs de la console

**Problème** : Image déformée
- Utilisez un ratio 4:3 (800x600)
- Le CSS s'adaptera automatiquement

**Problème** : Chargement lent
- Optimisez la taille du fichier (< 500KB)
- Utilisez le format WebP si possible
