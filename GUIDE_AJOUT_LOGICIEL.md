# Guide : Ajouter ou Modifier un Logiciel

Ce guide vous explique comment gérer vos logiciels (ajouter, modifier, changer les images, activer/désactiver le téléchargement) de manière autonome.

## Étape 1 : Préparer vos images

1.  Déposez vos images (logos et images de fond) dans le dossier `images/` de votre projet.
    *   Exemple : `images/mon-nouveau-logo.png`

## Étape 2 : Mettre à jour la configuration

1.  Ouvrez le fichier `GESTION_LOGICIELS.json` qui se trouve à la racine du projet.
2.  C'est une liste de logiciels. Pour ajouter un nouveau logiciel, copiez un bloc `{ ... }` existant et modifiez-le.

Exemple de structure :

```json
  {
    "nom": "Nom du Logiciel",
    "description": "Description courte du logiciel.",
    "categorie": "Infrastructures et Transports",
    "logo": "images/nom-du-logo.png",
    "headerImage": "images/nom-image-fond.jpg",
    "disponible": false,
    "version": "1.0",
    "prix": 0
  }
```

### Comment gérer le statut (Disponible vs Bientôt) ?
*   Si le logiciel est **prêt à être téléchargé** : Mettez `"disponible": true`.
    *   *Note : Le bouton "Télécharger" apparaîtra.*
*   Si le logiciel est **en développement** : Mettez `"disponible": false`.
    *   *Note : Le bouton "En cours de développement" apparaîtra et le bouton "Infos" affichera le message "Bientôt disponible".*

## Étape 3 : Envoyer les modifications

Une fois le fichier enregistré, envoyez les modifications sur GitHub :

1.  Ouvrez le terminal.
2.  Tapez :
    ```bash
    git add .
    git commit -m "Mise à jour des logiciels"
    git push
    ```

**C'est tout !** Le serveur va redémarrer automatiquement, lire votre fichier `GESTION_LOGICIELS.json` et mettre à jour la base de données.
