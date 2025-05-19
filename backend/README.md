# Backend pour le site web de Sorbo-Ingénierie

Ce dossier contient le code backend pour le site web de Sorbo-Ingénierie, développé avec Node.js, Express et MongoDB.

## Architecture

Le backend est organisé selon une architecture MVC (Modèle-Vue-Contrôleur) :

- **Modèles** (`models/`) : Définissent la structure des données et interagissent avec la base de données MongoDB.
- **Contrôleurs** (`controllers/`) : Contiennent la logique métier de l'application.
- **Routes** (`routes/`) : Définissent les points d'entrée de l'API.
- **Middleware** (`middleware/`) : Contient des fonctions intermédiaires pour gérer l'authentification, les validations, etc.

## Fonctionnalités

Le backend implémente les fonctionnalités suivantes :

- **Authentification** : Inscription, connexion et gestion des utilisateurs avec JWT.
- **Gestion des contacts** : Formulaire de contact et gestion des demandes.
- **Formations** : CRUD pour les formations proposées par Sorbo-Ingénierie.
- **Emplois** : CRUD pour les offres d'emploi et gestion des candidatures.
- **Projets** : CRUD pour les projets d'ingénierie.
- **Logiciels** : CRUD pour les logiciels développés par Sorbo-Ingénierie.

## Installation

### Prérequis

- Node.js (v14.x ou supérieur)
- MongoDB (v4.x ou supérieur)

### Étapes

1. Clonez le dépôt :
   ```
   git clone <url-du-depot>
   cd sorbo-ingenierie-site-web/backend
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Configurez les variables d'environnement :
   - Créez un fichier `.env` à la racine du dossier `backend/`
   - Consultez le fichier `README-ENV.md` pour les détails de configuration

4. Démarrez MongoDB (si en local) :
   ```
   mongod
   ```

5. Lancez le serveur en mode développement :
   ```
   npm run dev
   ```

Le serveur sera disponible à l'adresse : `http://localhost:5000`

## Déploiement en production

Pour déployer en production :

1. Configurez les variables d'environnement pour la production (voir `README-ENV.md`).

2. Construisez l'application pour la production :
   ```
   npm run build
   ```

3. Démarrez le serveur en mode production :
   ```
   npm start
   ```

## Documentation de l'API

### Authentification

- `POST /api/auth/register` : Inscription d'un nouvel utilisateur
- `POST /api/auth/login` : Connexion d'un utilisateur
- `GET /api/auth/profile` : Récupération du profil de l'utilisateur connecté
- `PUT /api/auth/profile` : Mise à jour du profil de l'utilisateur connecté

### Contacts

- `POST /api/contact` : Envoi d'un message de contact
- `GET /api/contact` : Récupération de tous les messages (admin)
- `GET /api/contact/:id` : Récupération d'un message par son ID (admin)
- `PUT /api/contact/:id` : Mise à jour du statut d'un message (admin)
- `DELETE /api/contact/:id` : Suppression d'un message (admin)

### Formations

- `GET /api/formations` : Récupération de toutes les formations
- `GET /api/formations/:id` : Récupération d'une formation par son ID
- `POST /api/formations` : Création d'une nouvelle formation (admin)
- `PUT /api/formations/:id` : Mise à jour d'une formation (admin)
- `DELETE /api/formations/:id` : Suppression d'une formation (admin)
- `POST /api/formations/:id/testimonials` : Ajout d'un témoignage à une formation
- `POST /api/formations/:id/inscription` : Inscription à une formation

### Emplois

- `GET /api/emplois` : Récupération de toutes les offres d'emploi
- `GET /api/emplois/:id` : Récupération d'une offre d'emploi par son ID
- `POST /api/emplois` : Création d'une nouvelle offre d'emploi (admin)
- `PUT /api/emplois/:id` : Mise à jour d'une offre d'emploi (admin)
- `DELETE /api/emplois/:id` : Suppression d'une offre d'emploi (admin)
- `POST /api/emplois/:id/candidatures` : Soumission d'une candidature
- `GET /api/emplois/candidatures` : Récupération de toutes les candidatures (admin)
- `PUT /api/emplois/candidatures/:id` : Mise à jour du statut d'une candidature (admin)

### Projets

- `GET /api/projets` : Récupération de tous les projets
- `GET /api/projets/:id` : Récupération d'un projet par son ID
- `GET /api/projets/slug/:slug` : Récupération d'un projet par son slug
- `POST /api/projets` : Création d'un nouveau projet (admin)
- `PUT /api/projets/:id` : Mise à jour d'un projet (admin)
- `DELETE /api/projets/:id` : Suppression d'un projet (admin)

### Logiciels

- `GET /api/logiciels` : Récupération de tous les logiciels
- `GET /api/logiciels/:id` : Récupération d'un logiciel par son ID
- `GET /api/logiciels/slug/:slug` : Récupération d'un logiciel par son slug
- `POST /api/logiciels` : Création d'un nouveau logiciel (admin)
- `PUT /api/logiciels/:id` : Mise à jour d'un logiciel (admin)
- `DELETE /api/logiciels/:id` : Suppression d'un logiciel (admin)
- `POST /api/logiciels/:id/versions` : Ajout d'une version à un logiciel (admin)
- `POST /api/logiciels/:id/testimonials` : Ajout d'un témoignage à un logiciel 