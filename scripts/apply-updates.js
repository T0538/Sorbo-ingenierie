const Logiciel = require('../backend/models/Logiciel');
const fs = require('fs');
const path = require('path');

async function runUpdates() {
  try {
    console.log('🔄 Démarrage de la synchronisation des logiciels...');
    
    // Lire le fichier de configuration JSON
    const configPath = path.join(__dirname, '../GESTION_LOGICIELS.json');
    
    if (!fs.existsSync(configPath)) {
        console.log('⚠️ Fichier GESTION_LOGICIELS.json non trouvé. Aucune mise à jour effectuée.');
        return;
    }

    const logicielsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(`📋 ${logicielsConfig.length} logiciels trouvés dans la configuration.`);

    for (const config of logicielsConfig) {
        // Rechercher le logiciel par son nom (insensible à la casse)
        let logiciel = await Logiciel.findOne({ 
            nom: { $regex: new RegExp(`^${config.nom}$`, 'i') } 
        });

        if (logiciel) {
            console.log(`🔹 Mise à jour de : ${config.nom}`);
            
            // Mise à jour des champs
            logiciel.logo = config.logo;
            logiciel.headerImage = config.headerImage;
            logiciel.categorie = config.categorie;
            logiciel.description = config.description;
            logiciel.disponible = config.disponible;
            logiciel.image = config.logo; // Rétrocompatibilité
            
            if (config.version) logiciel.version = config.version;
            if (config.prix !== undefined) logiciel.prix = config.prix;

            await logiciel.save();
            console.log(`   ✅ Mis à jour ! (Disponible: ${config.disponible})`);
        } else {
            console.log(`🔸 Création de : ${config.nom}`);
            // Création d'un nouveau logiciel si inexistant
            logiciel = new Logiciel({
                nom: config.nom,
                description: config.description,
                categorie: config.categorie,
                logo: config.logo,
                headerImage: config.headerImage,
                image: config.logo,
                disponible: config.disponible,
                version: config.version || '1.0',
                prix: config.prix || 0
            });
            
            await logiciel.save();
            console.log(`   ✅ Créé !`);
        }
    }

    console.log('✨ Synchronisation terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  }
}

module.exports = { runUpdates };
