# 📚 COURS DE FORMATION - GESTION DU SITE SORBO-INGÉNIERIE

## 👋 BIENVENUE

Ce cours vous permettra de gérer le contenu du site web de Sorbo-Ingénierie, notamment :
- ✅ Ajouter des **Formations**
- ✅ Ajouter des **Logiciels**  
- ✅ Ajouter des **Projets**
- ✅ Ajouter des **Actualités**
- ✅ Ajouter des **Offres d'emploi**

**Pas besoin de maîtriser le code !** Ce guide vous expliquera tout pas à pas.

---

## 📖 TABLE DES MATIÈRES

1. [Introduction aux Technologies](#1-introduction-aux-technologies)
2. [Structure du Projet](#2-structure-du-projet)
3. [Accès au Tableau de Bord Admin](#3-accès-au-tableau-de-bord-admin)
4. [Ajouter une Formation](#4-ajouter-une-formation)
5. [Ajouter un Logiciel](#5-ajouter-un-logiciel)
6. [Ajouter un Projet](#6-ajouter-un-projet)
7. [Ajouter une Actualité](#7-ajouter-une-actualité)
8. [Ajouter une Offre d'Emploi](#8-ajouter-une-offre-demploi)
9. [Conseils et Bonnes Pratiques](#9-conseils-et-bonnes-pratiques)

---

# 1. INTRODUCTION AUX TECHNOLOGIES

## 🌐 Qu'est-ce qu'un Site Web ?

Un site web est comme un **livre numérique** accessible sur Internet. Il est composé de plusieurs éléments :

### A) **Frontend (La partie visible)**
C'est ce que les visiteurs voient et avec quoi ils interagissent.

**Technologies utilisées :**

#### 📄 HTML (HyperText Markup Language)
- **C'est quoi ?** Le squelette du site, comme la structure d'une maison
- **Exemple simple :**
```html
<h1>Titre principal</h1>
<p>Ceci est un paragraphe de texte</p>
<button>Cliquez ici</button>
```
- **Rôle :** Définit les éléments : titres, paragraphes, images, boutons, etc.

#### 🎨 CSS (Cascading Style Sheets)
- **C'est quoi ?** La décoration, comme la peinture et les meubles d'une maison
- **Exemple simple :**
```css
h1 {
  color: blue;
  font-size: 30px;
}
```
- **Rôle :** Rend le site joli : couleurs, tailles, positionnement

#### ⚙️ JavaScript (JS)
- **C'est quoi ?** L'électricité et les automatismes de la maison
- **Exemple simple :**
```javascript
// Afficher un message quand on clique sur un bouton
button.addEventListener('click', function() {
  alert('Bonjour !');
});
```
- **Rôle :** Rend le site interactif : animations, formulaires, mises à jour dynamiques

### B) **Backend (La partie invisible)**
C'est le "moteur" qui fait fonctionner le site en arrière-plan.

**Technologies utilisées :**

#### 🟢 Node.js
- **C'est quoi ?** Un environnement qui permet d'exécuter JavaScript côté serveur
- **Analogie :** Comme le moteur d'une voiture
- **Rôle :** Fait tourner le serveur web

#### 🚂 Express.js
- **C'est quoi ?** Un framework (boîte à outils) pour créer des serveurs web
- **Analogie :** Comme les rails pour un train
- **Rôle :** Gère les requêtes (demandes) des utilisateurs et envoie les réponses

#### 🗄️ MongoDB
- **C'est quoi ?** Une base de données (endroit où on stocke les informations)
- **Analogie :** Comme une bibliothèque géante avec des classeurs
- **Rôle :** Stocke toutes les données : formations, logiciels, projets, etc.

#### 🔐 Mongoose
- **C'est quoi ?** Un outil pour communiquer facilement avec MongoDB
- **Rôle :** Permet de créer, lire, modifier et supprimer des données

### C) **Comment ça communique ?**

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  FRONTEND   │ ───► │   BACKEND   │ ───► │  MONGODB    │
│  (HTML/CSS/ │ ◄─── │  (Node.js + │ ◄─── │ (Base de    │
│  JavaScript)│      │   Express)  │      │  données)   │
└─────────────┘      └─────────────┘      └─────────────┘
  Ce que vous       Le serveur qui        Où sont stockées
  voyez à l'écran   traite les demandes   toutes les données
```

**Exemple concret :**
1. Vous cliquez sur "Voir les formations" (Frontend)
2. Le serveur reçoit la demande (Backend - Express)
3. Le serveur demande les formations à MongoDB (Backend - Mongoose)
4. MongoDB renvoie les données
5. Le serveur envoie les données au Frontend
6. Vous voyez la liste des formations s'afficher

---

# 2. STRUCTURE DU PROJET

## 📁 Organisation des Fichiers

Le projet est organisé comme ceci :

```
Sorbo-ingenierie/
│
├── 📂 backend/              ← Partie serveur (arrière-plan)
│   ├── 📂 models/           ← Définitions des structures de données
│   │   ├── Formation.js     ← Structure d'une formation
│   │   ├── Logiciel.js      ← Structure d'un logiciel
│   │   ├── Projet.js        ← Structure d'un projet
│   │   ├── Actualite.js     ← Structure d'une actualité
│   │   └── Emploi.js        ← Structure d'une offre d'emploi
│   │
│   ├── 📂 routes/           ← Chemins d'accès aux données
│   │   ├── formationRoutes.js
│   │   ├── logicielRoutes.js
│   │   ├── projetRoutes.js
│   │   ├── actualiteRoutes.js
│   │   └── emploiRoutes.js
│   │
│   ├── 📂 controllers/      ← Logique de traitement des données
│   │   ├── formationController.js
│   │   ├── logicielController.js
│   │   ├── projetController.js
│   │   ├── actualiteController.js
│   │   └── emploiController.js
│   │
│   └── server.js            ← Fichier principal du serveur
│
├── 📂 css/                  ← Feuilles de style
├── 📂 js/                   ← Scripts JavaScript frontend
├── 📂 images/               ← Images du site
│
├── index.html               ← Page d'accueil
├── nos-formations.html      ← Page des formations
├── nos-logiciels.html       ← Page des logiciels
├── nos-projets.html         ← Page des projets
├── actualites.html          ← Page des actualités
├── nous-rejoindre.html      ← Page des offres d'emploi
│
└── admin-dashboard.html     ← Interface d'administration
```

## 🎯 Les Modèles de Données (Models)

Chaque type de contenu a sa propre structure. C'est comme un **formulaire** avec des champs obligatoires.

### Exemple : Modèle Formation
```javascript
{
  title: "Formation AutoCAD 2025",           // Obligatoire
  category: "logiciel",                      // Obligatoire
  type: "autocad",                           // Obligatoire
  description: "Formation complète...",       // Obligatoire
  duration: 5,                               // En jours
  price: 250000,                             // En FCFA
  image: "images/formation-autocad.jpg"      // Chemin de l'image
}
```

---

# 3. ACCÈS AU TABLEAU DE BORD ADMIN

## 🔐 Connexion à l'Interface Admin

### Étape 1 : Ouvrir la Page de Connexion
1. Ouvrez votre navigateur (Chrome, Firefox, Edge, etc.)
2. Allez sur : `https://votre-site.com/admin-login.html`
3. Vous verrez un formulaire de connexion

### Étape 2 : Se Connecter
1. Entrez votre **email administrateur**
2. Entrez votre **mot de passe**
3. Cliquez sur **"Se connecter"**

### Étape 3 : Accéder au Tableau de Bord
Une fois connecté, vous arrivez sur le tableau de bord qui affiche :
- **Statistiques** : nombre de formations, logiciels, projets, etc.
- **Menu de navigation** : accès aux différentes sections
- **Actions rapides** : boutons pour ajouter du contenu

## 🗂️ Navigation dans le Dashboard

Le tableau de bord a plusieurs onglets :
- **📊 Vue d'ensemble** : statistiques globales
- **📰 Actualités** : gérer les actualités
- **🎓 Formations** : gérer les formations
- **💻 Logiciels** : gérer les logiciels
- **🏗️ Projets** : gérer les projets
- **💼 Offres d'emploi** : gérer les offres

---

# 4. AJOUTER UNE FORMATION

## 📝 Informations Requises

Avant d'ajouter une formation, préparez ces informations :

### Informations de Base (OBLIGATOIRES)
- ✅ **Titre** : Nom de la formation (ex: "Formation AutoCAD 2025")
- ✅ **Catégorie** : Type de formation
  - `logiciel` : Formation sur un logiciel
  - `technique` : Formation technique
  - `methodologie` : Formation méthodologique
  - `certification` : Formation certifiante
  
- ✅ **Type** : Domaine spécifique
  - `covadis`, `autocad`, `robot`, `revit`, `genie-civil`, `hydraulique`, `autre`
  
- ✅ **Description** : Texte détaillé de la formation
- ✅ **Durée** : Nombre de jours (ex: 5)
- ✅ **Prix** : Montant en FCFA (ex: 250000)

### Informations Complémentaires (OPTIONNELLES)
- 📌 **Objectifs** : Liste des objectifs pédagogiques
- 📌 **Prérequis** : Connaissances nécessaires
- 📌 **Réduction** : Pourcentage de réduction (0-100)
- 📌 **Lieux** : `nos-locaux`, `client`, `distance`
- 📌 **Image** : URL de l'image de la formation
- 📌 **Programme** : Détails du contenu de formation

## 🛠️ Méthode 1 : Via l'Interface Admin (RECOMMANDÉ)

### Étape 1 : Accéder à la Section Formations
1. Connectez-vous au tableau de bord admin
2. Cliquez sur l'onglet **"Formations"**
3. Cliquez sur le bouton **"+ Ajouter une formation"**

### Étape 2 : Remplir le Formulaire
Un formulaire s'affiche avec tous les champs :

1. **Titre de la formation** :
   ```
   Formation AutoCAD Civil 3D 2025
   ```

2. **Catégorie** : Sélectionnez dans la liste déroulante
   ```
   Logiciel
   ```

3. **Type** : Sélectionnez le logiciel/domaine
   ```
   autocad
   ```

4. **Description** : Décrivez la formation
   ```
   Cette formation vous permettra de maîtriser AutoCAD Civil 3D 2025,
   le logiciel de référence pour les projets d'infrastructure.
   Vous apprendrez à créer des projets routiers, des réseaux...
   ```

5. **Durée (en jours)** :
   ```
   5
   ```

6. **Prix (en FCFA)** :
   ```
   350000
   ```

7. **Réduction (%)** (optionnel) :
   ```
   10
   ```

8. **Lieux de formation** : Cochez les options
   - ☑️ Nos locaux
   - ☐ Chez le client
   - ☑️ À distance

9. **Image** : URL de l'image
   ```
   images/formations/autocad-civil3d.jpg
   ```

### Étape 3 : Ajouter les Objectifs (Optionnel)
Cliquez sur **"+ Ajouter un objectif"** pour chaque objectif :
```
- Maîtriser l'interface d'AutoCAD Civil 3D
- Créer des projets routiers
- Gérer les profils en long et en travers
- Réaliser des calculs de cubatures
```

### Étape 4 : Ajouter les Prérequis (Optionnel)
Cliquez sur **"+ Ajouter un prérequis"** :
```
- Connaissance de base en dessin technique
- Notions d'AutoCAD classique
```

### Étape 5 : Définir le Programme (Optionnel)
Ajoutez les modules de formation :

**Module 1 : Introduction**
- Présentation du logiciel
- Interface et outils de base
- Configuration du projet

**Module 2 : Création de projet**
- Import de données topographiques
- Création de surfaces
- Conception de corridors

### Étape 6 : Valider
1. Vérifiez toutes les informations
2. Cliquez sur **"Enregistrer la formation"**
3. Un message de confirmation s'affiche
4. La formation est maintenant visible sur le site !

## 🔧 Méthode 2 : Via MongoDB Compass (AVANCÉ)

### Prérequis
- Avoir MongoDB Compass installé
- Avoir l'URL de connexion à MongoDB Atlas

### Étape 1 : Se Connecter à MongoDB
1. Ouvrez **MongoDB Compass**
2. Collez l'URL de connexion
3. Cliquez sur **"Connect"**

### Étape 2 : Accéder à la Collection
1. Sélectionnez la base de données : **`sorbo-ingenierie`**
2. Cliquez sur la collection : **`formations`**

### Étape 3 : Ajouter un Document
1. Cliquez sur **"ADD DATA"** → **"Insert Document"**
2. Supprimez le contenu par défaut
3. Copiez-collez ce modèle :

```json
{
  "title": "Formation Revit Architecture 2025",
  "category": "logiciel",
  "type": "revit",
  "description": "Formation complète sur Revit Architecture 2025 pour la modélisation BIM de bâtiments. Apprenez à créer des projets architecturaux complets en 3D.",
  "objectives": [
    "Maîtriser l'interface de Revit",
    "Créer des maquettes BIM",
    "Produire des plans et coupes",
    "Gérer les familles et composants"
  ],
  "prerequisites": [
    "Connaissance en architecture",
    "Notions de dessin technique"
  ],
  "duration": 5,
  "price": 400000,
  "discount": 0,
  "locations": ["nos-locaux", "distance"],
  "image": "images/formations/revit-architecture.jpg",
  "active": true,
  "featured": false
}
```

4. Cliquez sur **"Insert"**
5. La formation est créée !

---

# 5. AJOUTER UN LOGICIEL

## 📝 Informations Requises

### Informations de Base (OBLIGATOIRES)
- ✅ **Nom** : Nom du logiciel (ex: "OH-Route v1.1")
- ✅ **Description** : Description détaillée
- ✅ **Catégorie** : Type de logiciel
  - `autocad`, `covadis`, `robot`, `revit`, `civil3d`, `sketchup`, `autre`

### Informations Complémentaires (OPTIONNELLES)
- 📌 **Version** : Numéro de version (ex: "1.0", "2.5")
- 📌 **Prix** : Montant (0 si gratuit)
- 📌 **Devise** : "FCFA" par défaut
- 📌 **Image** : URL de l'image
- 📌 **Lien de téléchargement** : URL pour télécharger
- 📌 **Lien démo** : URL pour version d'essai
- 📌 **Fonctionnalités** : Liste des fonctions
- 📌 **Spécifications techniques** : Configuration requise

## 🛠️ Méthode 1 : Via l'Interface Admin

### Étape 1 : Accéder à la Section Logiciels
1. Tableau de bord → Onglet **"Logiciels"**
2. Bouton **"+ Ajouter un logiciel"**

### Étape 2 : Remplir le Formulaire

1. **Nom du logiciel** :
   ```
   OH-Route v2.0
   ```

2. **Catégorie** :
   ```
   autre
   ```

3. **Version** :
   ```
   2.0
   ```

4. **Description** :
   ```
   OH-Route est un logiciel professionnel pour la conception rapide
   de modèles HEC-RAS 1D/2D. Il permet l'analyse hydraulique et
   la cartographie des zones inondables.
   ```

5. **Prix** :
   ```
   0  (pour gratuit)
   ```

6. **Image** :
   ```
   images/logiciels/oh-route.jpg
   ```

7. **Lien de téléchargement** :
   ```
   https://drive.google.com/file/d/xxxxx/download
   ```

8. **Lien démo** (optionnel) :
   ```
   https://demo.oh-route.com
   ```

### Étape 3 : Ajouter les Fonctionnalités
Cliquez sur **"+ Ajouter une fonctionnalité"** :
```
- Création de modèles 1D/2D
- Cartographie des inondations
- Analyse hydraulique avancée
- Export vers HEC-RAS
- Interface intuitive
```

### Étape 4 : Spécifications Techniques
Remplissez les champs :
- **Système** : Windows 10/11
- **RAM** : 8 GB minimum
- **Espace disque** : 500 MB
- **Processeur** : Intel Core i5 ou équivalent

### Étape 5 : Options Supplémentaires
- ☑️ **Disponible** : Le logiciel est disponible au téléchargement
- ☐ **Populaire** : Mettre en avant sur la page d'accueil

### Étape 6 : Valider
Cliquez sur **"Enregistrer le logiciel"**

## 🔧 Méthode 2 : Via MongoDB Compass

```json
{
  "nom": "Sorbo Drainage Pro",
  "description": "Logiciel de dimensionnement de réseaux de drainage urbain et routier. Calculs hydrauliques conformes aux normes internationales.",
  "version": "3.2",
  "categorie": "autre",
  "prix": 150000,
  "devise": "FCFA",
  "image": "images/logiciels/drainage-pro.jpg",
  "lienTelechargement": "https://download.sorbo.com/drainage-pro-v3.2.exe",
  "lienDemo": "https://demo.sorbo.com/drainage",
  "fonctionnalites": [
    "Dimensionnement automatique des caniveaux",
    "Calcul des débits de ruissellement",
    "Profils hydrauliques",
    "Export des plans",
    "Base de données de matériaux"
  ],
  "specifications": {
    "systeme": "Windows 7/8/10/11",
    "ram": "4 GB",
    "espace": "200 MB",
    "processeur": "Intel Pentium 4 ou supérieur"
  },
  "disponible": true,
  "populaire": false,
  "note": 4.5,
  "nombreTelechargements": 0
}
```

---

# 6. AJOUTER UN PROJET

## 📝 Informations Requises

### Informations de Base (OBLIGATOIRES)
- ✅ **Titre** : Nom du projet
- ✅ **Catégorie** : Type de projet
  - `batiment`, `genie-civil`, `hydraulique`, `route`, `environnement`, `autre`
- ✅ **Description** : Description détaillée du projet

### Informations Complémentaires (OPTIONNELLES)
- 📌 **Client** : Nom, type (public/privé), pays, ville
- 📌 **Prestations** : Services fournis
  - `etude`, `conception`, `suivi`, `expertise`, `autre`
- 📌 **Localisation** : Pays, ville, coordonnées GPS
- 📌 **Dates** : Date de début et de fin
- 📌 **Statut** : `en_cours`, `termine`, `en_pause`, `annule`
- 📌 **Images** : Photos du projet
- 📌 **Budget** : Fourchette budgétaire
- 📌 **Défis, Solutions, Résultats**

## 🛠️ Via l'Interface Admin

### Étape 1 : Formulaire de Base

1. **Titre du projet** :
   ```
   Construction du Pont de la Solidarité
   ```

2. **Catégorie** :
   ```
   genie-civil
   ```

3. **Client - Nom** :
   ```
   Ministère des Infrastructures
   ```

4. **Client - Type** :
   ```
   public
   ```

5. **Client - Pays** :
   ```
   Burkina Faso
   ```

6. **Client - Ville** :
   ```
   Ouagadougou
   ```

7. **Description** :
   ```
   Construction d'un pont à poutres de 120 mètres de longueur
   au-dessus de la rivière Nakambé. Le projet comprend les études
   géotechniques, la conception structurelle, et le suivi des travaux.
   ```

### Étape 2 : Prestations
Cochez les services fournis :
- ☑️ Étude
- ☑️ Conception
- ☑️ Suivi de travaux
- ☐ Expertise

### Étape 3 : Localisation

1. **Pays** :
   ```
   Burkina Faso
   ```

2. **Ville** :
   ```
   Ouagadougou
   ```

3. **Coordonnées GPS** (optionnel) :
   - **Latitude** : 12.3714
   - **Longitude** : -1.5197

### Étape 4 : Dates et Statut

1. **Date de début** :
   ```
   2023-06-01
   ```

2. **Date de fin** :
   ```
   2024-12-31
   ```

3. **Statut** :
   ```
   en_cours
   ```

### Étape 5 : Budget
```
20m-50m  (signifie entre 20 et 50 millions FCFA)
```

Options : `moins-5m`, `5m-20m`, `20m-50m`, `50m-100m`, `plus-100m`, `confidentiel`

### Étape 6 : Images
Ajoutez les URLs des images :
```
- images/projets/pont-solidarite-1.jpg
- images/projets/pont-solidarite-2.jpg
- images/projets/pont-solidarite-3.jpg
```

### Étape 7 : Défis, Solutions, Résultats

**Défis** :
```
- Terrain instable avec nappe phréatique élevée
- Contraintes environnementales strictes
- Délais serrés
```

**Solutions** :
```
- Fondations profondes sur pieux
- Étude d'impact environnemental approfondie
- Planning optimisé avec équipes renforcées
```

**Résultats** :
```
- Pont livré dans les délais
- Respect des normes environnementales
- Satisfaction du client
```

### Étape 8 : Technologies Utilisées
```
- AutoCAD Civil 3D
- Robot Structural Analysis
- Logiciels de calcul géotechnique
```

### Étape 9 : Options
- ☑️ **Projet mis en avant** : Afficher sur la page d'accueil

### Étape 10 : Valider
Cliquez sur **"Enregistrer le projet"**

## 🔧 Via MongoDB Compass

```json
{
  "titre": "Aménagement Urbain du Quartier de Koudougou",
  "categorie": "route",
  "client": {
    "nom": "Mairie de Koudougou",
    "type": "public",
    "pays": "Burkina Faso",
    "ville": "Koudougou"
  },
  "description": "Projet d'aménagement complet comprenant la construction de 5 km de voiries bitumées, l'installation de réseaux d'assainissement, et l'éclairage public.",
  "prestations": ["etude", "conception", "suivi"],
  "localisation": {
    "pays": "Burkina Faso",
    "ville": "Koudougou",
    "coordonnees": {
      "lat": 12.2525,
      "lng": -2.3619
    }
  },
  "dateDebut": "2024-01-15T00:00:00.000Z",
  "dateFin": "2025-06-30T00:00:00.000Z",
  "statut": "en_cours",
  "images": [
    "images/projets/koudougou-1.jpg",
    "images/projets/koudougou-2.jpg"
  ],
  "budget": "50m-100m",
  "defis": [
    "Coordination avec les services municipaux",
    "Gestion du trafic pendant les travaux",
    "Intégration des réseaux existants"
  ],
  "solutions": [
    "Planning par phases",
    "Déviations temporaires",
    "Levés topographiques précis"
  ],
  "resultats": [
    "Amélioration de la mobilité urbaine",
    "Réduction des inondations"
  ],
  "technologies": [
    "AutoCAD Civil 3D",
    "GPS différentiel",
    "Logiciels de dimensionnement"
  ],
  "featured": true
}
```

---
