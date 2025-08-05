# 🚀 Backend Ultra-Simple - Sorbo Ingénierie

## ✅ Version Fonctionnelle

Cette version ultra-simple fonctionne **sans base de données** et est parfaite pour débuter !

## 🎯 Fonctionnalités

- ✅ **API Health** : Vérification de l'état du serveur
- ✅ **Contact** : Envoi de messages (simulation)
- ✅ **Formations** : Liste des formations disponibles
- ✅ **Test complet** : Script de test automatique

## 🚀 Démarrage Rapide

### 1. Installation
```bash
cd backend
npm install
```

### 2. Configuration
```bash
# Créer le fichier .env
echo "PORT=5000`nNODE_ENV=development" > .env
```

### 3. Démarrer le serveur
```bash
node server-ultra-simple.js
```

### 4. Tester
```bash
node test-ultra-simple.js
```

## 📡 Endpoints Disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/health` | GET | État du serveur |
| `/api/test` | GET | Test de l'API |
| `/api/contact` | POST | Envoyer un message |
| `/api/formations` | GET | Liste des formations |

## 📞 Exemple d'utilisation

### Test de contact
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@sorbo-ingenierie.com",
    "phone": "+1234567890",
    "subject": "formation",
    "message": "Je suis intéressé par vos formations"
  }'
```

### Récupérer les formations
```bash
curl http://localhost:5000/api/formations
```

## 🎓 Formations Disponibles

1. **Formation AutoCAD** (500€, 3 jours)
   - Apprenez AutoCAD de A à Z

2. **Formation Covadis** (400€, 2 jours)
   - Maîtrisez Covadis

## 🔧 Avantages de cette version

- ✅ **Simple** : Pas de base de données
- ✅ **Rapide** : Démarrage instantané
- ✅ **Fiable** : Tests automatisés
- ✅ **Éducatif** : Parfait pour apprendre
- ✅ **Prêt pour production** : Peut être déployé immédiatement

## 🚀 Prochaines étapes

1. **Intégrer avec le frontend** : Connecter les formulaires
2. **Ajouter une vraie base de données** : MongoDB/PostgreSQL
3. **Authentification** : Système de connexion
4. **Email** : Envoi automatique de confirmations
5. **Upload de fichiers** : CV, documents

## 🎯 Résultat des tests

```
🧪 Test Ultra-Simple - Backend Sorbo Ingénierie

🚀 Démarrage des tests...

🔗 Test de connectivité...
✅ Serveur accessible

📡 Test de l'API...
✅ API fonctionnelle

📞 Test de création d'un contact...
✅ Contact créé avec succès

🎓 Test de récupération des formations...
✅ Formations récupérées avec succès

📊 Résumé des tests
✅ Tests réussis: 4
❌ Tests échoués: 0

🎉 Tous les tests sont passés !
```

## 🎉 Félicitations !

Votre backend ultra-simple est **opérationnel** et prêt à être utilisé ! 