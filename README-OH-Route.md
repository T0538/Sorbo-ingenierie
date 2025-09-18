# Configuration d'OH-Route pour le téléchargement

## 🎯 Objectif
Rendre OH-Route disponible au téléchargement sur la page des logiciels de Sorbo-Ingénierie.

## 📋 Modifications effectuées

### 1. Fichier JavaScript (`js/logiciels-loader.js`)
- ✅ Modifié la logique de disponibilité pour inclure OH-Route
- ✅ Ajouté la gestion du téléchargement d'OH-Route
- ✅ Mis à jour les données de démonstration

### 2. Fichier de téléchargement
- ✅ Créé un fichier placeholder `OH-Route-v1.exe`
- ⚠️ **À remplacer par le vrai fichier exécutable**

### 3. Script de base de données
- ✅ Créé `update-oh-route.js` pour mettre à jour MongoDB

## 🚀 Étapes pour finaliser

### Étape 1 : Remplacer le fichier placeholder
```bash
# Supprimer le fichier placeholder
rm "OH-Route-v1.exe"

# Placer le vrai fichier exécutable OH-Route
# Le fichier doit s'appeler : OH-Route-v1.exe
```

### Étape 2 : Mettre à jour la base de données MongoDB
```bash
# Installer les dépendances si nécessaire
npm install mongodb

# Exécuter le script de mise à jour
node update-oh-route.js
```

### Étape 3 : Vérifier la configuration
1. Aller sur la page des logiciels
2. Vérifier qu'OH-Route affiche "📥 Télécharger" au lieu de "🔄 En cours de développement"
3. Tester le téléchargement

## 🔧 Configuration de la base de données

Le script `update-oh-route.js` va :
- Rechercher OH-Route dans la collection `logiciels`
- Mettre à jour le champ `disponible` à `true`
- Ajouter le lien de téléchargement `/OH-Route-v1.exe`
- Mettre à jour les informations (version, catégorie, fonctionnalités)

## 📊 Structure des données

```json
{
  "nom": "OH-Route",
  "version": "1.0",
  "categorie": "hydrologie",
  "disponible": true,
  "lienTelechargement": "/OH-Route-v1.exe",
  "fonctionnalites": [
    "Études hydrologiques",
    "Calculs hydrauliques",
    "Génie routier",
    "Analyse des bassins versants"
  ]
}
```

## 🐛 Résolution des problèmes

### Problème : Le bouton reste "En cours de développement"
**Solution :** Vérifier que :
1. Le fichier `OH-Route-v1.exe` existe dans le répertoire racine
2. La base de données a été mise à jour avec le script
3. Le nom du logiciel dans MongoDB correspond exactement à "OH-Route"

### Problème : Erreur de téléchargement
**Solution :** Vérifier que :
1. Le fichier exécutable est accessible
2. Les permissions de fichier sont correctes
3. Le chemin dans `lienTelechargement` est correct

## 📝 Notes importantes

- Le logiciel TALREN reste également disponible
- Les autres logiciels continuent d'afficher "En cours de développement"
- Le téléchargement se fait directement depuis le serveur (pas de redirection externe)

## 🎉 Résultat attendu

Après configuration, OH-Route devrait :
- ✅ Afficher "📥 Télécharger" au lieu de "🔄 En cours de développement"
- ✅ Permettre le téléchargement du fichier `OH-Route-v1.exe`
- ✅ Être marqué comme disponible dans la base de données
