const Logiciel = require('../backend/models/Logiciel');

async function runUpdates() {
  try {
    console.log('🔄 Checking for software updates...');
    
    // Find the software
    const target = await Logiciel.findOne({ 
      $or: [
        { nom: { $regex: /chaussée/i } },
        { nom: { $regex: /str-/i } }
      ]
    });

    if (target) {
      console.log(`🎯 Found software: ${target.nom}`);
      let updated = false;

      // Check and update logo
      if (target.logo !== 'images/geopavetotal.jpg.jpeg') {
        target.logo = 'images/geopavetotal.jpg.jpeg';
        updated = true;
      }
      
      // Check and update header image
      if (target.headerImage !== 'images/Image autoroute.png') {
        target.headerImage = 'images/Image autoroute.png';
        updated = true;
      }
      
      // Check and update category
      if (target.categorie !== 'Infrastructures et Transports') {
        target.categorie = 'Infrastructures et Transports';
        updated = true;
      }
      
      // Also update the old 'image' field for compatibility
      if (target.image !== 'images/geopavetotal.jpg.jpeg') {
          target.image = 'images/geopavetotal.jpg.jpeg';
          updated = true;
      }

      if (updated) {
        await target.save();
        console.log('✅ Software updated successfully!');
      } else {
        console.log('👌 Software is already up to date.');
      }
    } else {
      console.log('⚠️ Target software "Str-Chaussée" not found.');
    }
  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

module.exports = { runUpdates };
